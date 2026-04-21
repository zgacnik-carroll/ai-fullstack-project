import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './NavBar.module.css'

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>Wildlife Sightings</Link>
      <Link to="/sightings/new" className={styles.addLink}>+ Log Sighting</Link>
    </nav>
  )
}

NavBar.propTypes = {}
