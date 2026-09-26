import { DocumentationResources } from "./vendor/SmallBasicOnline/src/strings/documentation";

const documentationResourcePatches: Record<string, string> = {
  Program_Delay: "Delays program execution by the specified amount of MilliSeconds.",
  Program_Delay_milliSeconds: "The amount of delay."
};

for (const [key, value] of Object.entries(documentationResourcePatches)) {
  if (!DocumentationResources.get(key)) {
    (DocumentationResources as Record<string, string | ((resourceKey: string) => string)>)[key] = value;
  }
}