export interface NoteTag {
  name: string;
  color: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag?: string;
}
