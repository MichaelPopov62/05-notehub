// Тип для тега — ярлика, що допомагає позначити нотатку
export interface NoteTag {
  name: string; // Назва тега
  color: string; // Колір тега у вигляді рядка
}

// Інтерфейс для нотатки
export interface Note {
  id: number; // Унікальний ідентифікатор нотатки
  title: string; // Заголовок нотатки
  content: string; // Основний текст нотатки
  createdAt: string; // Дата і час створення нотатки
  updatedAt: string; // Дата і час останнього оновлення нотатки
  tag?: string; // Необов’язковий тег (назва), який позначає категорію нотатки
}
