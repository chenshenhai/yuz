import Hello from '../../component/hello';
import css from './index.module.css';

export default function Page() {
  return (<div className="box">
    <h2 className={css.foo}>Foo</h2>
    <Hello></Hello>
  </div>)
}