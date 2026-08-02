import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const file = String.raw`C:\Users\ADMIN\Documents\code-work\Newwave\BrSE_Training\AI_Training\Newwave_AI_Training\outputs\019f9365-4e80-7710-be67-ea5932043629\BM13_NWS_P001_SCR-01_Dashboard_FSD_v1.0.xlsx`;
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(file));
console.log((await workbook.inspect({
  kind: "sheet,drawing",
  maxChars: 12000,
})).ndjson);
