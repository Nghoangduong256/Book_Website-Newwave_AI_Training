import axios from "axios";
import type { Book, BookUpsert } from "../types/book";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 15000,
});

export const booksApi = {
  async list(): Promise<Book[]> {
    const res = await api.get<Book[]>("/books");
    return res.data;
  },

  async get(id: number): Promise<Book> {
    const res = await api.get<Book>(`/books/${id}`);
    return res.data;
  },

  async create(payload: BookUpsert): Promise<Book> {
    const res = await api.post<Book>("/books", payload);
    return res.data;
  },

  async update(id: number, payload: BookUpsert): Promise<Book> {
    const res = await api.put<Book>(`/books/${id}`, payload);
    return res.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/books/${id}`);
  },
};
