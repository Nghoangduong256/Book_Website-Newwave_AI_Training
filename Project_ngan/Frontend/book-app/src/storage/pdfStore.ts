import { openDB } from "idb";

const DB_NAME = "book_pdf_db";
const STORE = "pdfs";

type PdfRecord = {
  bookId: number;
  blob: Blob;
  fileName: string;
  updatedAt: number;
};

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE)) {
      db.createObjectStore(STORE, { keyPath: "bookId" });
    }
  },
});

export async function savePdf(bookId: number, blob: Blob, fileName: string) {
  const db = await dbPromise;
  const rec: PdfRecord = { bookId, blob, fileName, updatedAt: Date.now() };
  await db.put(STORE, rec);
}

export async function getPdf(bookId: number): Promise<PdfRecord | undefined> {
  const db = await dbPromise;
  return db.get(STORE, bookId);
}

export async function deletePdf(bookId: number) {
  const db = await dbPromise;
  await db.delete(STORE, bookId);
}

export async function hasPdf(bookId: number): Promise<boolean> {
  const db = await dbPromise;
  const rec = await db.get(STORE, bookId);
  return !!rec?.blob;
}
