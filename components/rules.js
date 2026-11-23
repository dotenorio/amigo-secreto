import styles from '../styles/Rules.module.css'

// Espaços inquebráveis: "R$" nunca fica numa linha e o valor na outra.
export const PRICE_RANGE = 'de R$ 70 a R$ 100'

const Rules = () => (
  <section className={styles.rules} aria-label='Como funciona'>
    <h2>🎁 Como funciona</h2>
    <ul>
      <li>O presente deve custar <b>{PRICE_RANGE}</b>.</li>
      <li>Cadastre <b>2 opções</b> do que você gostaria de ganhar (com link, se tiver).</li>
      <li>Quem tirou você vai ver suas opções e dar uma delas.</li>
    </ul>
  </section>
)

export default Rules
