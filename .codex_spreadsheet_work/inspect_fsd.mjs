import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = String.raw`C:\Users\ADMIN\Documents\code-work\Newwave\BrSE_Training\AI_Training\Newwave_AI_Training\Project_ngan\02_Design\design-sample\BM13_NWS_P001_SCR-01_FSD_v1.0 - Copy.xlsx`;
const outputDir = String.raw`C:\Users\ADMIN\Documents\code-work\Newwave\BrSE_Training\AI_Training\Newwave_AI_Training\.codex_spreadsheet_work\preview`;

await fs.mkdir(outputDir, { recursive: true });
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));

console.log((await workbook.inspect({
  kind: "workbook,sheet,table,drawing",
  maxChars: 12000,
  tableMaxRows: 30,
  tableMaxCols: 20,
  tableMaxCellChars: 180,
})).ndjson);

for (const sheet of workbook.worksheets.items) {
  const used = sheet.getUsedRange();
  console.log(`SHEET=${sheet.name} USED=${used?.address ?? "none"}`);
  for (const range of ["A1:G25"]) {
    console.log(`--- ${range} ---`);
    console.log((await workbook.inspect({
      kind: "table",
      sheetId: sheet.name,
      range,
      maxChars: 14000,
      tableMaxRows: 200,
      tableMaxCols: 26,
      tableMaxCellChars: 260,
    })).ndjson);
  }
  const safeName = sheet.name.replace(/[<>:"/\\|?*]/g, "_");
  for (const [idx, range] of ["A1:G25"].entries()) {
    const preview = await workbook.render({
      sheetName: sheet.name,
      range,
      scale: 0.65,
      format: "png",
    });
    await fs.writeFile(path.join(outputDir, `${safeName}_${idx + 1}.png`), new Uint8Array(await preview.arrayBuffer()));
  }
}
