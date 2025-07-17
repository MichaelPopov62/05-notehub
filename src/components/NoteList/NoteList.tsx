// // /*отримує нотатки з бекенду (fetchNotes)
// // враховує пошук*/

import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (notes.length === 0) return <p>Нотаток немає</p>;

  const handleDelete = (id: string | number) => {
    deleteMutation.mutate(id.toString());
  };

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
              Видалити
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
