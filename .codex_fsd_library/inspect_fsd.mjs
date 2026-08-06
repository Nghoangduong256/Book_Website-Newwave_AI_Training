import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = "C:/Users/ADMIN/Documents/code-work/Newwave/BrSE_Training/AI_Training/Newwave_AI_Training_Management/03_Design/design-sample/BM13_NWS_P001_SCR-01_FSD_v1.0 - Copy.xlsx";
const previewDir = "C:/Users/ADMIN/Documents/code-work/Newwave/BrSE_Training/AI_Training/Newwave_AI_Training/.codex_fsd_library/inspect";
await fs.mkdir(previewDir, { recursive: true });
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(input));
console.log((await wb.inspect({ kind: "workbook,sheet,table,drawing", maxChars: 12000, tableMaxRows: 12, tableMaxCols: 16 })).ndjson);
for (const s of wb.worksheets.items) {
  const used = s.getUsedRange();
  if (!used) continue;
  console.log(`SHEET ${s.name} ${used.address}`);
  console.log((await wb.inspect({ kind: "table", sheetId: s.name, range: used.address, include: "values,formulas", tableMaxRows: 120, tableMaxCols: 20, tableMaxCellChars: 200, maxChars: 60000 })).ndjson);
  const img = await wb.render({ sheetName: s.name, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(`${previewDir}/${s.name.replace(/[^a-z0-9_-]/gi, "_")}.png`, new Uint8Array(await img.arrayBuffer()));
}
