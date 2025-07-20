//*отримує нотатки з бекенду (fetchNotes)
// враховує пошук*/

import { useState } from "react";
import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import css from "./NoteList.module.css";

// Типи пропсів
interface NoteListProps {
  notes: Note[]; // список нотатків
  // currentPage: number; //поточний стан
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Налаштовання мутаціі для видалення нотатки
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setErrorMessage(null);
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "Failed to delete note");
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id.toString());
  };

  //Список нотатків
  return (
    <>
      {errorMessage && <p className={css.error}>{errorMessage}</p>}
      <ul className={css.list}>
        {notes.map((note) => (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              {<span className={css.tag}>{note.tag}</span>}
              <button
                className={css.button}
                type="button"
                onClick={() => handleDelete(note.id)}
                disabled={deleteMutation.isPending}
              >
                {/*користувач бачить зміну надпису кнопки якщо відбуваеться
                видалення*/}
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
