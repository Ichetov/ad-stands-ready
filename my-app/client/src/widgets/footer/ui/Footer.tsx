import styles from './Footer.module.css'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <div>AdStands</div>
          <div>Телефон: +371 20000000</div>
          <div>Email: info@adstands.local</div>
        </div>
      </div>
    </footer>
  )
}