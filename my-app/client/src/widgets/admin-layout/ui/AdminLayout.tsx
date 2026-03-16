
import { removeToken } from '@/shared/lib/auth'
import styles from './AdminLayout.module.css'
import { NavLink, Outlet, useNavigate } from 'react-router'

export const AdminLayout = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    removeToken()
    navigate('/admin/login')
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>Админка</div>

        <nav className={styles.nav}>
          <NavLink to="/admin/stands">Точки</NavLink>
          <NavLink to="/admin/stands/new">Добавить точку</NavLink>
        </nav>

        <button className="buttonSecondary" type="button" onClick={handleLogout}>
          Выйти
        </button>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}