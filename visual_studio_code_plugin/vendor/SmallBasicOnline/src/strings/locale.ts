import { documentationLocales } from "./documentation.locales";

// Maps UI languages that cannot be resolved by a plain name/prefix match
// (values use the locale names of the documentation XML files).
const exactMatches: Readonly<Record<string, string>> = {
    "zh-cn": "zh-Hans",
    "zh-tw": "zh-Hant",
    "zh-hk": "zh-Hant",
    "zh-mo": "zh-Hant",
    "pt-br": "pt-br",
    "pt-pt": "pt-pt"
};

/**
 * Resolves a UI language identifier (e.g. vscode.env.language, a BCP-47 tag
 * such as "zh-cn" or "de") to a documentation locale that ships translations.
 * Returns undefined when only the English fallback resources should be used.
 */
export function resolveDocumentationLocale(language: string | undefined): string | undefined {
    if (!language) {
        return undefined;
    }

    const normalized = language.toLowerCase();
    if (normalized === "en" || normalized.startsWith("en-")) {
        return undefined;
    }

    const exact = exactMatches[normalized];
    if (exact !== undefined) {
        return exact;
    }

    // Fall back to the primary subtag, e.g. "de-CH" -> "de". Chinese is
    // excluded because it requires a script/region distinction (Hans/Hant).
    const primary = normalized.split("-")[0];
    if (primary !== "zh" && documentationLocales[primary] !== undefined) {
        return primary;
    }

    return undefined;
}
