import type { Stand } from '@/entities/stand/model/types'
import styles from './StandCard.module.css'
import { Link } from 'react-router'

type Props = {
  stand: Stand
}

export const StandCard = ({ stand }: Props) => {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          className={styles.image}
          src={stand.images[0]}
          alt={stand.title}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{stand.title}</h3>
        <p className={styles.mall}>{stand.mallName}</p>
        <p className={styles.address}>{stand.address}</p>
        <p className={styles.description}>{stand.description}</p>

        <Link className="button" to={`/stands/${stand.slug}`}>
          Подробнее
        </Link>
      </div>
    </article>
  )
}