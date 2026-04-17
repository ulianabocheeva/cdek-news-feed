import { NewsBlock } from './components/NewsBlock/NewsBlock';
import styles from './App.module.css';

const blocks = [
  {
    title: 'Новости компании',
    endpoint: '/news/feed/company/short',
    variant: 'company' as const,
    subtitleMode: 'month' as const,
    emptyTitle: 'Новостей пока нет',
    emptyDescription: 'Когда редакция опубликует материалы, они появятся здесь.'
  },
  {
    title: 'Бизнес',
    endpoint: '/news/feed/company/short',
    variant: 'business' as const,
    subtitleMode: 'month' as const,
    emptyTitle: 'В рубрике пока нет материалов',
    emptyDescription: 'Новые публикации появятся здесь позже.'
  },
  {
    title: 'Важные новости',
    endpoint: '/news/feed/company/empty',
    variant: 'company' as const,
    subtitleMode: 'weekday' as const,
    emptyTitle: 'Новых новостей нет',
    emptyDescription: ''
  }
];

const App = () => (
  <main className={styles.page}>
    <div className={styles.shell}>
      <section className={styles.hero}>
        <span className={styles.badge}>CDEK</span>
        <h1 className={styles.title}>Новостной портал</h1>
        <p className={styles.lead}>
          Внутренние новости компании, подборки по рубрикам и важные публикации в едином
          интерфейсе.
        </p>
      </section>

      {blocks.map((block) => (
        <NewsBlock key={block.title} {...block} />
      ))}
    </div>
  </main>
);

export default App;
