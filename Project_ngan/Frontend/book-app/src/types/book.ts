export type SortKey =
  | "TITLE_ASC"
  | "TITLE_DESC"
  | "YEAR_ASC"
  | "YEAR_DESC"
  | "CREATED_DESC";

export type Book = {
  id: number;
  title: string;
  author: string;
  publishYear?: number | null;
  tags?: string | null; // "khoa hoc,ky nang"
  pdfUrl?: string | null;
  hasLocalFile: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type BookUpsert = {
  title: string;
  author: string;
  publishYear?: number | null;
  tags?: string | null;
  pdfUrl?: string | null;
  hasLocalFile: boolean;
};
