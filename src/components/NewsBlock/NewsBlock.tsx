import { useNewsFeed } from '../../hooks/useNewsFeed';
import { NewsCard } from '../NewsCard/NewsCard';
import { Pagination } from '../Pagination/Pagination';
import { EmptyState, ErrorState, NewsSkeleton } from '../FeedState/FeedState';
import styles from './NewsBlock.module.css';

type NewsBlockVariant = 'company' | 'business';
type SubtitleMode = 'month' | 'weekday';

interface NewsBlockProps {
  title: string;
  endpoint: string;
  perPage?: number;
  variant: NewsBlockVariant;
  subtitleMode?: SubtitleMode;
  emptyTitle: string;
  emptyDescription: string;
}

const monthFormatter = new Intl.DateTimeFormat('ru-RU', {
  month: 'long',
  year: 'numeric'
});

const weekdayFormatter = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'long',
  day: 'numeric',
  month: 'long'
});

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const NewsBlock = ({
  title,
  endpoint,
  perPage = 3,
  variant,
  subtitleMode = 'month',
  emptyTitle,
  emptyDescription
}: NewsBlockProps) => {
  const { data, page, totalPages, setPage, isLoading, isFetching, error, retry } = useNewsFeed({
    endpoint,
    perPage
  });

  const news = data?.news ?? [];
  const hasNews = news.length > 0;
  const headerDate = news[0]?.publishedAt || data?.minDatePublication || '';
  const subtitle = headerDate
    ? capitalize(
        subtitleMode === 'weekday'
          ? weekdayFormatter.format(new Date(headerDate))
          : monthFormatter.format(new Date(headerDate))
      )
    : '';

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </header>

      {isLoading ? <NewsSkeleton variant={variant} /> : null}

      {!isLoading && error ? <ErrorState message={error} onRetry={retry} /> : null}

      {!isLoading && !error && !hasNews ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : null}

      {!isLoading && !error && hasNews ? (
        <>
          <div className={`${styles.content} ${styles[`content${variant}`]} ${isFetching ? styles.contentMuted : ''}`}>
            {news.map((item, index) => (
              <NewsCard
                key={item.id}
                item={item}
                variant={variant}
                featured={variant === 'business' && index === 0}
              />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            disabled={isFetching}
            onPrevious={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            onNext={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
          />
        </>
      ) : null}
    </section>
  );
};
