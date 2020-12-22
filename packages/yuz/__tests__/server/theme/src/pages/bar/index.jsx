import Hello from '../../components/hello';
import css from './index.module.scss';

export default function Page() {
  return (<div className="box">
    <h2 className={css.bar}>Bar</h2>
    <Hello></Hello>
  </div>)
}