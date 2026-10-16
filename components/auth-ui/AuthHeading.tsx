import styles from './AuthUI.module.css';
export default function AuthHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className={styles.heading}>
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
    </header>
  );
}
