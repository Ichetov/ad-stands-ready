import type { Stand } from '@/entities/stand/model/types'
import { StandCard } from '@/entities/stand/ui/StandCard'
import styles from './StandList.module.css'

type Props = {
  stands: Stand[]
}

export const StandList = ({ stands }: Props) => {
  if (stands.length === 0) {
    return <div>Точки не найдены.</div>
  }

  return (
    <div className={styles.list}>
      {stands.map((stand) => (
        <StandCard key={stand.id} stand={stand} />
      ))}
    </div>
  )
}