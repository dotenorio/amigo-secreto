import styles from '../styles/Title.module.css'

const Title = ({
  title,
  description,
}) => (
  <>
    <h1 className={styles.title}>
      {title}
    </h1>

    <p className={styles.description}>
      {description}
    </p>
  </>
)

export default Title;