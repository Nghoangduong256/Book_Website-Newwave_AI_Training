import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const input = "C:/Users/ADMIN/Documents/code-work/Newwave/BrSE_Training/AI_Training/Newwave_AI_Training_Management/03_Design/design-sample/BM13_NWS_P001_SCR-01_FSD_v1.0 - Copy.xlsx";
const outputDir = "C:/Users/ADMIN/Documents/code-work/Newwave/BrSE_Training/AI_Training/Newwave_AI_Training/outputs/019fb277-6ade-7ea3-b15c-31bb5bf24908";
const previewDir = "C:/Users/ADMIN/Documents/code-work/Newwave/BrSE_Training/AI_Training/Newwave_AI_Training/.codex_fsd_library/preview";
await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(input));
const s = wb.worksheets.getItemAt(0);
s.name = "SCR-04 Favourite";

const set = (cell, value) => { s.getRange(cell).values = [[value]]; };
const mergeSet = (address, value) => {
  const r = s.getRange(address);
  try { r.unmerge(); } catch {}
  r.merge();
  r.values = [[value]];
};
const section = (row, title) => {
  mergeSet(`A${row}:G${row}`, title);
  const r = s.getRange(`A${row}:G${row}`);
  r.format.fill = "#004A8F";
  r.format.font = { bold: true, color: "#FFFFFF", size: 11 };
  r.format.verticalAlignment = "center";
  r.format.rowHeight = 22;
};
const tableHeader = (row) => {
  const vals = [["ID", "Main", "Sub", "Description", "Note/ Assumption", "Ticket link"]];
  s.getRange(`A${row}:D${row}`).values = [[vals[0][0], vals[0][1], vals[0][2], vals[0][3]]];
  mergeSet(`D${row}:E${row}`, "Description");
  set(`F${row}`, "Note/ Assumption"); set(`G${row}`, "Ticket link");
  const r = s.getRange(`A${row}:G${row}`);
  r.format.fill = "#0070C0";
  r.format.font = { bold: true, color: "#FFFFFF", size: 10 };
  r.format.horizontalAlignment = "center";
  r.format.verticalAlignment = "center";
  r.format.rowHeight = 24;
  r.format.borders = { preset: "all", style: "thin", color: "#5B6573" };
};
const writeRows = (start, rows) => {
  rows.forEach((row, i) => {
    const rr = start + i;
    set(`A${rr}`, row[0]); set(`B${rr}`, row[1]); set(`C${rr}`, row[2]);
    mergeSet(`D${rr}:E${rr}`, row[3]); set(`F${rr}`, row[4] ?? ""); set(`G${rr}`, row[5] ?? "");
    const range = s.getRange(`A${rr}:G${rr}`);
    range.format.fill = "#FFFFFF";
    range.format.wrapText = true;
    range.format.verticalAlignment = "top";
    range.format.horizontalAlignment = "left";
    range.format.rowHeight = row[6] ?? 50;
    range.format.borders = { preset: "all", style: "thin", color: "#A6A6A6" };
    if (i % 2 === 1) range.format.fill = "#F6F8FA";
  });
};

// Clear the former MD-01 content while keeping the company's general worksheet layout.
s.getRange("A1:G120").clear({ applyTo: "contents" });

set("A2", "Epic"); set("B2", "Truyenthieu");
set("A3", "Screen name"); set("B3", "SCR-04 Favourite");
set("A4", "Status"); set("B4", "Done");
s.getRange("A2:A4").format.font = { bold: true, color: "#004A8F" };
s.getRange("A2:B4").format.borders = { preset: "all", style: "thin", color: "#A6A6A6" };

section(8, "Purpose");
mergeSet("A9:G10", "Display and manage documents marked as Favourite. The user can review metadata and progress, search, filter and sort favourite records, open Book Details (MD-01), read or edit a document, delete it, or remove it from the Favourite list.");
s.getRange("A9:G10").format.wrapText = true; s.getRange("A9:G10").format.verticalAlignment = "top";

section(12, "Wireframes/Design");
mergeSet("A13:G14", "Main design: Favourite_SCR-04.png\nAdditional state: when no Book has favorite=true, display the attached empty state with folder illustration and ‘No favorite documents yet.’ Shared row, search, filter and action states follow SCR-02 conventions. All rows on this screen must show a filled Favourite star.");
s.getRange("A13:G14").format.wrapText = true; s.getRange("A13:G14").format.verticalAlignment = "top";

section(16, "Diagrams/Screens flow");
mergeSet("A17:G19", "Entry: Sidebar Favorites or Dashboard Favourite count → Load SCR-04 → Query Books where favorite=true.\nMain paths: Search result or row/title click → MD-01; Read icon → SCR-05; Edit icon → SCR-07; Delete icon → confirmation dialog; filled Favourite star → Remove from Favourite confirmation → update favorite=false → remove row.\nDisplay branches: no favourite Book → ‘No favorite documents yet.’; filter has no result → empty filtered state; load failure → error dialog.");
s.getRange("A17:G19").format.wrapText = true; s.getRange("A17:G19").format.verticalAlignment = "top";

section(21, "Components");
tableHeader(22);
const components = [
  ["SCR-04-001", "Page", "Screen title", "Display ‘Favorite list’ and mark Favorites as the active sidebar menu.", "Shown after initial screen load."],
  ["SCR-04-002", "Header", "Global Search", "Search the complete library by Book Title, Author or Tag and display autocomplete results.", "Global Search results are not limited to favourite Books."],
  ["SCR-04-003", "Search", "Result item", "Display Book Title, Author and up to two Tags plus ‘+N’. Selecting an item opens MD-01.", "Hide on empty keyword, outside click or Esc."],
  ["SCR-04-004", "Search", "No-match state", "When no document matches, display ‘No documents match “{keyword}”.’ below the search field.", "Do not replace the Favourite table."],
  ["SCR-04-005", "Filter", "Status Filter", "Open a single-select menu containing Unread, Reading, Completed and Clear Filter.", "Default is no filter; Clear Filter restores all favourite records."],
  ["SCR-04-006", "Favourite list", "Eligibility", "Include only Books where favorite=true.", "The mockup contains outlined stars in sample rows; this is inconsistent. Production rows on SCR-04 must use filled stars."],
  ["SCR-04-007", "Favourite table", "Book Title", "Display title; selecting the title or row opens MD-01.", "Sortable ascending/descending."],
  ["SCR-04-008", "Favourite table", "Author", "Display author; use ‘—’ when unavailable.", "Sortable and Unicode-aware."],
  ["SCR-04-009", "Favourite table", "Progress", "Display reading percentage and progress bar from lastReadPage / totalPages.", "If totalPages is unknown, display 0%. Sortable."],
  ["SCR-04-010", "Favourite table", "Status", "Display Unread, Reading or Completed from the saved reading status.", "Read-only on this screen."],
  ["SCR-04-011", "Favourite table", "Tag", "Display up to two tags and ‘+N’ for remaining tags.", "Hover/tap ‘+N’ may show all tags."],
  ["SCR-04-012", "Favourite table", "Filled star", "Display a filled star for every row. Selecting it starts the Remove from Favourite flow.", "After successful removal, the row no longer satisfies favorite=true and disappears."],
  ["SCR-04-013", "Action", "Read icon", "Open SCR-05 and continue from lastReadPage when available.", "A readable online source or offline copy is required."],
  ["SCR-04-014", "Action", "Delete icon", "Open the Delete confirmation dialog for the selected Book.", "Successful deletion removes the Book from all lists."],
  ["SCR-04-015", "Action", "Edit icon", "Navigate to SCR-07 with the selected bookId.", "Metadata-only edits preserve Favourite state."],
  ["SCR-04-016", "Favourite row", "Hover state", "Highlight the row on pointer hover while keeping icons legible and indicating row selection.", "Hover is not the only interaction cue."],
  ["SCR-04-017", "Empty state", "No favourites", "When no Book has favorite=true, replace the table with folder illustration and ‘No favorite documents yet.’", "Status Filter remains available; removing the final favourite triggers this state."],
  ["SCR-04-018", "Footer", "Connection mode", "Display Online Mode or Offline Mode based on application/network state.", "Offline reading requires a local/application-managed or IndexedDB copy."],
];
writeRows(23, components);

const eventsSectionRow = 43;
section(eventsSectionRow, "Events");
tableHeader(eventsSectionRow + 1);
const events = [
  ["SCR-04-E001", "Screen", "Initial load", "Request Books where favorite=true. Render rows or show ‘No favorite documents yet.’; on failure display the load-failure dialog.", "Show a loading state until complete."],
  ["SCR-04-E002", "Global Search", "Input keyword", "Search the complete library by Title, Author and Tag and display autocomplete results.", "Recommended debounce: 300 ms; ignore stale responses."],
  ["SCR-04-E003", "Global Search", "Select result", "Close the dropdown and open MD-01 using bookId.", "SCR-04 remains mounted behind the modal."],
  ["SCR-04-E004", "Status Filter", "Select status", "Filter the current Favourite dataset by one reading status.", "If none match, show an empty filtered result and retain the filter."],
  ["SCR-04-E005", "Status Filter", "Clear Filter", "Remove the status condition and restore all favorite=true Books.", "Do not clear global search text or sorting."],
  ["SCR-04-E006", "Table header", "Sort", "Book Title, Author or Progress toggles ascending/descending sorting.", "Sort applies to the filtered Favourite dataset."],
  ["SCR-04-E007", "Favourite row", "Open details", "Selecting a row or title opens MD-01; action icons must not trigger the row event.", "Stop propagation for Favourite/Read/Delete/Edit."],
  ["SCR-04-E008", "Favourite", "Remove request", "Selecting the filled star opens ‘Are you sure you want to remove this document from Favorites?’", "No closes the dialog without changes."],
  ["SCR-04-E009", "Favourite", "Remove confirmed", "Set favorite=false. On success remove the row and show Remove from Favourite success; on failure keep it and show an error.", "If the last row is removed, show the Favourite empty state."],
  ["SCR-04-E010", "Read", "Open PDF", "Validate the source and navigate to SCR-05 at lastReadPage.", "REMOTE_URL needs online access unless IndexedDB copy exists."],
  ["SCR-04-E011", "Delete", "Confirm", "If confirmed, delete the Book and application-managed/offline copy, remove the row and show Delete successful.", "On failure keep the row and show Unable to delete document."],
  ["SCR-04-E012", "Edit", "Open screen", "Navigate to SCR-07 with bookId; after save reload the row.", "If editing sets/keeps favorite=true, row remains; source replacement does not clear Favourite unless specified."],
  ["SCR-04-E013", "Search", "Dismiss dropdown", "Close results on Esc, outside click or cleared keyword without changing the Favourite table.", "No navigation occurs."],
  ["SCR-04-E014", "Responsive", "Small viewport", "Use a scrollable/card-friendly layout while keeping title, progress, filled star and actions operable.", "Minimum viewport: 360 px; no page-level horizontal overflow."],
];
writeRows(eventsSectionRow + 2, events);

// Targeted sizing and presentation, matching the existing corporate blue style.
s.showGridLines = false;
s.getRange("A1:A100").format.columnWidth = 18;
s.getRange("B1:B100").format.columnWidth = 24;
s.getRange("C1:C100").format.columnWidth = 22;
s.getRange("D1:E100").format.columnWidth = 42;
s.getRange("F1:F100").format.columnWidth = 34;
s.getRange("G1:G100").format.columnWidth = 18;
s.getRange("A1:G100").format.font = { name: "Arial", size: 10, color: "#1F2937" };
// Reapply section/header fonts after body-font normalization.
[8,12,16,21,eventsSectionRow].forEach(r => {
  s.getRange(`A${r}:G${r}`).format.font = { name: "Arial", size: 11, bold: true, color: "#FFFFFF" };
});
[22, eventsSectionRow + 1].forEach(r => {
  s.getRange(`A${r}:G${r}`).format.font = { name: "Arial", size: 10, bold: true, color: "#FFFFFF" };
});
s.freezePanes.freezeRows(4);

const inspect = await wb.inspect({ kind: "table", sheetId: s.name, range: `A1:G${eventsSectionRow + events.length + 2}`, include: "values,formulas", tableMaxRows: 100, tableMaxCols: 8, maxChars: 25000 });
console.log(inspect.ndjson);
const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 100 }, summary: "final formula error scan" });
console.log(errors.ndjson);

const preview = await wb.render({ sheetName: s.name, range: `A1:G${eventsSectionRow + events.length + 2}`, scale: 1.35, format: "png" });
await fs.writeFile(`${previewDir}/SCR-04_Favourite_FSD.png`, new Uint8Array(await preview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(wb);
const outputPath = `${outputDir}/BM13_NWS_P001_SCR-04_FSD_v1.0.xlsx`;
await output.save(outputPath);
console.log(outputPath);
