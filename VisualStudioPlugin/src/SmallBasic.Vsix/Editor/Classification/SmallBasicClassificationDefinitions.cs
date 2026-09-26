namespace SmallBasic.Vsix.Editor.Classification
{
    using System.ComponentModel.Composition;
    using Microsoft.VisualStudio.Text.Classification;
    using Microsoft.VisualStudio.Utilities;

    internal static class SmallBasicClassificationNames
    {
        public const string Keyword = "sb-keyword";
        public const string String = "sb-string";
        public const string Number = "sb-number";
        public const string Comment = "sb-comment";
        public const string Library = "sb-library";
    }

    internal static class SmallBasicClassificationTypes
    {
        // BaseDefinition links each custom classification to the corresponding
        // built-in classification type so that it inherits the theme colors
        // (without a base definition the format is empty and all text renders
        // in the default foreground color).
        [Export(typeof(ClassificationTypeDefinition))]
        [Name(SmallBasicClassificationNames.Keyword)]
        [BaseDefinition("keyword")]
        internal static ClassificationTypeDefinition KeywordType = null;

        [Export(typeof(ClassificationTypeDefinition))]
        [Name(SmallBasicClassificationNames.String)]
        [BaseDefinition("string")]
        internal static ClassificationTypeDefinition StringType = null;

        [Export(typeof(ClassificationTypeDefinition))]
        [Name(SmallBasicClassificationNames.Number)]
        [BaseDefinition("number")]
        internal static ClassificationTypeDefinition NumberType = null;

        [Export(typeof(ClassificationTypeDefinition))]
        [Name(SmallBasicClassificationNames.Comment)]
        [BaseDefinition("comment")]
        internal static ClassificationTypeDefinition CommentType = null;

        [Export(typeof(ClassificationTypeDefinition))]
        [Name(SmallBasicClassificationNames.Library)]
        [BaseDefinition("class name")]
        internal static ClassificationTypeDefinition LibraryType = null;
    }

    [Export(typeof(EditorFormatDefinition))]
    [ClassificationType(ClassificationTypeNames = SmallBasicClassificationNames.Keyword)]
    [Name(SmallBasicClassificationNames.Keyword)]
    [UserVisible(true)]
    internal sealed class SmallBasicKeywordFormat : ClassificationFormatDefinition
    {
        public SmallBasicKeywordFormat()
        {
            this.DisplayName = "SmallBasic Keyword";
        }
    }

    [Export(typeof(EditorFormatDefinition))]
    [ClassificationType(ClassificationTypeNames = SmallBasicClassificationNames.String)]
    [Name(SmallBasicClassificationNames.String)]
    [UserVisible(true)]
    internal sealed class SmallBasicStringFormat : ClassificationFormatDefinition
    {
        public SmallBasicStringFormat()
        {
            this.DisplayName = "SmallBasic String";
        }
    }

    [Export(typeof(EditorFormatDefinition))]
    [ClassificationType(ClassificationTypeNames = SmallBasicClassificationNames.Number)]
    [Name(SmallBasicClassificationNames.Number)]
    [UserVisible(true)]
    internal sealed class SmallBasicNumberFormat : ClassificationFormatDefinition
    {
        public SmallBasicNumberFormat()
        {
            this.DisplayName = "SmallBasic Number";
        }
    }

    [Export(typeof(EditorFormatDefinition))]
    [ClassificationType(ClassificationTypeNames = SmallBasicClassificationNames.Comment)]
    [Name(SmallBasicClassificationNames.Comment)]
    [UserVisible(true)]
    internal sealed class SmallBasicCommentFormat : ClassificationFormatDefinition
    {
        public SmallBasicCommentFormat()
        {
            this.DisplayName = "SmallBasic Comment";
        }
    }

    [Export(typeof(EditorFormatDefinition))]
    [ClassificationType(ClassificationTypeNames = SmallBasicClassificationNames.Library)]
    [Name(SmallBasicClassificationNames.Library)]
    [UserVisible(true)]
    internal sealed class SmallBasicLibraryFormat : ClassificationFormatDefinition
    {
        public SmallBasicLibraryFormat()
        {
            this.DisplayName = "SmallBasic Library";
        }
    }
}
