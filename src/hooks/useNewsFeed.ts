import { useEffect, useRef, useState } from 'react';

import { fetchNews } from '../api/newsApi';
import type { NewsResponse } from '../types/news';

interface UseNewsFeedOptions {
  endpoint: string;
  perPage: number;
}

const getStorageKey = (endpoint: string) => `news-page-${endpoint}`;

const readSavedPage = (endpoint: string) => {
  if (typeof window === 'undefined') {
    return 1;
  }

  const savedValue = Number(window.sessionStorage.getItem(getStorageKey(endpoint)));

  return Number.isFinite(savedValue) && savedValue > 0 ? savedValue : 1;
};

export const useNewsFeed = ({ endpoint, perPage }: UseNewsFeedOptions) => {
  const [page, setPage] = useState(() => readSavedPage(endpoint));
  const [data, setData] = useState<NewsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const cacheRef = useRef<Map<string, NewsResponse>>(new Map());
  const dataRef = useRef<NewsResponse | null>(null);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    setPage(readSavedPage(endpoint));
    setData(null);
    setError(null);
    setIsLoading(true);
    setIsFetching(false);
  }, [endpoint, perPage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(getStorageKey(endpoint), String(page));
    }
  }, [endpoint, page]);

  useEffect(() => {
    let isCancelled = false;
    const cacheKey = `${endpoint}-${page}-${perPage}`;
    const cached = cacheRef.current.get(cacheKey);
    const hasExistingData = Boolean(dataRef.current);

    if (cached) {
      setData(cached);
      setError(null);
      setIsLoading(false);
      setIsFetching(false);
      return undefined;
    }

    const loadNews = async () => {
      setError(null);
      setIsLoading(!hasExistingData);
      setIsFetching(hasExistingData);

      try {
        const response = await fetchNews({ endpoint, page, perPage });

        if (isCancelled) {
          return;
        }

        cacheRef.current.set(cacheKey, response);
        setData(response);
      } catch (requestError) {
        if (isCancelled) {
          return;
        }

        const message =
          requestError instanceof Error ? requestError.message : 'Не удалось загрузить новости.';
        setError(message);
      } finally {
        if (isCancelled) {
          return;
        }

        setIsLoading(false);
        setIsFetching(false);
      }
    };

    loadNews();

    return () => {
      isCancelled = true;
    };
  }, [endpoint, page, perPage, reloadToken]);

  useEffect(() => {
    if (!data || data.totalPages <= page) {
      return;
    }

    const nextPage = page + 1;
    const nextKey = `${endpoint}-${nextPage}-${perPage}`;

    if (cacheRef.current.has(nextKey)) {
      return;
    }

    let isCancelled = false;

    const prefetchNextPage = async () => {
      try {
        const response = await fetchNews({ endpoint, page: nextPage, perPage });

        if (!isCancelled) {
          cacheRef.current.set(nextKey, response);
        }
      } catch {
        // Silent prefetch failure: the main request path still handles errors.
      }
    };

    prefetchNextPage();

    return () => {
      isCancelled = true;
    };
  }, [data, endpoint, page, perPage]);

  const totalPages = data?.totalPages ?? 0;

  return {
    page,
    setPage,
    data,
    totalPages,
    isLoading,
    isFetching,
    error,
    retry: () => {
      cacheRef.current.delete(`${endpoint}-${page}-${perPage}`);
      setError(null);
      setReloadToken((currentToken) => currentToken + 1);
    }
  };
};
