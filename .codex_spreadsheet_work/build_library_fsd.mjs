import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const root = String.raw`C:\Users\ADMIN\Documents\code-work\Newwave\BrSE_Training\AI_Training\Newwave_AI_Training`;
const inputPath = path.join(root, "Project_ngan", "02_Design", "design-sample", "BM13_NWS_P001_SCR-01_FSD_v1.0 - Copy.xlsx");
const imagePath = path.join(root, "Project_ngan", "02_Design", "design-main", "Edit Book__SCR-07.png");
const outputDir = path.join(root, "outputs", "019f9365-4e80-7710-be67-ea5932043629");
const outputPath = path.join(outputDir, "BM13_NWS_P001_SCR-07_Edit_Book_FSD_v1.0.xlsx");
const previewDir = path.join(outputDir, "preview_scr07");

await fs.mkdir(previewDir, { recursive: true });
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const sheet = workbook.worksheets.getItemAt(0);
sheet.name = "SCR-07 Edit Book";
sheet.showGridLines = false;
sheet.getRange("A8:G970").clear({ applyTo: "contents" });
sheet.getRange("A8:G970").clear({ applyTo: "formats" });
sheet.deleteAllDrawings();

const navy = "#0F4C81";
const blue = "#1298E8";
const paleBlue = "#D9EAF7";
const gray = "#F5F7FA";
const border = "#8A8A8A";
const body = "#1F2937";

function section(row, title) {
  const r = sheet.getRange(`A${row}:G${row}`);
  r.format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 11 }, verticalAlignment: "center" };
  r.format.rowHeight = 24;
  sheet.getRange(`A${row}`).values = [[title]];
}
function guide(row, text) {
  const r = sheet.getRange(`A${row}:G${row}`);
  r.format = { font: { italic: true, color: "#595959", size: 9 }, verticalAlignment: "center" };
  r.format.rowHeight = 20;
  sheet.getRange(`A${row}`).values = [[text]];
}

sheet.getRange("A2:B4").values = [
  ["Epic", "Truyenthieu"],
  ["Screen name", "SCR-07 Edit Book"],
  ["Status", "Done"],
];

section(8, "Purpose");
guide(9, "Purpose of this screen/function");
sheet.getRange("A10:G12").merge();
sheet.getRange("A10").values = [[
  "Edit Book loads an existing document and allows the user to update metadata or replace its PDF source using Local Upload or Fetch from URL. Metadata-only changes preserve reading progress and offline data. Replacing the source requires confirmation, invalidates source-dependent reading data and must be completed transactionally. The screen also provides a clearly separated permanent Delete Document action."
]];
sheet.getRange("A10:G12").format = {
  font: { color: body, size: 10 }, wrapText: true, verticalAlignment: "top",
  fill: "#FFFFFF", borders: { preset: "outside", style: "thin", color: paleBlue },
};
sheet.getRange("A10:G12").format.rowHeight = 26;

section(14, "Wireframes/Design");
guide(15, "SCR-07 Edit Book design showing prefilled metadata, source replacement controls, file properties and Danger Zone.");
const imageBytes = await fs.readFile(imagePath);
sheet.images.add({
  dataUrl: `data:image/png;base64,${imageBytes.toString("base64")}`,
  anchor: { from: { row: 16, col: 0, rowOffsetPx: 4, colOffsetPx: 4 }, extent: { widthPx: 960, heightPx: 960 } },
});
for (let row = 17; row <= 63; row++) sheet.getRange(`A${row}:G${row}`).format.rowHeight = 15;

section(65, "Diagrams/Screens flow");
guide(66, "Overview of loading, metadata/source changes, save, cancel and permanent deletion.");
const flowSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="500">
 <defs>
  <marker id="a" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3z" fill="#0F4C81"/></marker>
  <style>.b{fill:#F7FAFC;stroke:#0F4C81;stroke-width:2;rx:8}.x{fill:#E8F3FB;stroke:#1298E8;stroke-width:2;rx:8}.t{font:17px Arial;fill:#1F2937;text-anchor:middle}.s{font:14px Arial;fill:#4B5563;text-anchor:middle}.l{stroke:#0F4C81;stroke-width:2;fill:none;marker-end:url(#a)}</style>
 </defs>
 <rect class="b" x="20" y="205" width="160" height="70"/><text class="t" x="100" y="235">Open SCR-07</text><text class="s" x="100" y="258">Selected Book ID</text>
 <rect class="x" x="230" y="185" width="190" height="110"/><text class="t" x="325" y="220">Load Book data</text><text class="s" x="325" y="246">Prefill source/metadata</text><text class="s" x="325" y="270">Show file properties</text>
 <rect class="b" x="485" y="35" width="205" height="70"/><text class="t" x="588" y="64">Metadata changes</text><text class="s" x="588" y="87">Preserve reading data</text>
 <rect class="b" x="485" y="135" width="205" height="70"/><text class="t" x="588" y="164">Source replacement</text><text class="s" x="588" y="187">Validate and confirm</text>
 <rect class="b" x="485" y="235" width="205" height="70"/><text class="t" x="588" y="264">Save Changes</text><text class="s" x="588" y="287">Transactional update</text>
 <rect class="b" x="485" y="335" width="205" height="70"/><text class="t" x="588" y="364">Cancel / Back</text><text class="s" x="588" y="387">Confirm unsaved changes</text>
 <rect class="b" x="485" y="425" width="205" height="60"/><text class="t" x="588" y="454">Delete Document</text><text class="s" x="588" y="475">Permanent confirmation</text>
 <rect class="x" x="770" y="35" width="210" height="70"/><text class="t" x="875" y="64">Update metadata</text><text class="s" x="875" y="87">Keep progress/offline copy</text>
 <rect class="x" x="770" y="135" width="210" height="70"/><text class="t" x="875" y="164">Replace PDF source</text><text class="s" x="875" y="187">Reset source-dependent data</text>
 <rect class="x" x="770" y="235" width="210" height="70"/><text class="t" x="875" y="264">Refresh Book details</text><text class="s" x="875" y="287">Return to origin</text>
 <rect class="x" x="770" y="335" width="210" height="70"/><text class="t" x="875" y="364">Discard or continue</text><text class="s" x="875" y="387">No changes saved</text>
 <rect class="x" x="770" y="425" width="210" height="60"/><text class="t" x="875" y="454">Delete and refresh</text><text class="s" x="875" y="475">Return to Library</text>
 <path class="l" d="M180 240L230 240"/><path class="l" d="M420 240C450 240 450 70 485 70"/><path class="l" d="M420 240C450 240 450 170 485 170"/><path class="l" d="M420 240L485 270"/><path class="l" d="M420 240C450 240 450 370 485 370"/><path class="l" d="M420 240C450 240 450 455 485 455"/>
 <path class="l" d="M690 70L770 70"/><path class="l" d="M690 170L770 170"/><path class="l" d="M690 270L770 270"/><path class="l" d="M690 370L770 370"/><path class="l" d="M690 455L770 455"/>
</svg>`;
sheet.images.add({
  dataUrl: `data:image/svg+xml;base64,${Buffer.from(flowSvg).toString("base64")}`,
  anchor: { from: { row: 67, col: 0, rowOffsetPx: 4, colOffsetPx: 4 }, extent: { widthPx: 960, heightPx: 400 } },
});
for (let row = 68; row <= 88; row++) sheet.getRange(`A${row}:G${row}`).format.rowHeight = 18;

section(90, "Components");
const header = sheet.getRange("A91:G91");
header.values = [["ID", "Main", "Sub", "Description", null, "Note/ Assumption", "Ticket link"]];
header.format = {
  fill: blue, font: { bold: true, color: "#FFFFFF", size: 10 }, horizontalAlignment: "center",
  verticalAlignment: "center", borders: { preset: "all", style: "thin", color: navy }, wrapText: true,
};
header.format.rowHeight = 26;

let requirements = [
 ["SCR-02-001","Initial display","Library loading","When the user opens Library, retrieve the document list and display a loading state until the request is completed.",null,"Default order: title ascending unless a previously selected condition is retained.",""],
 ["SCR-02-002","Initial display","Load success","On success, display the document table and all available list controls.",null,"Only documents belonging to the current personal library are displayed.",""],
 ["SCR-02-003","Common layout","Application logo","Display the application name and subtitle in the left navigation area.",null,"Display only; no click action is required in this version.",""],
 ["SCR-02-004","Navigation","Library menu","Highlight Library as the active navigation item while SCR-02 is displayed.",null,"Only one menu item may be active.",""],
 ["SCR-02-005","Navigation","Dashboard menu","When selected, navigate to SCR-01 Dashboard.",null,"Preserving Library conditions is optional.",""],
 ["SCR-02-006","Navigation","Recent menu","When selected, navigate to SCR-03 Recent.",null,"Recent items are ordered by latest reading activity.",""],
 ["SCR-02-007","Navigation","Favorites menu","When selected, navigate to SCR-05 Favorites.",null,"Display documents where favorite = true.",""],
 ["SCR-02-008","Search","Search box","Allow search by title, author or tag.",null,"Case-insensitive; trim leading/trailing spaces.",""],
 ["SCR-02-009","Search","Search execution","Apply the keyword when the user presses Enter or after an agreed debounce period, then refresh the visible list.",null,"Recommended debounce: 300–500 ms if searching while typing.",""],
 ["SCR-02-010","Search","Clear keyword","When the keyword is cleared, restore the list using the remaining filter and sort conditions.",null,"Search, filter and sort conditions may be combined.",""],
 ["SCR-02-011","Common layout","Settings icon","Display the Settings icon at the top-right.",null,"Hide or disable it if Settings is outside the project scope.",""],
 ["SCR-02-012","Filter","Open filter","When Filter is selected, display available filter conditions.",null,"Assumed conditions: reading status, favorite, tag, source type and offline availability.",""],
 ["SCR-02-013","Filter","Apply filter","Apply selected conditions and refresh the visible list.",null,"Multiple conditions use AND; multiple values within one condition use OR.",""],
 ["SCR-02-014","Filter","Reset filter","Provide a way to clear all filter conditions.",null,"The search keyword and sort condition remain unchanged.",""],
 ["SCR-02-015","Document","Add book","When Add book is selected, navigate to SCR-04 Add/Edit Document in add mode.",null,"No existing document data is prefilled.",""],
 ["SCR-02-016","Table","Book title","Display the document title. Selecting the title or row opens MDL-01 Book Details.",null,"Long text is truncated with a tooltip; modal behavior may be specified separately.",""],
 ["SCR-02-017","Table","Author","Display the document author.",null,"If empty, display “Unknown author” only when author is optional.",""],
 ["SCR-02-018","Table","Progress","Display lastReadPage / totalPages as a percentage and progress bar.",null,"If totalPages is null or zero, display “—”; clamp to 0–100%.",""],
 ["SCR-02-019","Table","Reading status","Display UNREAD, READING or COMPLETED.",null,"UNREAD = 0%; READING = 1–99%; COMPLETED = 100%. Mock data showing Unread with 22% must be corrected.",""],
 ["SCR-02-020","Table","Tags","Display up to two tag chips; when more tags exist, display “+N”.",null,"Selecting +N may show all tags in a tooltip/popover.",""],
 ["SCR-02-021","Favorite","Current state","Display an outlined star when favorite = false and a filled star when favorite = true.",null,"Provide an accessible label and tooltip.",""],
 ["SCR-02-022","Favorite","Toggle favorite","When the star is selected, update favorite in SQL Server and immediately reflect the new state.",null,"On failure, rollback the icon and show an error message.",""],
 ["SCR-02-023","Action","Read","When the book icon is selected, open SCR-06 Read PDF at lastReadPage.",null,"Prefer an IndexedDB copy when available; otherwise use LOCAL_UPLOAD or REMOTE_URL source.",""],
 ["SCR-02-024","Action","Edit","When the pencil icon is selected, open SCR-04 Add/Edit Document in edit mode.",null,"The selected document data is prefilled.",""],
 ["SCR-02-025","Action","Delete","When the trash icon is selected, display a confirmation dialog before deletion.",null,"No deletion occurs until the user confirms.",""],
 ["SCR-02-026","Action","Delete confirmed","Delete the Book record and any application-managed copy, then remove the row from the list.",null,"LOCAL_UPLOAD: do not delete the user's original device file. REMOTE_URL: do not delete the remote source. Remove the current browser's IndexedDB copy when present.",""],
 ["SCR-02-027","Action","Delete cancelled","Close the confirmation dialog and keep all data unchanged.",null,"Return focus to the delete action.",""],
 ["SCR-02-028","Sorting","Book title","Selecting BOOK TITLE cycles between ascending and descending title order.",null,"Show the active direction in the header.",""],
 ["SCR-02-029","Sorting","Author","Selecting AUTHOR cycles between ascending and descending author order.",null,"Null/empty values are placed last.",""],
 ["SCR-02-030","Sorting","Progress","Selecting PROGRESS cycles between ascending and descending progress order.",null,"Unavailable progress values are placed last.",""],
 ["SCR-02-031","List state","No documents","If the library contains no documents, display an empty-state message and an Add book action.",null,"Do not display empty table rows.",""],
 ["SCR-02-032","List state","No search result","If no document matches the active conditions, display a no-result message and Reset filter/Clear search actions.",null,"Do not treat this state as a load error.",""],
 ["SCR-02-033","Error handling","Load failure","When loading fails, display an error message and a Retry action.",null,"Do not show stale data as newly loaded data.",""],
 ["SCR-02-034","Error handling","Mutation failure","When favorite or delete operations fail, keep/restore the previous row state and show a non-blocking error message.",null,"Do not silently discard the user's action.",""],
 ["SCR-02-035","Responsive","Desktop layout","On desktop, display the sidebar, controls and full table layout shown in the design.",null,"Reference design width is approximately 1440 px or greater.",""],
 ["SCR-02-036","Responsive","Mobile layout","On mobile, collapse navigation and convert each row to a card without horizontal page scrolling.",null,"Place secondary actions in a More menu; maintain touch-friendly targets.",""],
 ["SCR-02-037","Accessibility","Icon actions","Provide tooltips, keyboard focus and accessible names for Favorite, Read, Delete and Edit icons.",null,"Icons must not be the only programmatic label.",""],
 ["SCR-02-038","Footer","Version information","Display the application version in the footer.",null,"Example: TRUYENTHIEU V1.0.",""],
 ["SCR-02-039","Footer","Connection mode","Display Online Mode or Offline Mode based on browser connectivity.",null,"Connection mode does not guarantee that every document is available offline.",""],
];

// Adapt the reusable list/table requirements to the Favourite business scope.
requirements = requirements.map((row) => [
  row[0].replace("SCR-02-", "SCR-04-"),
  row[1], row[2], row[3], row[4], row[5], row[6],
]);
requirements[0] = ["SCR-04-001","Initial display","Favourite loading","When the user opens Favourite, retrieve documents where favorite = true and display a loading state until the request is completed.",null,"Favorite state is stored in SQL Server.",""];
requirements[1] = ["SCR-04-002","Initial display","Load success","On success, display only favorite documents and all available list controls.",null,"The page title must be “Favourite”, not “Recent Read” as shown in the supplied mockup.",""];
requirements[3] = ["SCR-04-004","Navigation","Favorites menu","Highlight Favorites as the active navigation item while SCR-04 is displayed.",null,"Only one menu item may be active. Navigation label may remain plural while the screen title uses Favourite.",""];
requirements[4] = ["SCR-04-005","Navigation","Dashboard menu","When selected, navigate to SCR-01 Dashboard.",null,"Preserving Favourite conditions is optional.",""];
requirements[5] = ["SCR-04-006","Navigation","Library menu","When selected, navigate to SCR-02 Library.",null,"Library displays all documents.",""];
requirements[6] = ["SCR-04-007","Navigation","Recent menu","When selected, navigate to SCR-03 Recent.",null,"Recent displays documents with reading history.",""];
requirements[7] = ["SCR-04-008","Search","Search box","Allow favorite documents to be searched by title, author or tag.",null,"Case-insensitive; trim leading/trailing spaces; do not search non-favorite documents.",""];
requirements[8] = ["SCR-04-009","Search","Search execution","Apply the keyword when the user presses Enter or after an agreed debounce period, then refresh the Favourite list.",null,"Recommended debounce: 300–500 ms if searching while typing.",""];
requirements[11] = ["SCR-04-012","Status filter","Open filter","When Status Filter is selected, display the available reading statuses.",null,"Values: All, UNREAD, READING and COMPLETED.",""];
requirements[12] = ["SCR-04-013","Status filter","Apply filter","Apply the selected reading status within favorite documents and refresh the list.",null,"Only one status is assumed in the current design.",""];
requirements[13] = ["SCR-04-014","Status filter","Reset filter","Selecting All clears the status condition and displays all favorite documents.",null,"The search keyword and sort condition remain unchanged.",""];
requirements[14] = ["SCR-04-015","Table","Favourite inclusion","Display only documents where favorite = true.",null,"Every displayed row must show a filled star. The outlined stars in the supplied mockup are inconsistent and must be corrected.",""];
requirements[15] = ["SCR-04-016","Table","Book title","Display the document title. Selecting the title or row opens Book Details.",null,"Long text is truncated with a tooltip; modal behavior may be specified separately.",""];
requirements[20] = ["SCR-04-021","Favorite","Current state","Display a filled star for every document on this screen.",null,"An outlined star must not remain in the Favourite list.",""];
requirements[21] = ["SCR-04-022","Favorite","Remove favorite","When the filled star is selected, set favorite = false and remove the document from the current list.",null,"On failure, restore the filled star and keep the row visible. A brief Undo notification is recommended.",""];
requirements[22] = ["SCR-04-023","Action","Read","When the book icon is selected, open the Read PDF screen at lastReadPage.",null,"Reader screen ID is TBD. Prefer IndexedDB when an offline copy exists.",""];
requirements[23] = ["SCR-04-024","Action","Edit","When the pencil icon is selected, open Add/Edit Document in edit mode.",null,"Add/Edit screen ID is TBD; the selected document data is prefilled.",""];
requirements[25] = ["SCR-04-026","Action","Delete confirmed","Delete the Book record and application-managed copy, then remove it from Favourite, Library and other lists.",null,"Do not delete the user's original device file or remote source. Remove the current browser's IndexedDB copy when present.",""];
requirements[27] = ["SCR-04-028","Sorting","Book title","Selecting BOOK TITLE cycles between ascending and descending title order within favorite documents.",null,"Show the active direction in the header.",""];
requirements[28] = ["SCR-04-029","Sorting","Author","Selecting AUTHOR cycles between ascending and descending author order within favorite documents.",null,"Null/empty values are placed last.",""];
requirements[29] = ["SCR-04-030","Sorting","Progress","Selecting PROGRESS cycles between ascending and descending progress order within favorite documents.",null,"Unavailable progress values are placed last.",""];
requirements[30] = ["SCR-04-031","List state","No favorites","If no document is marked favorite, display an empty-state message and a link to SCR-02 Library.",null,"Do not display empty table rows.",""];
requirements[31] = ["SCR-04-032","List state","No search result","If no favorite document matches the active conditions, display a no-result message and Clear search/Reset status actions.",null,"Do not treat this state as a load error.",""];
requirements[33] = ["SCR-04-034","Error handling","Mutation failure","When remove-favorite or delete fails, restore the previous row state and show a non-blocking error message.",null,"Do not silently remove the document from the list.",""];
requirements[34] = ["SCR-04-035","Responsive","Desktop layout","On desktop, display the sidebar, Status Filter and full favorite-document table shown in the design.",null,"Reference design width is approximately 1440 px or greater.",""];
requirements = [
 ["MD-01-001","Open modal","Trigger","Open MD-01 when the user selects a document from a list row, Book Title, action icon or Global Search dropdown.",null,"The origin screen remains mounted behind the modal.",""],
 ["MD-01-002","Open modal","Loading","Display a loading state while retrieving the selected document details.",null,"Prevent actions until required data is available.",""],
 ["MD-01-003","Open modal","Load success","Display the modal overlay with the selected document's current metadata and reading state.",null,"Use the selected Book ID; never reuse stale details from a previously opened document.",""],
 ["MD-01-004","Modal","Overlay","Dim the origin screen and keep focus inside MD-01 while it is open.",null,"Background content must not be operable by keyboard or pointer.",""],
 ["MD-01-005","Modal","Close button","When the close icon is selected, close MD-01 and return to the origin screen without changing data.",null,"Return keyboard focus to the control that opened the modal.",""],
 ["MD-01-006","Modal","Alternative close","Allow the user to close MD-01 with Escape. Clicking the overlay may also close it if the project adopts this behavior.",null,"Do not close while a confirmation dialog or blocking operation is active.",""],
 ["MD-01-007","Header","Title","Display the document title.",null,"Long titles wrap or truncate without overlapping the Favorite and Close controls.",""],
 ["MD-01-008","Header","Author","Display the author below the title.",null,"If author is optional and empty, display “Unknown author”.",""],
 ["MD-01-009","Favorite","Current state","Display a filled star when favorite = true and an outlined star when favorite = false.",null,"The supplied image represents the favorite = true state.",""],
 ["MD-01-010","Favorite","Toggle","When the star is selected, update favorite and immediately reflect the new state.",null,"On failure, restore the previous state and display a non-blocking error.",""],
 ["MD-01-011","Reading progress","Percentage","Calculate and display lastReadPage / totalPages × 100.",null,"If totalPages is null or zero, display “—”; clamp the result to 0–100%.",""],
 ["MD-01-012","Reading progress","Progress bar","Display a progress bar corresponding to the calculated percentage.",null,"The bar and percentage must represent the same value.",""],
 ["MD-01-013","Reading progress","Last read","Display relative last-reading time such as “Last read: 2 days ago”.",null,"Requires lastReadAt. If unavailable, this field should be hidden rather than inferred from updatedAt.",""],
 ["MD-01-014","Reading progress","Page information","Display current and total pages in the format “Page X of Y”.",null,"lastReadPage must be within 0 and totalPages.",""],
 ["MD-01-015","Metadata","Published year","Display publishYear.",null,"Use a consistent label: “Published year”.",""],
 ["MD-01-016","Metadata","Reading status","Display UNREAD, READING or COMPLETED.",null,"UNREAD = 0%; READING = 1–99%; COMPLETED = 100%.",""],
 ["MD-01-017","Metadata","Source type","Display the document source as Uploaded PDF or Remote URL.",null,"Map internal values LOCAL_UPLOAD and REMOTE_URL to user-friendly labels.",""],
 ["MD-01-018","Metadata","File size","Display fileSize using an appropriate unit.",null,"Hide or display “—” when size is unavailable; do not show misleading size.",""],
 ["MD-01-019","Metadata","Last modified","Display updatedAt in the project date format.",null,"Recommended format: dd/MM/yyyy.",""],
 ["MD-01-020","Offline","Offline status","Display whether the selected document can be read offline on the current browser/device.",null,"Offline availability is determined from IndexedDB, not only from sourceType or SQL Server.",""],
 ["MD-01-021","Metadata","URL link","Display the source URL only when sourceType = REMOTE_URL.",null,"The supplied mockup shows Uploaded PDF together with URL Link; these states are inconsistent and must not appear together.",""],
 ["MD-01-022","Metadata","Local file name","For sourceType = LOCAL_UPLOAD, display originalFileName instead of URL Link when useful.",null,"Do not display the user's original absolute device path.",""],
 ["MD-01-023","Metadata","Categories","Display all document tags as chips.",null,"Wrap chips to additional lines when necessary.",""],
 ["MD-01-024","Metadata","Summary","Display the document summary.",null,"If summary is empty, hide the section or display a defined placeholder consistently.",""],
 ["MD-01-025","Action","Resume Reading","When selected, resolve the available document source and open the PDF Reader at lastReadPage.",null,"Prefer IndexedDB; otherwise use the Backend copy for LOCAL_UPLOAD or the URL for REMOTE_URL.",""],
 ["MD-01-026","Action","Read unavailable","If no accessible source exists, disable Resume Reading and display the reason.",null,"Examples: remote URL unavailable while offline; local application copy missing.",""],
 ["MD-01-027","Action","Edit Book","When selected, close or suspend MD-01 and open Add/Edit Document in edit mode.",null,"The selected document data is prefilled. Screen ID is TBD.",""],
 ["MD-01-028","Action","Return from edit","After a successful save, return to MD-01 or the origin screen and refresh the displayed details.",null,"Choose one navigation pattern consistently; recommended: return to refreshed MD-01.",""],
 ["MD-01-029","Offline","Download PDF visibility","Show Download PDF only when sourceType = REMOTE_URL and no IndexedDB copy exists.",null,"For LOCAL_UPLOAD already managed by the application, hide the button unless a device-specific offline copy is explicitly required.",""],
 ["MD-01-030","Offline","Download execution","When selected, download the remote PDF and store it in IndexedDB for the current browser/device.",null,"Do not change sourceType; the database record remains REMOTE_URL.",""],
 ["MD-01-031","Offline","Download progress","Display downloading progress and prevent duplicate download actions.",null,"Disable the button until the operation completes or fails.",""],
 ["MD-01-032","Offline","Download success","On success, update Offline Status to “Can read offline” and replace or disable Download PDF.",null,"Offline state is device-specific and may not be synchronized to other devices.",""],
 ["MD-01-033","Offline","Download failure","On failure, keep the previous offline state and display a retryable error.",null,"Remove incomplete IndexedDB data.",""],
 ["MD-01-034","Action","Delete","When selected, display a confirmation dialog describing the deletion impact.",null,"Delete must not execute before explicit confirmation.",""],
 ["MD-01-035","Action","Delete confirmed","Delete the Book record and application-managed copies, close MD-01 and refresh the origin list.",null,"Do not delete the user's original device file or the remote source. Remove the current browser's IndexedDB copy when present.",""],
 ["MD-01-036","Action","Delete cancelled","Close the confirmation dialog and return to MD-01 without changing data.",null,"Return focus to the Delete button.",""],
 ["MD-01-037","Error handling","Load failure","If details cannot be loaded, show an error state with Retry and Close actions.",null,"Do not show stale details as current data.",""],
 ["MD-01-038","Responsive","Mobile layout","On mobile, display MD-01 as a full-screen or near-full-screen scrollable sheet and stack action buttons.",null,"Keep the Close action visible and avoid horizontal scrolling.",""],
 ["MD-01-039","Accessibility","Keyboard and labels","Use focus trapping, visible focus indicators and accessible names for star, close and icon buttons.",null,"Reading progress must have a text equivalent.",""],
];
requirements = [
 ["SCR-05-001","Open reader","Trigger","Open SCR-05 with the selected Book ID when the user chooses Read or Resume Reading.",null,"The reader may be opened from MD-01, Library, Recent, Favourite or Dashboard.",""],
 ["SCR-05-002","Open reader","Loading","Display a loading state while resolving the PDF source and loading document metadata.",null,"Reader controls are disabled until the PDF is ready.",""],
 ["SCR-05-003","PDF source","Resolution priority","Resolve the PDF using this priority: IndexedDB offline copy, application-managed LOCAL_UPLOAD copy, then REMOTE_URL.",null,"If the browser is offline, REMOTE_URL cannot be used unless an IndexedDB copy exists.",""],
 ["SCR-05-004","PDF source","Load failure","If no accessible source exists or PDF loading fails, display an error with Retry and Back actions.",null,"Do not display an empty reader as a successful state.",""],
 ["SCR-05-005","Header","Book information","Display the selected document title and author in the header.",null,"The design text “Medication” should be corrected if the actual title is “Meditations”.",""],
 ["SCR-05-006","Navigation","Back action","When Back is selected, save reading progress and return to the origin screen.",null,"Although the mockup says Back to Library, returning to the actual origin is recommended.",""],
 ["SCR-05-007","Navigation","Sidebar","Display common navigation according to the desktop layout.",null,"Do not incorrectly highlight Favorites unless it is the origin/current navigation context.",""],
 ["SCR-05-008","PDF display","Initial page","After the PDF loads, open lastReadPage; if it is unavailable or invalid, open page 1.",null,"Clamp lastReadPage to the range 1–totalPages.",""],
 ["SCR-05-009","PDF display","Page rendering","Render the selected PDF page inside the reader area.",null,"Show a per-page loading indicator when rendering takes noticeable time.",""],
 ["SCR-05-010","Page navigation","Previous","Move to the previous page when Previous is selected.",null,"Disable on page 1.",""],
 ["SCR-05-011","Page navigation","Next","Move to the next page when Next is selected.",null,"Disable on the last page.",""],
 ["SCR-05-012","Page navigation","Page indicator","Display current page and total pages in the format PAGE X OF Y.",null,"The current page must update after every navigation action.",""],
 ["SCR-05-013","Page navigation","Direct page input","Allow the user to enter a page number and navigate after Enter or confirmation.",null,"Reject non-numeric values and values outside 1–totalPages.",""],
 ["SCR-05-014","Page navigation","Keyboard","Support Page Up/Page Down or arrow-key navigation when focus is not inside an input.",null,"Do not override browser shortcuts unexpectedly.",""],
 ["SCR-05-015","Zoom","Zoom out","Decrease the zoom level when Zoom Out is selected.",null,"Recommended range: 50–200% with defined increments.",""],
 ["SCR-05-016","Zoom","Zoom in","Increase the zoom level when Zoom In is selected.",null,"Disable when the maximum zoom level is reached.",""],
 ["SCR-05-017","Zoom","Zoom value","Display the current zoom percentage.",null,"Default value may be 100% or Fit Width according to product decision.",""],
 ["SCR-05-018","Zoom","Fit mode","Toggle or select a fit mode such as Fit Width or Fit Page.",null,"The icon between zoom and page navigation requires a tooltip because its meaning is not self-evident.",""],
 ["SCR-05-019","Contents","Availability","Enable Contents only when the PDF contains a usable outline/table of contents.",null,"Display the disabled state shown in the control specification when no outline exists.",""],
 ["SCR-05-020","Contents","Open panel","When Contents is selected, open a side panel or popover containing the PDF outline.",null,"Keep the current page visible where possible.",""],
 ["SCR-05-021","Contents","Select item","When an outline item is selected, close or retain the panel according to responsive rules and navigate to its destination page.",null,"Update current page and reading progress.",""],
 ["SCR-05-022","Reading progress","Automatic save","Automatically save lastReadPage and lastReadAt when the current page changes.",null,"Use debounce to avoid excessive API calls; also flush on Back or page unload when possible.",""],
 ["SCR-05-023","Reading progress","Reading status","Update readingStatus consistently with progress.",null,"UNREAD = 0%; READING = 1–99%; COMPLETED = 100%.",""],
 ["SCR-05-024","Reading progress","Save failure","If progress saving fails, keep reading available and retry silently or show a non-blocking warning.",null,"Do not interrupt PDF reading for a temporary progress-sync error.",""],
 ["SCR-05-025","Offline","Read offline availability","Enable Read offline when an offline PDF copy is available on the current browser/device.",null,"Offline availability is determined from IndexedDB or equivalent application-managed local storage.",""],
 ["SCR-05-026","Offline","Read offline disabled","Disable Read offline when no offline copy exists.",null,"Use the disabled state shown in the control specification and provide a tooltip explaining how to save the PDF offline.",""],
 ["SCR-05-027","Offline","Read offline execution","When selected, load the PDF from the offline copy and continue from the current or last read page.",null,"No network connection is required after the local copy has been resolved.",""],
 ["SCR-05-028","More menu","Open menu","When the More icon is selected, display Download PDF, Save for offline and Remove offline copy actions.",null,"Each action's enabled state depends on source and offline availability.",""],
 ["SCR-05-029","More menu","Download PDF","Download a copy of the PDF through the browser/device download mechanism.",null,"This action creates a user-managed file and does not by itself update application Offline Status.",""],
 ["SCR-05-030","More menu","Save for offline","Save the PDF to IndexedDB for application-managed offline reading.",null,"Enable when no IndexedDB copy exists and a downloadable source is accessible.",""],
 ["SCR-05-031","More menu","Save progress","While saving for offline, display progress and prevent duplicate operations.",null,"The reader may remain usable if technically safe.",""],
 ["SCR-05-032","More menu","Save success","After saving succeeds, enable Read offline, disable Save for offline and enable Remove offline copy.",null,"Offline state is browser- and device-specific.",""],
 ["SCR-05-033","More menu","Save failure","On failure, remove incomplete IndexedDB data and display Retry.",null,"Do not modify sourceType or delete the original source.",""],
 ["SCR-05-034","More menu","Remove offline copy","Remove the application-managed IndexedDB copy after user confirmation.",null,"Do not delete the Book record, user-managed downloaded file or remote source.",""],
 ["SCR-05-035","More menu","Remove success","After removal, disable Read offline, enable Save for offline and update Offline Status.",null,"If another application-managed local source remains available, recompute availability before disabling.",""],
 ["SCR-05-036","Control state","REMOTE_URL not saved","For a REMOTE_URL document without an IndexedDB copy: enable Download PDF and Save for offline; disable Remove offline copy and Read offline.",null,"Requires an online connection to execute Download or Save.",""],
 ["SCR-05-037","Control state","REMOTE_URL saved","For a REMOTE_URL document with an IndexedDB copy: enable Download PDF, Read offline and Remove offline copy; disable Save for offline.",null,"Download PDF remains available because it serves a different user-managed purpose.",""],
 ["SCR-05-038","Control state","LOCAL_UPLOAD","For LOCAL_UPLOAD, enable actions according to actual application-managed availability.",null,"If the PDF is already stored for offline reading, enable Read offline and Remove offline copy; Save for offline is disabled.",""],
 ["SCR-05-039","Connectivity","Online mode","When online, allow remote loading and all actions whose source requirements are satisfied.",null,"Display Online Mode in the footer.",""],
 ["SCR-05-040","Connectivity","Offline mode","When offline, load only an available local/offline copy and disable network-dependent actions.",null,"Display Offline Mode and a clear reason when the document is unavailable.",""],
 ["SCR-05-041","Responsive","Mobile layout","On mobile, collapse navigation, maximize the reading area and keep essential controls reachable without horizontal page scrolling.",null,"Secondary actions may remain inside the More menu.",""],
 ["SCR-05-042","Accessibility","Reader controls","Provide keyboard focus, accessible names and tooltips for icon-only controls and disabled-state explanations.",null,"Announce page changes and loading errors appropriately.",""],
 ["SCR-05-043","Performance","Page loading","Render pages on demand and release unnecessary page resources when appropriate.",null,"Avoid loading and rendering all pages simultaneously for large PDFs.",""],
];
let components = [
 ["SCR-06-C001","Navigation","Back to Library","Display a Back to Library action above the page title.",null,"Returns without creating a Book record.",""],
 ["SCR-06-C002","Header","Page title","Display the title “Add Document”.",null,"Use Add Book or Add Document consistently across UI and documents.",""],
 ["SCR-06-C003","Source file","Local Upload radio","Select Local Upload as the active source method.",null,"Selected by default. Only one source-method radio may be selected.",""],
 ["SCR-06-C004","Source file","Browse control","Open the device file picker and display the selected PDF file name.",null,"Enabled only when Local Upload is selected; disabled styling follows the state specification.",""],
 ["SCR-06-C005","Source file","Fetch from URL radio","Select Fetch from URL as the active source method.",null,"Selecting it disables Browse and enables the URL input.",""],
 ["SCR-06-C006","Source file","Remote URL input","Allow entry of an HTTP/HTTPS PDF URL.",null,"Enabled only when Fetch from URL is selected.",""],
 ["SCR-06-C007","Source file","OR separator","Visually communicate that the source methods are mutually exclusive.",null,"Radio buttons provide the actual selection behavior.",""],
 ["SCR-06-C008","Metadata","Title","Required text input for the document title.",null,"Trim whitespace; recommended maximum 255 characters.",""],
 ["SCR-06-C009","Metadata","Author","Required text input for the author.",null,"Trim whitespace; recommended maximum 255 characters.",""],
 ["SCR-06-C010","Metadata","Publish year","Optional four-digit year input.",null,"Valid range should be defined; recommended 1 through current year.",""],
 ["SCR-06-C011","Metadata","Tags","Optional multi-value tag input; Enter creates a tag chip.",null,"Trim values, prevent duplicates and support removing a chip.",""],
 ["SCR-06-C012","Metadata","Summary","Optional multi-line description input.",null,"Recommended maximum 2,000 characters with a counter if enforced.",""],
 ["SCR-06-C013","Action","Add Document","Submit the selected source and metadata.",null,"Disable while submitting to prevent duplicate records.",""],
 ["SCR-06-C014","Action","Cancel","Discard the current operation and return to Library.",null,"Prompt for confirmation when unsaved data exists.",""],
 ["SCR-06-C015","Common layout","Sidebar","Display Dashboard, Library, Recent and Favorites; highlight Library.",null,"Only one navigation item is active.",""],
 ["SCR-06-C016","Common layout","Settings","Display the Settings icon according to the common header specification.",null,"Hide or disable if Settings is outside scope.",""],
 ["SCR-06-C017","Footer","Version and mode","Display application version and current Online/Offline mode.",null,"Remote URL validation and submission require Online mode.",""],
];
components = [
 ["SCR-07-C001","Navigation","Back to Library","Display a Back to Library action above the page title.",null,"If unsaved changes exist, use the same discard confirmation as Cancel.",""],
 ["SCR-07-C002","Header","Page title","Display the title “Edit Document”.",null,"The screen operates on the Book ID supplied by the origin screen.",""],
 ["SCR-07-C003","Source file","Local Upload radio","Select Local Upload as the active source method.",null,"Its initial state reflects the existing sourceType.",""],
 ["SCR-07-C004","Source file","Browse control","Allow selection of a replacement PDF and display its file name.",null,"Enabled only when Local Upload is selected.",""],
 ["SCR-07-C005","Source file","File properties","Display properties of the currently stored or newly selected local PDF.",null,"Recommended fields: file name, pages, size and uploaded date; hide for REMOTE_URL when not applicable.",""],
 ["SCR-07-C006","Source file","Fetch from URL radio","Select Remote URL as the active source method.",null,"Selecting it disables Browse and enables URL input.",""],
 ["SCR-07-C007","Source file","Remote URL input","Display and allow editing of the PDF source URL.",null,"Enabled only when Fetch from URL is selected.",""],
 ["SCR-07-C008","Metadata","Title","Required text input prefilled with the current title.",null,"Trim whitespace; recommended maximum 255 characters.",""],
 ["SCR-07-C009","Metadata","Author","Required text input prefilled with the current author.",null,"Trim whitespace; recommended maximum 255 characters.",""],
 ["SCR-07-C010","Metadata","Publish year","Optional text input supporting Common Era and BCE years.",null,"Database type NVARCHAR(10); examples: 2021, 180 BC and 300 BCE.",""],
 ["SCR-07-C011","Metadata","Tags","Display existing tags as removable chips and allow new tags.",null,"Trim values and prevent duplicates.",""],
 ["SCR-07-C012","Metadata","Summary","Optional multi-line summary prefilled with the current value.",null,"Recommended maximum 2,000 characters.",""],
 ["SCR-07-C013","Action","Save Changes","Validate and persist modified source and/or metadata.",null,"Disable when nothing changed or while saving.",""],
 ["SCR-07-C014","Action","Cancel","Discard unsaved changes and return to the origin screen.",null,"Require confirmation when the form is dirty.",""],
 ["SCR-07-C015","Danger Zone","Warning","Explain the permanent effects of Delete Document.",null,"Keep visually separated from Save/Cancel actions.",""],
 ["SCR-07-C016","Danger Zone","Delete Document","Start permanent document deletion.",null,"Always requires explicit confirmation.",""],
 ["SCR-07-C017","Common layout","Sidebar","Display main navigation and highlight Library.",null,"Only one navigation item is active.",""],
 ["SCR-07-C018","Footer","Version and mode","Display application version and Online/Offline mode.",null,"Remote URL validation and source replacement require Online mode.",""],
];
const componentStart = 92;
const componentEnd = componentStart + components.length - 1;
sheet.getRange(`A${componentStart}:G${componentEnd}`).values = components;
sheet.getRange(`A${componentStart}:G${componentEnd}`).format = {
  font: { color: body, size: 9 }, verticalAlignment: "top", wrapText: true,
  borders: { preset: "all", style: "thin", color: border },
};
sheet.getRange(`A${componentStart}:A${componentEnd}`).format.horizontalAlignment = "center";
sheet.getRange(`B${componentStart}:C${componentEnd}`).format.fill = gray;
sheet.getRange(`F${componentStart}:F${componentEnd}`).format.fill = "#FFFBEA";
for (let row = componentStart; row <= componentEnd; row++) sheet.getRange(`A${row}:G${row}`).format.rowHeight = 46;

const eventsSectionRow = componentEnd + 2;
section(eventsSectionRow, "Events");
const eventsHeaderRow = eventsSectionRow + 1;
const eventsHeader = sheet.getRange(`A${eventsHeaderRow}:G${eventsHeaderRow}`);
eventsHeader.values = [["ID", "Main", "Sub", "Description", null, "Note/ Assumption", "Ticket link"]];
eventsHeader.format = {
  fill: blue, font: { bold: true, color: "#FFFFFF", size: 10 }, horizontalAlignment: "center",
  verticalAlignment: "center", borders: { preset: "all", style: "thin", color: navy }, wrapText: true,
};
eventsHeader.format.rowHeight = 26;

let events = [
 ["SCR-06-E001","Initial display","Open screen","Initialize an empty form with Local Upload selected, Browse enabled and Remote URL input disabled.",null,"The default selected radio determines the pending sourceType.",""],
 ["SCR-06-E002","Local upload","Browse file","When Browse is selected, open the file picker; after selection, validate the PDF and display its file name.",null,"Accept one .pdf file only; validate MIME type, extension and size.",""],
 ["SCR-06-E003","Local upload","Invalid file","Reject unsupported, empty, corrupted or oversized files and display an inline error.",null,"Maximum file size must be configurable; suggested learning-project limit: 50 MB.",""],
 ["SCR-06-E004","Local upload","Replace file","When Browse is enabled, allow the selected PDF to be replaced and update the displayed file name.",null,"Replacing does not create or delete a Book record.",""],
 ["SCR-06-E005","Source selection","Select Local Upload","Set pending sourceType = LOCAL_UPLOAD, enable Browse and disable the Remote URL input.",null,"A previously entered URL may remain visible but disabled; it is not submitted.",""],
 ["SCR-06-E006","Source selection","Select Fetch from URL","Set pending sourceType = REMOTE_URL, disable Browse and enable the Remote URL input.",null,"A previously selected file name may remain visible but disabled; the file is not uploaded.",""],
 ["SCR-06-E007","Remote URL","Validate syntax","Validate that the URL uses HTTP or HTTPS and is syntactically valid.",null,"Reject unsupported protocols and whitespace-only input.",""],
 ["SCR-06-E008","Remote URL","Validate PDF","Verify that the remote resource is accessible and represents a PDF.",null,"Handle redirects, timeout, HTTP errors and content-type mismatch. Browser CORS limitations may require backend validation.",""],
 ["SCR-06-E009","Remote URL","Offline mode","Disable remote validation/submission and explain that an online connection is required.",null,"Local Upload remains available if the application can receive the file.",""],
 ["SCR-06-E010","Metadata","Enter tags","Pressing Enter with a non-empty tag creates a chip; selecting its remove icon deletes it.",null,"Do not submit the form merely because Enter is used in the tag field.",""],
 ["SCR-06-E011","Validation","Required fields","On submit, validate only the currently selected source method together with required Title and Author.",null,"Ignore the disabled source control even if it retains a previous value; focus the first error.",""],
 ["SCR-06-E012","Validation","Publish year","If entered, require an integer within the allowed range.",null,"Do not accept decimals or non-numeric characters.",""],
 ["SCR-06-E013","Submit","Local Upload","If Local Upload is selected, upload only the selected PDF and create the Book record with sourceType = LOCAL_UPLOAD.",null,"Do not submit a disabled URL value. Store originalFileName, fileSize and application filePath.",""],
 ["SCR-06-E014","Submit","Remote URL","If Fetch from URL is selected, create the Book record with sourceType = REMOTE_URL and pdfUrl after validation.",null,"Do not upload a retained disabled local file or automatically save the remote PDF to IndexedDB.",""],
 ["SCR-06-E015","Submit","Initial values","Initialize favorite = false, lastReadPage = 0, readingStatus = UNREAD and timestamps.",null,"totalPages may be extracted during validation/upload or populated after first PDF load.",""],
 ["SCR-06-E016","Submit","Success","Show a success message and navigate to SCR-02 Library or open MD-01 for the created Book.",null,"Recommended simple flow: return to Library and highlight the new record.",""],
 ["SCR-06-E017","Submit","Failure","Keep entered metadata, show an error and allow Retry.",null,"Clean up an uploaded application file if Book creation fails after file storage.",""],
 ["SCR-06-E018","Submit","Duplicate prevention","Prevent repeated submission while the request is running.",null,"Use server-side protection in addition to disabling the button.",""],
 ["SCR-06-E019","Cancel","No changes","Return to Library immediately when the form is empty.",null,"No confirmation is required.",""],
 ["SCR-06-E020","Cancel","Unsaved changes","When form data exists, ask the user to confirm discarding it.",null,"Canceling the confirmation returns to the form with all data retained.",""],
 ["SCR-06-E021","Responsive","Mobile layout","Stack source and metadata sections vertically and keep actions reachable without horizontal scrolling.",null,"File drop may become a standard file picker on mobile.",""],
 ["SCR-06-E022","Accessibility","Form operation","Associate labels and errors with inputs, expose required state and support keyboard file selection.",null,"Do not communicate validation only by color.",""],
];
events = [
 ["SCR-07-E001","Initial display","Load Book","Retrieve the selected Book and prefill source, metadata, tags and summary.",null,"Show loading until required data is available.",""],
 ["SCR-07-E002","Initial display","Load failure","If the Book does not exist or loading fails, show Retry and Back actions.",null,"Do not display stale data from another Book.",""],
 ["SCR-07-E003","Source state","LOCAL_UPLOAD","Select Local Upload, enable Browse, display current file name/properties and disable URL input.",null,"The current stored PDF remains unchanged until Save succeeds.",""],
 ["SCR-07-E004","Source state","REMOTE_URL","Select Fetch from URL, enable and prefill URL input, and disable Browse.",null,"Hide local file properties unless a retained local copy must be shown separately.",""],
 ["SCR-07-E005","Local upload","Select replacement","Validate the newly selected PDF and show its name and properties as pending data.",null,"Accept one PDF within the configured size limit.",""],
 ["SCR-07-E006","Local upload","Invalid replacement","Reject unsupported, empty, corrupted or oversized files and retain the existing source.",null,"The stored PDF is never replaced before successful Save.",""],
 ["SCR-07-E007","Source selection","Switch method","Enable controls for the selected radio and disable the other method.",null,"Retained disabled values are not validated or submitted.",""],
 ["SCR-07-E008","Remote URL","Validate URL","Validate HTTP/HTTPS syntax, accessibility and PDF content for a changed URL.",null,"Handle redirect, timeout, HTTP errors and content-type mismatch; backend validation may be required.",""],
 ["SCR-07-E009","Remote URL","Offline mode","Prevent changing to or validating a new Remote URL while offline.",null,"Existing metadata may still be edited when permitted.",""],
 ["SCR-07-E010","Metadata","Publish year","Trim and normalize optional publishYear; accept YYYY, YYYY BC and YYYY BCE up to 10 characters.",null,"Examples: 180bc → 180 BC. Reject unsupported text and values longer than NVARCHAR(10).",""],
 ["SCR-07-E011","Metadata","Tags","Allow adding and removing tag chips without submitting the form on Enter.",null,"Prevent blank and duplicate tags.",""],
 ["SCR-07-E012","Change tracking","Dirty form","Mark the form dirty when source or metadata differs from the loaded Book.",null,"Disable Save Changes when no effective change exists.",""],
 ["SCR-07-E013","Validation","Save validation","Validate Title, Author, Publish Year and only the currently selected source.",null,"Show inline errors and focus the first invalid control.",""],
 ["SCR-07-E014","Save","Metadata only","Update metadata and updatedAt without changing reading progress, favorite state or offline copy.",null,"No PDF storage operation is required.",""],
 ["SCR-07-E015","Save","Detect source change","Treat changed sourceType, local PDF or remote URL as a source replacement.",null,"A URL changed to another URL is also a source replacement.",""],
 ["SCR-07-E016","Save","Confirm source replacement","Before saving a replacement source, warn that page count, progress and offline data may be reset.",null,"Canceling the confirmation returns to the edit form.",""],
 ["SCR-07-E017","Save","Upload replacement","For LOCAL_UPLOAD replacement, upload the new PDF to temporary/application storage before updating the Book.",null,"Do not remove the old application copy until the database update succeeds.",""],
 ["SCR-07-E018","Save","Remote replacement","For REMOTE_URL replacement, store the validated URL and sourceType = REMOTE_URL.",null,"Do not automatically save the new PDF to IndexedDB.",""],
 ["SCR-07-E019","Save","Reset reading data","After successful source replacement, set lastReadPage = 0, readingStatus = UNREAD, clear lastReadAt and recalculate totalPages.",null,"Favorite and metadata remain unchanged unless explicitly edited.",""],
 ["SCR-07-E020","Save","Invalidate offline copy","Remove the old IndexedDB copy from the current browser after source replacement.",null,"Other devices cannot be cleaned automatically; offline copies must be versioned or detected as stale.",""],
 ["SCR-07-E021","Save","Transactional success","After the Book update succeeds, remove the obsolete application-managed source, show success and return/refresh.",null,"Recommended destination: refreshed MD-01 or Library.",""],
 ["SCR-07-E022","Save","Failure and rollback","On failure, keep the old Book/source valid, remove incomplete new storage and retain form values for Retry.",null,"Do not leave the record pointing to a missing file.",""],
 ["SCR-07-E023","Save","Concurrent update","Detect if the Book was changed after the edit form loaded.",null,"Use updatedAt/version for optimistic locking and ask the user to reload.",""],
 ["SCR-07-E024","Cancel","Unsaved changes","When Cancel or Back is used with a dirty form, confirm discarding changes.",null,"Declining returns to the form unchanged.",""],
 ["SCR-07-E025","Delete","Open confirmation","When Delete Document is selected, display a confirmation describing all affected application data.",null,"No deletion occurs before confirmation.",""],
 ["SCR-07-E026","Delete","Confirmed","Delete Book metadata, the application-managed PDF and the current browser's IndexedDB copy, then return to Library.",null,"Do not delete the user's original device file or any remote Internet source.",""],
 ["SCR-07-E027","Delete","Failure","If deletion fails, keep the user on SCR-07 and display an actionable error.",null,"Avoid partial deletion where possible; reconcile storage if it occurs.",""],
 ["SCR-07-E028","Responsive","Mobile layout","Stack source, metadata and Danger Zone sections and keep actions accessible.",null,"Use a standard file picker on mobile.",""],
 ["SCR-07-E029","Accessibility","Form operation","Associate labels/errors with inputs and expose radio, disabled and destructive-action states.",null,"Do not communicate validation or danger only by color.",""],
];
const eventStart = eventsHeaderRow + 1;
const eventEnd = eventStart + events.length - 1;
sheet.getRange(`A${eventStart}:G${eventEnd}`).values = events;
sheet.getRange(`A${eventStart}:G${eventEnd}`).format = {
  font: { color: body, size: 9 }, verticalAlignment: "top", wrapText: true,
  borders: { preset: "all", style: "thin", color: border },
};
sheet.getRange(`A${eventStart}:A${eventEnd}`).format.horizontalAlignment = "center";
sheet.getRange(`B${eventStart}:C${eventEnd}`).format.fill = gray;
sheet.getRange(`F${eventStart}:F${eventEnd}`).format.fill = "#FFFBEA";
for (let row = eventStart; row <= eventEnd; row++) sheet.getRange(`A${row}:G${row}`).format.rowHeight = 46;
const end = eventEnd;

for (const [col, width] of [["A",15],["B",24],["C",24],["D",58],["E",2],["F",38],["G",20]]) {
  sheet.getRange(`${col}:${col}`).format.columnWidth = width;
}
sheet.freezePanes.freezeRows(4);

console.log((await workbook.inspect({
  kind: "table", sheetId: sheet.name, range: `A1:G${end}`, include: "values,formulas",
  tableMaxRows: 16, tableMaxCols: 7, maxChars: 9000,
})).ndjson);
console.log((await workbook.inspect({
  kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 }, summary: "formula error scan",
})).ndjson);

for (const [name, range] of [
  ["top", "A1:G16"], ["wireframe", "A14:G64"], ["flow", "A65:G89"],
  ["components", `A90:G${componentEnd}`], ["events", `A${eventsSectionRow}:G${end}`],
]) {
  const rendered = await workbook.render({ sheetName: sheet.name, range, scale: 1, format: "png" });
  await fs.writeFile(path.join(previewDir, `${name}.png`), new Uint8Array(await rendered.arrayBuffer()));
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log((await workbook.inspect({ kind: "drawing", maxChars: 5000 })).ndjson);
console.log(`OUTPUT=${outputPath}`);
