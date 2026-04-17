import {
  IconAlertCircle,
  IconInbox,
  IconPackage,
  IconRefresh
} from '@tabler/icons-react';

import styles from './FeedState.module.css';

type SkeletonVariant = 'company' | 'business';

interface NewsSkeletonProps {
  variant?: SkeletonVariant;
}

export const NewsSkeleton = ({ variant = 'company' }: NewsSkeletonProps) => (
  <div className={styles.skeletonList} aria-label="Загрузка новостей">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className={`${styles.skeletonCard} ${
          variant === 'business' ? styles.skeletonCardBusiness : ''
        }`}
      >
        <div className={styles.skeletonImage} />
        <div className={styles.skeletonContent}>
          <div className={`${styles.skeletonLine} ${styles.skeletonLineNarrow}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonLineWide}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonLineWide}`} />
          <div className={styles.skeletonMeta} />
        </div>
      </div>
    ))}
  </div>
);

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div className={styles.state}>
    <div className={`${styles.icon} ${styles.emptyIllustration}`}>
      <IconPackage size={92} stroke={1.7} />
    </div>
    <div className={styles.textGroup}>
      <h3 className={styles.title}>{title}</h3>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  </div>
);

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <div className={styles.state} role="alert">
    <div className={styles.icon}>
      <IconAlertCircle size={30} stroke={1.8} />
    </div>
    <div className={styles.textGroup}>
      <h3 className={styles.title}>Не удалось загрузить новости</h3>
      <p className={styles.description}>{message}</p>
    </div>
    <button type="button" className={styles.button} onClick={onRetry}>
      <IconRefresh size={18} stroke={1.8} />
      Повторить
    </button>
  </div>
);

interface LoadingOverlayProps {
  label?: string;
}

export const LoadingOverlay = ({ label = 'Обновляем новости' }: LoadingOverlayProps) => (
  <div className={styles.state} aria-live="polite">
    <div className={styles.icon}>
      <IconInbox size={30} stroke={1.8} />
    </div>
    <div className={styles.textGroup}>
      <h3 className={styles.title}>{label}</h3>
      <p className={styles.description}>Подождите немного, мы загружаем актуальные публикации.</p>
    </div>
  </div>
);
