import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';

import styles from './Pagination.module.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  disabled?: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const Pagination = ({
  page,
  totalPages,
  disabled = false,
  onPrevious,
  onNext
}: PaginationProps) => (
  <div className={styles.pagination}>
    <div className={styles.controls}>
      <button
        type="button"
        className={styles.button}
        onClick={onPrevious}
        disabled={disabled || page <= 1}
        aria-label="Предыдущая страница"
      >
        <IconArrowLeft size={18} stroke={1.8} />
      </button>

      <button
        type="button"
        className={styles.button}
        onClick={onNext}
        disabled={disabled || totalPages === 0 || page >= totalPages}
        aria-label="Следующая страница"
      >
        <IconArrowRight size={18} stroke={1.8} />
      </button>
    </div>
  </div>
);
