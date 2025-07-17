import css from "../App/App.module.css";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import Pagination from "../Pagination/Pagination";
import { fetchNotes } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";

const PER_PAGE = 10;

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", currentPage],
    queryFn: () => fetchNotes({ page: currentPage, perPage: PER_PAGE }),
  });

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
  };
  // Відкриваємо модалку
  const openModal = () => setIsModalOpen(true);
  // Закриваємо модалку
  const closeModal = () => setIsModalOpen(false);
  // Закриття модалки по клавіші Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* Компонент SearchBox */}
        <SearchBox />

        {/* Пагінація (відображається лише якщо більше 1 сторінки)*/}
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}

        {/* Кнопка створення нотатки */}

        <button className={css.button} onClick={openModal}>
          Create Note +
        </button>
      </header>

      {isLoading && <p>Завантаження нотаток...</p>}
      {isError && <p>Сталася помилка при завантаженні нотаток</p>}

      {/* Список нотаток */}
      {data && <NoteList notes={data.notes} />}
      {/* Модалка для створення нотатки (пізніше додамо логіку відкриття) */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
