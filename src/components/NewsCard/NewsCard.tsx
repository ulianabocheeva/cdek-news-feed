import {
  IconCalendarWeek,
  IconEye,
  IconPhoto,
  IconThumbUp,
  IconTrendingUp
} from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';

import type { NewsItem } from '../../types/news';
import styles from './NewsCard.module.css';

type NewsCardVariant = 'company' | 'business';

interface NewsCardProps {
  item: NewsItem;
  variant: NewsCardVariant;
  featured?: boolean;
  isFirst?: boolean;
}

const companyDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit'
});

const businessDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

const normalizeImageUrl = (value?: string) => {
  if (!value) {
    return '';
  }

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || 'http://1e14c3489fcb.vps.myjino.ru:5000/api/v1';
  const apiOrigin = apiBaseUrl.replace(/\/api\/v1\/?$/, '');

  if (value.startsWith('/assets/')) {
    if (import.meta.env.DEV) {
      return value;
    }

    return `${apiOrigin}${value}`;
  }

  if (value.startsWith('/')) {
    return `${apiOrigin}${value}`;
  }

  if (value.startsWith('//')) {
    return `https:${value}`;
  }

  return value;
};

const collectUrls = (source: unknown): string[] => {
  if (!source) {
    return [];
  }

  if (typeof source === 'string') {
    return [normalizeImageUrl(source)];
  }

  if (Array.isArray(source)) {
    return source.flatMap((item) => collectUrls(item));
  }

  if (typeof source === 'object') {
    return Object.values(source as Record<string, unknown>).flatMap((value) => collectUrls(value));
  }

  return [];
};

const getImageCandidates = (item: NewsItem) => {
  const priorityImages = item.cover?.images ?? [];
  const priorityUrls = priorityImages.flatMap((image) => [image.l, image.m, image.hd, image.s]);
  const fallbackUrls = collectUrls(item.cover);

  return Array.from(
    new Set(
      [...priorityUrls, ...fallbackUrls]
        .map((imageUrl) => normalizeImageUrl(imageUrl))
        .filter(
          (imageUrl) =>
            Boolean(imageUrl) && (/^https?:\/\//.test(imageUrl) || imageUrl.startsWith('/assets/'))
        )
    )
  );
};

const toHashTag = (value: string) => `#${value.trim().toLowerCase().replace(/\s+/g, '')}`;

const getCategoryItems = (item: NewsItem) => {
  const directions = item.directions?.map((direction) => direction.name) ?? [];
  const rubrics = item.rubrics.map((rubric) => rubric.name);

  return [...directions, ...rubrics].slice(0, 2);
};

export const NewsCard = ({ item, variant, featured = false, isFirst = false }: NewsCardProps) => {
  const imageCandidates = useMemo(() => getImageCandidates(item), [item]);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [item.id]);

  const imageUrl = imageCandidates[imageIndex] || '';
  const hasImage = Boolean(imageUrl);
  const categories = getCategoryItems(item);

  const handleImageError = () => {
    setImageIndex((currentIndex) => currentIndex + 1);
  };

  if (variant === 'business') {
    if (featured) {
      return (
        <article className={`${styles.card} ${styles.businessCard} ${styles.businessFeatured}`}>
          <div className={styles.featuredImageWrapper}>
            {hasImage ? (
              <img
                className={styles.featuredImage}
                src={imageUrl}
                alt={item.title}
                loading="lazy"
                decoding="async"
                onError={handleImageError}
              />
            ) : (
              <div className={styles.placeholder} aria-hidden="true">
                <IconPhoto size={34} stroke={1.6} />
              </div>
            )}
          </div>

          <div className={styles.featuredContent}>
            <span className={styles.topBadge}>
              <IconTrendingUp size={14} stroke={1.8} />
              Топ новость
            </span>

            <h3 className={styles.businessFeaturedTitle}>{item.title}</h3>

            <div className={styles.businessMetaText}>
              <span>{categories.map(toHashTag).join(' ')}</span>
              <span>{businessDateFormatter.format(new Date(item.publishedAt))}</span>
              <span className={styles.inlineMeta}>
                <IconThumbUp size={14} stroke={1.8} />
                {item.likeCount}
              </span>
              <span className={styles.inlineMeta}>
                <IconEye size={14} stroke={1.8} />
                {item.viewCount}
              </span>
            </div>
          </div>
        </article>
      );
    }

    return (
      <article className={`${styles.card} ${styles.businessCard} ${styles.businessCompact}`}>
        <h3 className={styles.businessCompactTitle}>{item.title}</h3>

        <div className={styles.businessMetaText}>
          <span>{categories.map(toHashTag).join(' ')}</span>
          <span>{businessDateFormatter.format(new Date(item.publishedAt))}</span>
          <span className={styles.inlineMeta}>
            <IconThumbUp size={14} stroke={1.8} />
            {item.likeCount}
          </span>
          <span className={styles.inlineMeta}>
            <IconEye size={14} stroke={1.8} />
            {item.viewCount}
          </span>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`${styles.card} ${styles.companyCard} ${!isFirst ? styles.companyCompact : ''}`}
    >
      <div className={styles.companyImageWrapper}>
        {hasImage ? (
          <img
            className={styles.companyImage}
            src={imageUrl}
            alt={item.title}
            loading="lazy"
            decoding="async"
            onError={handleImageError}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true">
            <IconPhoto size={28} stroke={1.6} />
          </div>
        )}
      </div>

      <div className={styles.companyContent}>
        <span className={styles.companyDate}>
          <IconCalendarWeek size={14} stroke={1.8} />
          {companyDateFormatter.format(new Date(item.publishedAt))}
        </span>

        <h3 className={styles.companyTitle}>{item.title}</h3>

        <div className={styles.chips}>
          {categories.map((category) => (
            <span key={category} className={styles.chip}>
              {category}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.companyStats}>
        <span className={styles.stat}>
          <IconThumbUp size={16} stroke={1.8} />
          {item.likeCount}
        </span>
        <span className={styles.stat}>
          <IconEye size={16} stroke={1.8} />
          {item.viewCount}
        </span>
      </div>
    </article>
  );
};
