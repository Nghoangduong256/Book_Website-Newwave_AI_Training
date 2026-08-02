import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = String.raw`C:\Users\ADMIN\Documents\code-work\Newwave\BrSE_Training\AI_Training\Newwave_AI_Training\Project_ngan\02_Design\design-sample\BM13_NWS_P001_SCR-01_FSD_v1.0.xlsx`;
const dashboardPath = String.raw`C:\Users\ADMIN\Documents\code-work\Newwave\BrSE_Training\AI_Training\Newwave_AI_Training\Project_ngan\02_Design\design-main\Dashboard_SCR-01.png`;
const outputDir = String.raw`C:\Users\ADMIN\Documents\code-work\Newwave\BrSE_Training\AI_Training\Newwave_AI_Training\outputs\019f9365-4e80-7710-be67-ea5932043629`;
const outputPath = path.join(outputDir, "BM13_NWS_P001_SCR-01_Dashboard_FSD_v1.0.xlsx");
const previewDir = path.join(outputDir, "preview");

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const sheet = workbook.worksheets.getItemAt(0);
sheet.name = "SCR-01 Dashboard";
sheet.showGridLines = false;

// Remove template-only text and residual placeholder styling; relevant company styles are rebuilt below.
sheet.getRange("A8:G970").clear({ applyTo: "contents" });
sheet.getRange("A8:G970").clear({ applyTo: "formats" });
sheet.deleteAllDrawings();

const navy = "#0F4C81";
const blue = "#1298E8";
const lightBlue = "#D9EAF7";
const lightGray = "#F5F7FA";
const border = "#8A8A8A";
const body = "#1F2937";

function setSection(row, title) {
  const range = sheet.getRange(`A${row}:G${row}`);
  range.format = {
    fill: navy,
    font: { bold: true, color: "#FFFFFF", size: 11 },
    verticalAlignment: "center",
  };
  range.format.rowHeight = 24;
  sheet.getRange(`A${row}`).values = [[title]];
}

function setGuide(row, text) {
  const range = sheet.getRange(`A${row}:G${row}`);
  range.format = {
    font: { italic: true, color: "#595959", size: 9 },
    verticalAlignment: "center",
  };
  range.format.rowHeight = 20;
  sheet.getRange(`A${row}`).values = [[text]];
}

// Header metadata.
sheet.getRange("A2").values = [["Epic"]];
sheet.getRange("B2").values = [["Truyenthieu"]];
sheet.getRange("A3").values = [["Screen name"]];
sheet.getRange("B3").values = [["SCR-01 Dashboard"]];
sheet.getRange("A4").values = [["Status"]];
sheet.getRange("B4").values = [["Done"]];

// Purpose.
setSection(8, "Purpose");
setGuide(9, "Purpose of this screen/function");
sheet.getRange("A10:G12").merge();
sheet.getRange("A10").values = [[
  "Dashboard provides a high-level overview of the personal PDF library. It displays the total number of documents, completed documents and favourite documents, and allows the user to quickly resume recently read documents. The screen also provides navigation to Library, Recent and Favorites, together with global document search."
]];
sheet.getRange("A10:G12").format = {
  font: { color: body, size: 10 },
  wrapText: true,
  verticalAlignment: "top",
  fill: "#FFFFFF",
  borders: { preset: "outside", style: "thin", color: lightBlue },
};
sheet.getRange("A10:G12").format.rowHeight = 26;

// Wireframe.
setSection(14, "Wireframes/Design");
setGuide(15, "Include any mockups, diagrams or visual designs relating to these requirements.");
const dashboardBytes = await fs.readFile(dashboardPath);
const dashboardDataUrl = `data:image/png;base64,${dashboardBytes.toString("base64")}`;
sheet.images.add({
  dataUrl: dashboardDataUrl,
  anchor: {
    from: { row: 16, col: 0, rowOffsetPx: 4, colOffsetPx: 4 },
    extent: { widthPx: 960, heightPx: 960 },
  },
});
for (let r = 17; r <= 63; r++) sheet.getRange(`A${r}:G${r}`).format.rowHeight = 15;

// Screen flow.
setSection(65, "Diagrams/Screens flow");
setGuide(66, "Overview of Dashboard loading, navigation and resume-reading activities.");

const flowSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="360">
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#0F4C81"/>
    </marker>
    <style>
      .box{fill:#F7FAFC;stroke:#0F4C81;stroke-width:2;rx:8}
      .action{fill:#E8F3FB;stroke:#1298E8;stroke-width:2;rx:8}
      .txt{font-family:Arial,sans-serif;font-size:18px;fill:#1F2937;text-anchor:middle}
      .small{font-family:Arial,sans-serif;font-size:15px;fill:#4B5563;text-anchor:middle}
      .line{stroke:#0F4C81;stroke-width:2;fill:none;marker-end:url(#arrow)}
    </style>
  </defs>
  <rect class="box" x="30" y="125" width="175" height="75"/>
  <text class="txt" x="118" y="155">Open Dashboard</text>
  <text class="small" x="118" y="180">SCR-01</text>

  <rect class="action" x="270" y="105" width="220" height="115"/>
  <text class="txt" x="380" y="145">Load book list</text>
  <text class="small" x="380" y="172">Calculate status totals</text>
  <text class="small" x="380" y="196">Select recent reading items</text>

  <rect class="box" x="555" y="35" width="205" height="75"/>
  <text class="txt" x="658" y="65">Search</text>
  <text class="small" x="658" y="90">Go to filtered Library</text>

  <rect class="box" x="555" y="140" width="205" height="75"/>
  <text class="txt" x="658" y="170">Resume Reading</text>
  <text class="small" x="658" y="195">Open Reader at last page</text>

  <rect class="box" x="555" y="245" width="205" height="75"/>
  <text class="txt" x="658" y="275">View all recents</text>
  <text class="small" x="658" y="300">Open Recent screen</text>

  <rect class="box" x="850" y="35" width="220" height="75"/>
  <text class="txt" x="960" y="65">SCR-02 Library</text>
  <text class="small" x="960" y="90">Filtered result</text>

  <rect class="box" x="850" y="140" width="220" height="75"/>
  <text class="txt" x="960" y="170">SCR-06 Read PDF</text>
  <text class="small" x="960" y="195">lastReadPage</text>

  <rect class="box" x="850" y="245" width="220" height="75"/>
  <text class="txt" x="960" y="275">SCR-03 Recent</text>
  <text class="small" x="960" y="300">Recent documents</text>

  <path class="line" d="M205 162 L270 162"/>
  <path class="line" d="M490 162 C520 162 520 72 555 72"/>
  <path class="line" d="M490 162 L555 177"/>
  <path class="line" d="M490 162 C520 162 520 282 555 282"/>
  <path class="line" d="M760 72 L850 72"/>
  <path class="line" d="M760 177 L850 177"/>
  <path class="line" d="M760 282 L850 282"/>
</svg>`;
const flowDataUrl = `data:image/svg+xml;base64,${Buffer.from(flowSvg).toString("base64")}`;
sheet.images.add({
  dataUrl: flowDataUrl,
  anchor: {
    from: { row: 67, col: 0, rowOffsetPx: 4, colOffsetPx: 4 },
    extent: { widthPx: 960, heightPx: 288 },
  },
});
for (let r = 68; r <= 82; r++) sheet.getRange(`A${r}:G${r}`).format.rowHeight = 18;

// Requirements.
setSection(84, "Requirements");
const header = sheet.getRange("A85:G85");
header.values = [["ID", "Main", "Sub", "Description", null, "Note/ Assumption", "Ticket link"]];
header.format = {
  fill: blue,
  font: { bold: true, color: "#FFFFFF", size: 10 },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  borders: { preset: "all", style: "thin", color: navy },
  wrapText: true,
};
header.format.rowHeight = 26;

const requirements = [
  ["SCR-01-001", "Initial display", "Dashboard loading", "When the user opens Dashboard, the system shall retrieve the document list and display Library Status and Continue Reading data.", null, "Show loading placeholders while data is being retrieved.", ""],
  ["SCR-01-002", "Common layout", "Application logo", "Display the application name “Truyenthieu” and subtitle “Personal Library” in the left navigation area.", null, "Display only; no click action is required in this version.", ""],
  ["SCR-01-003", "Navigation", "Dashboard menu", "Highlight Dashboard as the active menu item while SCR-01 is displayed.", null, "Only one navigation item may be active at a time.", ""],
  ["SCR-01-004", "Navigation", "Library menu", "When the user selects Library, navigate to the Library screen.", null, "Target screen ID shall follow the project screen list.", ""],
  ["SCR-01-005", "Navigation", "Recent menu", "When the user selects Recent, navigate to the list of recently read documents.", null, "Recent documents are ordered by the latest reading activity.", ""],
  ["SCR-01-006", "Navigation", "Favorites menu", "When the user selects Favorites, navigate to the list of documents where favorite = true.", null, "Favorite state is stored in SQL Server.", ""],
  ["SCR-01-007", "Search", "Global search box", "Allow the user to search documents by title, author or tag.", null, "Search is case-insensitive. Empty keyword does not start a search.", ""],
  ["SCR-01-008", "Search", "Search execution", "When the user submits a keyword, navigate to Library and display the filtered result.", null, "The keyword is transferred to Library as a search condition.", ""],
  ["SCR-01-009", "Common layout", "Settings icon", "Display the Settings icon at the top-right of the screen.", null, "If Settings is outside the current scope, the icon shall be hidden or disabled.", ""],
  ["SCR-01-010", "Library Status", "Total Books", "Display the total number of documents in the library.", null, "Count all Book records.", ""],
  ["SCR-01-011", "Library Status", "Finished Books", "Display the number of documents whose readingStatus is COMPLETED.", null, "Do not calculate from progress percentage if readingStatus is available.", ""],
  ["SCR-01-012", "Library Status", "Favourite Books", "Display the number of documents whose favorite value is true.", null, "Label should be “Favourite Books” or “Favorite Books” consistently.", ""],
  ["SCR-01-013", "Continue Reading", "Recent document list", "Display a limited list of documents that have been started but not completed, ordered by most recent reading activity.", null, "Recommended display limit: 2 items. Requires a reliable recent-reading timestamp; otherwise use updatedAt as a temporary assumption.", ""],
  ["SCR-01-014", "Continue Reading", "Document title", "Display the title of each recent document.", null, "Long titles are truncated according to responsive rules.", ""],
  ["SCR-01-015", "Continue Reading", "Author", "Display the author of each recent document.", null, "Display “Unknown author” only if author becomes optional.", ""],
  ["SCR-01-016", "Continue Reading", "Summary", "Display a short summary of each recent document.", null, "If summary is empty, hide the summary area rather than displaying blank text.", ""],
  ["SCR-01-017", "Continue Reading", "Progress percentage", "Calculate and display reading progress as lastReadPage / totalPages × 100.", null, "If totalPages is null or zero, display progress as unavailable.", ""],
  ["SCR-01-018", "Continue Reading", "Current page", "Display the last read page and total pages in the format “Page X of Y”.", null, "Page number must be within 1 and totalPages.", ""],
  ["SCR-01-019", "Continue Reading", "Progress bar", "Display a visual progress bar corresponding to the calculated reading percentage.", null, "Clamp the displayed value to the range 0–100%.", ""],
  ["SCR-01-020", "Continue Reading", "Resume Reading button", "When selected, open the PDF Reader for the document at lastReadPage.", null, "If an offline copy exists, prefer IndexedDB; otherwise use the configured source.", ""],
  ["SCR-01-021", "Continue Reading", "View all recents", "When selected, navigate to the Recent screen and display the complete recent-document list.", null, "Button is hidden when there are no recent documents.", ""],
  ["SCR-01-022", "Empty state", "No documents", "When the library has no documents, display an empty-state message and a link/button to add a document.", null, "Status totals are displayed as zero.", ""],
  ["SCR-01-023", "Empty state", "No recent documents", "When there are no recently read documents, display a message indicating that no reading activity exists.", null, "Do not display empty document cards.", ""],
  ["SCR-01-024", "Error handling", "Load failure", "When dashboard data cannot be loaded, display an error message and provide a Retry action.", null, "The screen shall not display stale counts as current values.", ""],
  ["SCR-01-025", "Responsive", "Desktop layout", "On desktop, display the sidebar, three status cards in one row and full-width recent-document cards.", null, "Reference design width is desktop 1440 px or greater.", ""],
  ["SCR-01-026", "Responsive", "Mobile layout", "On mobile, collapse navigation, stack status cards and display recent-document cards in one column without horizontal page scrolling.", null, "Touch targets should be large enough for mobile operation.", ""],
  ["SCR-01-027", "Footer", "Version information", "Display the application version in the footer.", null, "Example: TRUYENTHIEU V1.0.", ""],
  ["SCR-01-028", "Footer", "Connection mode", "Display whether the application is currently online or offline.", null, "Connection mode reflects browser connectivity; document offline availability is managed separately per document.", ""],
];

const startRow = 86;
const endRow = startRow + requirements.length - 1;
sheet.getRange(`A${startRow}:G${endRow}`).values = requirements;
sheet.getRange(`A${startRow}:G${endRow}`).format = {
  font: { color: body, size: 9 },
  verticalAlignment: "top",
  wrapText: true,
  borders: { preset: "all", style: "thin", color: border },
};
sheet.getRange(`A${startRow}:A${endRow}`).format.horizontalAlignment = "center";
sheet.getRange(`B${startRow}:C${endRow}`).format.fill = lightGray;
sheet.getRange(`F${startRow}:F${endRow}`).format.fill = "#FFFBEA";
for (let r = startRow; r <= endRow; r++) {
  sheet.getRange(`A${r}:G${r}`).format.rowHeight = 42;
}

// Column sizing follows the original template proportions, expanded for readable FSD content.
sheet.getRange("A:A").format.columnWidth = 15;
sheet.getRange("B:B").format.columnWidth = 24;
sheet.getRange("C:C").format.columnWidth = 24;
sheet.getRange("D:D").format.columnWidth = 58;
sheet.getRange("E:E").format.columnWidth = 2;
sheet.getRange("F:F").format.columnWidth = 38;
sheet.getRange("G:G").format.columnWidth = 20;

sheet.freezePanes.freezeRows(4);

// Compact verification.
console.log((await workbook.inspect({
  kind: "table",
  sheetId: sheet.name,
  range: `A1:G${endRow}`,
  include: "values,formulas",
  tableMaxRows: 15,
  tableMaxCols: 7,
  maxChars: 8000,
})).ndjson);

console.log((await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
})).ndjson);

// Render the populated areas in manageable sections.
for (const [name, range] of [
  ["top", "A1:G16"],
  ["wireframe", "A14:G64"],
  ["flow", "A65:G83"],
  ["requirements_1", "A84:G100"],
  ["requirements_2", `A101:G${endRow}`],
]) {
  const preview = await workbook.render({
    sheetName: sheet.name,
    range,
    scale: 1,
    format: "png",
  });
  await fs.writeFile(path.join(previewDir, `${name}.png`), new Uint8Array(await preview.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`OUTPUT=${outputPath}`);
