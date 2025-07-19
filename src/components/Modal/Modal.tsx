import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

//Пропси модалки
interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  //Отримую елемент в який буде "вмонтовано" модалку
  const modalRoot = document.getElementById("modal-root");

  if (!modalRoot) {
    throw new Error('Елемент з id="modal-root" не знайдено в DOM.');
  }

  // Обробник кліку по фону модалки
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  // Обробник натискання клавіші Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Очищення після демонтажу компонента
  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalRoot
  );
}
