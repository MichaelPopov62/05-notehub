import ReactPaginate from "react-paginate";
import styles from "./Pagination.module.css";

// Типи пропсів
interface Props {
  pageCount: number;
  currentPage: number;
  onPageChange: (selected: number) => void;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: Props) {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={(event) => onPageChange(event.selected + 1)}
      containerClassName={styles.pagination}
      activeClassName={styles.active}
      pageRangeDisplayed={5}
      marginPagesDisplayed={3}
      previousLabel="←"
      nextLabel="→"
    />
  );
}
