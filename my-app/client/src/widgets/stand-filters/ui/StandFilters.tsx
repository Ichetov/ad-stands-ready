
import type { ChangeEvent } from 'react'
import styles from './StandFilters.module.css'

type Props = {
  mall: string
  search: string
  malls: string[]
  onMallChange: (value: string) => void
  onSearchChange: (value: string) => void
}

export const StandFilters = ({
  mall,
  search,
  malls,
  onMallChange,
  onSearchChange
}: Props) => {
  return (
    <div className={styles.filters}>
      <input
        className="input"
        type="text"
        placeholder="Поиск по названию или ТЦ"
        value={search}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
      />

      <select
        className="select"
        value={mall}
        onChange={(e) => onMallChange(e.target.value)}
      >
        <option value="">Все ТЦ</option>
        {malls.map((mallName) => (
          <option key={mallName} value={mallName}>
            {mallName}
          </option>
        ))}
      </select>
    </div>
  )
}