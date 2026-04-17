export interface NewsImage {
  s?: string;
  m?: string;
  l?: string;
  hd?: string;
}

export interface NewsCover {
  type?: string;
  images?: NewsImage[];
}

export interface NewsRubric {
  id: number;
  slug: string;
  name: string;
}

export interface NewsDirection {
  id: number;
  slug: string;
  name: string;
}

export interface NewsItem {
  id: string;
  title: string;
  cover?: NewsCover | null;
  likeCount: number;
  viewCount: number;
  publishedAt: string;
  rubrics: NewsRubric[];
  directions?: NewsDirection[];
  isBreaking?: boolean;
}

export interface NewsResponse {
  totalPages: number;
  perPage: number;
  news: NewsItem[];
  minDatePublication: string;
}
