//*отримує нотатки з бекенду (fetchNotes)
// враховує пошук*/

import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import css from "./NoteList.module.css";

// Типи пропсів
interface NoteListProps {
  notes: Note[]; // список нотатків
  currentPage: number; //поточний стан
}

export default function NoteList({ notes, currentPage }: NoteListProps) {
  const queryClient = useQueryClient();

  // Налаштовання мутаціі для видалення нотатки
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", currentPage] });
    },
  });

  const handleDelete = (id: string | number) => {
    deleteMutation.mutate(id.toString());
  };

  //Список нотатків
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            {note.tag && <span className={css.tag}>{note.tag}</span>}
            <button
              className={css.button}
              type="button"
              onClick={() => handleDelete(note.id)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
