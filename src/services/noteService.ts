import axios from "axios";
import type { Note } from "../types/note";

// Додаю штучну затримку, щоб бачити процеси
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Токен авторизації
const VITE_NOTEHUB_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;
// Базова URL-адреса бекенду
const BASE_URL = "https://notehub-public.goit.study/api";

// Інтерфейс параметрів для отримання нотаток через API
export interface FetchNotesParams {
  page?: number;
  search?: string;
  perPage?: number;
}

// Інтерфейс даних нової нотатки для створення
export interface DataNewNotes {
  title: string;
  content: string;
  tag?: string;
}

// Інтерфейс відповіді сервера при отриманні нотаток
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// Функція отримання нотаток з бекенду
export async function fetchNotes({
  page = 1,
  perPage = 10,
  search = "",
}: FetchNotesParams = {}): Promise<FetchNotesResponse> {
  const response = await axios.get<FetchNotesResponse>(`${BASE_URL}/notes`, {
    params: {
      page,
      perPage,
      // передаю параметр пошуку лише якщо він не порожній
      ...(search.trim() !== "" ? { search } : {}),
    },
    headers: {
      Authorization: `Bearer ${VITE_NOTEHUB_TOKEN}`,
    },
  });

  const data = response.data;

  //Штучна затримка
  await sleep(300);

  if (!data.notes || !Array.isArray(data.notes)) {
    return {
      notes: [],
      totalPages: 0,
    };
  }
  /* Повертаю отримані нотатки і загальну кількість сторінок
Якщо сервер не надіслав кількість сторінок, вважаємо, що їх 1. */
  return {
    notes: data.notes,
    totalPages: data.totalPages ?? 1,
  };
}

// Функція створення нової нотатки
export async function createNote(newNote: DataNewNotes): Promise<Note> {
  const response = await axios.post<Note>(`${BASE_URL}/notes`, newNote, {
    headers: {
      Authorization: `Bearer ${VITE_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
}

// Функція видалення нотатки за ID
export async function deleteNote(id: string): Promise<Note> {
  // Відправляю DELETE-запит з ID нотатки та токеном авторизації
  const response = await axios.delete<Note>(`${BASE_URL}/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${VITE_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
}
