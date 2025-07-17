import axios from "axios";
import type { Note } from "../types/note";

const VITE_NOTEHUB_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;
const BASE_URL = "https://notehub-public.goit.study/api";

// Типи параметрів
export interface FetchNotesParams {
  page?: number;
  search?: string;
  perPage?: number; //добавив
}
//набір данних
export interface DataNewNotes {
  title: string;
  content: string;
  tag?: string;
}
// Тип відповіді
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// Отримання нотаток
export async function fetchNotes({
  page = 1,
  perPage = 12,
}: FetchNotesParams = {}): Promise<FetchNotesResponse> {
  const response = await axios.get<FetchNotesResponse>(`${BASE_URL}/notes`, {
    params: {
      page,
      perPage,
    },
    headers: {
      Authorization: `Bearer ${VITE_NOTEHUB_TOKEN}`,
    },
  });

  console.log("RESPONSE FROM BACKEND", response.data); // Лог відповіді
  const data = response.data;

  if (!data.notes || !Array.isArray(data.notes)) {
    return {
      notes: [],
      totalPages: 0,
    };
  }

  return {
    notes: data.notes,
    totalPages: data.totalPages ?? 1,
  };
}

// Створення нотатки
export async function createNote(newNote: DataNewNotes): Promise<Note> {
  const response = await axios.post<Note>(`${BASE_URL}/notes`, newNote, {
    headers: {
      Authorization: `Bearer ${VITE_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
}

// Видалення нотатки
export async function deleteNote(id: string): Promise<Note> {
  const response = await axios.delete<Note>(`${BASE_URL}/notes/${id}`);
  return response.data;
}
