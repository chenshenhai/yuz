import css from './hello.module.css';

export default function Hello() {
  return (
    <div className={css.hello}>
      Hello Component!
    </div>
  )
}