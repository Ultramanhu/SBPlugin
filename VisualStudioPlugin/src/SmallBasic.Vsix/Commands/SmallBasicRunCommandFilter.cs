namespace SmallBasic.Vsix.Commands
{
    using System;
    using System.ComponentModel.Composition;
    using System.Diagnostics;
    using System.IO;
    using System.Linq;
    using System.Runtime.InteropServices;
    using System.Windows;
    using Microsoft.VisualStudio;
    using Microsoft.VisualStudio.Editor;
    using Microsoft.VisualStudio.OLE.Interop;
    using Microsoft.VisualStudio.Text;
    using Microsoft.VisualStudio.Text.Editor;
    using Microsoft.VisualStudio.TextManager.Interop;
    using Microsoft.VisualStudio.Utilities;
    using SmallBasic.Compiler;

    /// <summary>
    /// Installs a command filter on every Small Basic text view so that F5 / Ctrl+F5
    /// run the active .sb file. This is MEF-only and requires no package or VSCT.
    /// </summary>
    [Export(typeof(ITextViewCreationListener))]
    [Name("SmallBasic Run Command Filter")]
    [ContentType("smallbasic")]
    [TextViewRole(PredefinedTextViewRoles.Document)]
    internal sealed class SmallBasicRunCommandFilterInstaller : ITextViewCreationListener
    {
        [Import]
        internal IVsEditorAdaptersFactoryService EditorAdaptersFactoryService = null!;

        public void TextViewCreated(ITextView textView)
        {
            IVsTextView? viewAdapter = this.EditorAdaptersFactoryService.GetViewAdapter(textView);
            if (viewAdapter != null)
            {
                var filter = new SmallBasicRunCommandFilter(textView);
                viewAdapter.AddCommandFilter(filter, out IOleCommandTarget? next);
                filter.SetNext(next);
            }
        }
    }

    internal sealed class SmallBasicRunCommandFilter : IOleCommandTarget
    {
        private readonly ITextView textView;
        private IOleCommandTarget? next;

        public SmallBasicRunCommandFilter(ITextView textView)
        {
            this.textView = textView;
        }

        internal void SetNext(IOleCommandTarget? nextTarget)
        {
            this.next = nextTarget;
        }

        public int QueryStatus(ref Guid pguidCmdGroup, uint cCmds, OLECMD[] prgCmds, IntPtr pCmdText)
        {
            if (pguidCmdGroup == VSConstants.GUID_VSStandardCommandSet97
                && this.IsRunCommand(prgCmds)
                && this.TryGetSmallBasicDocument(out _))
            {
                for (int i = 0; i < prgCmds.Length; i++)
                {
                    prgCmds[i].cmdf = (uint)(OLECMDF.OLECMDF_SUPPORTED | OLECMDF.OLECMDF_ENABLED);
                }

                return VSConstants.S_OK;
            }

            return this.ForwardQueryStatus(ref pguidCmdGroup, cCmds, prgCmds, pCmdText);
        }

        public int Exec(ref Guid pguidCmdGroup, uint nCmdID, uint nCmdexecopt, IntPtr pvaIn, IntPtr pvaOut)
        {
            if (pguidCmdGroup == VSConstants.GUID_VSStandardCommandSet97
                && (nCmdID == (uint)VSConstants.VSStd97CmdID.Start || nCmdID == (uint)VSConstants.VSStd97CmdID.StartNoDebug)
                && this.TryGetSmallBasicDocument(out ITextDocument? document))
            {
                if (nCmdID == (uint)VSConstants.VSStd97CmdID.Start)
                {
                    this.Debug(document!);
                }
                else
                {
                    this.Run(document!);
                }

                return VSConstants.S_OK;
            }

            if (this.next != null)
            {
                return this.next.Exec(ref pguidCmdGroup, nCmdID, nCmdexecopt, pvaIn, pvaOut);
            }

            return (int)Constants.OLECMDERR_E_NOTSUPPORTED;
        }

        private int ForwardQueryStatus(ref Guid pguidCmdGroup, uint cCmds, OLECMD[] prgCmds, IntPtr pCmdText)
        {
            if (this.next != null)
            {
                return this.next.QueryStatus(ref pguidCmdGroup, cCmds, prgCmds, pCmdText);
            }

            return (int)Constants.OLECMDERR_E_NOTSUPPORTED;
        }

        private bool IsRunCommand(OLECMD[] prgCmds)
        {
            return prgCmds.Any(cmd =>
                cmd.cmdID == (uint)VSConstants.VSStd97CmdID.Start ||
                cmd.cmdID == (uint)VSConstants.VSStd97CmdID.StartNoDebug);
        }

        private bool TryGetSmallBasicDocument(out ITextDocument? document)
        {
            document = null;
            ITextBuffer buffer = this.textView.TextBuffer;
            if (!buffer.ContentType.IsOfType("smallbasic"))
            {
                return false;
            }

            return buffer.Properties.TryGetProperty(typeof(ITextDocument), out document)
                && document != null
                && !string.IsNullOrEmpty(document.FilePath);
        }

        private void Run(ITextDocument document)
        {
            try
            {
                if (!this.TrySaveAndCompile(document, out _))
                {
                    return;
                }

                this.StartRunHost(document.FilePath);
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    $"运行失败：{ex.Message}",
                    "Small Basic",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }

        private void Debug(ITextDocument document)
        {
            try
            {
                if (!this.TrySaveAndCompile(document, out SmallBasicCompilation? compilation))
                {
                    return;
                }

                if (compilation!.Analysis.UsesGraphicsWindow)
                {
                    MessageBox.Show(
                        "图形程序当前暂不支持调试模式，已自动改为直接运行。",
                        "Small Basic",
                        MessageBoxButton.OK,
                        MessageBoxImage.Information);
                    this.StartRunHost(document.FilePath);
                    return;
                }

                SmallBasicDebugLauncher.Launch(document.FilePath);
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    $"启动调试失败：{ex.Message}",
                    "Small Basic",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }

        private bool TrySaveAndCompile(ITextDocument document, out SmallBasicCompilation? compilation)
        {
            compilation = null;
            document.Save();

            compilation = new SmallBasicCompilation(this.textView.TextBuffer.CurrentSnapshot.GetText());
            if (compilation.Diagnostics.Count == 0)
            {
                return true;
            }

            string errors = string.Join(
                Environment.NewLine,
                compilation.Diagnostics.Take(10).Select(d => d.ToDisplayString()));
            MessageBox.Show(
                $"程序包含错误：{Environment.NewLine}{errors}",
                "Small Basic",
                MessageBoxButton.OK,
                MessageBoxImage.Error);
            return false;
        }

        private void StartRunHost(string filePath)
        {
            string extensionDirectory = Path.GetDirectoryName(typeof(SmallBasicRunCommandFilter).Assembly.Location) ?? string.Empty;
            string runHostPath = Path.Combine(extensionDirectory, "RunHost", "SmallBasic.RunHost.exe");
            if (!File.Exists(runHostPath))
            {
                MessageBox.Show(
                    $"未找到 Small Basic 运行宿主：{runHostPath}",
                    "Small Basic",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
                return;
            }

            Process.Start(new ProcessStartInfo
            {
                FileName = runHostPath,
                Arguments = $"run --file \"{filePath}\" --pause",
                WorkingDirectory = Path.GetDirectoryName(filePath) ?? extensionDirectory,
                UseShellExecute = true,
            });
        }
    }
}
