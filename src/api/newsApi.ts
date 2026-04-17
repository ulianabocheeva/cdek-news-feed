import type { NewsResponse } from '../types/news';

const DEFAULT_API_BASE_URL = '/api/v1';
const FALLBACK_API_BASE_URL = 'http://1e14c3489fcb.vps.myjino.ru:5000/api/v1';

export interface FetchNewsParams {
  endpoint: string;
  page: number;
  perPage: number;
}

const createUrl = (baseUrl: string, endpoint: string, page: number, perPage: number) => {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  return `${normalizedBase}${normalizedEndpoint}?perPage=${perPage}&page=${page}`;
};

export const fetchNews = async ({
  endpoint,
  page,
  perPage
}: FetchNewsParams): Promise<NewsResponse> => {
  const requestedUrl = createUrl(DEFAULT_API_BASE_URL, endpoint, page, perPage);

  try {
    const response = await fetch(requestedUrl);

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    return (await response.json()) as NewsResponse;
  } catch (error) {
    if (!import.meta.env.DEV) {
      throw error;
    }

    const fallbackUrl = createUrl(FALLBACK_API_BASE_URL, endpoint, page, perPage);
    const response = await fetch(fallbackUrl);

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    return (await response.json()) as NewsResponse;
  }
};
