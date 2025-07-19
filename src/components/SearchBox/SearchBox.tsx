import type { DebouncedState } from "use-debounce";
import css from "./SearchBox.module.css";

// Пропси компонента
interface SearchBoxProps {
  value: string;
  onSearch: DebouncedState<(newSearchQuery: string) => void>; // Debounced-функція для обробки зміни пошукового запиту
}
export default function SearchBox({ value, onSearch }: SearchBoxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value); // Виклик debounce-функцію з новим текстом, щоб оновити пошук
  };

  return (
    <input
      className={css.searchInput}
      type="text"
      placeholder="Search notes"
      defaultValue={value} // передаю початкове значення але не зв'язую його зі станом,
      onChange={handleChange}
    />
  );
}
