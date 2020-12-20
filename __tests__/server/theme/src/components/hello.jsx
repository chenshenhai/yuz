import css from './hello.module.scss';

export default function Hello() {
  return (
    <div className={css.hello}>
      Hello Component!
    </div>
  )
}