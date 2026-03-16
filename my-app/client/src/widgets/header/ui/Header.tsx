import { Link, NavLink } from 'react-router'
import styles from './Header.module.css'

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            AdStands
          </Link>

          <nav className={styles.nav}>
            <NavLink to="/">Главная</NavLink>
            <NavLink to="/request">Отправить запрос</NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}