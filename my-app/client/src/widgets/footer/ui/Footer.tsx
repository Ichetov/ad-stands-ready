import styles from './Footer.module.css'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <div>AdStands</div>
          <div>  Телефон:{' '}
  <a href="tel:+37120000000">
    +371 20000000
  </a></div>
          <div> Email:{' '}
  <a href="mailto:info@adstands.local">
    info@adstands.local
  </a></div>
        </div>
      </div>
    </footer>
  )
}