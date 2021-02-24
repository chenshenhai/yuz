import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <div className={'theme-color'}>theme-color</div>
      <ul>
        <li>
          <Link href="/foo">
            <a>/foo</a>
          </Link>
        </li>
        <li>
          <Link href="/bar">
            <a>/bar</a>
          </Link>
        </li>
      </ul>
    </div>
  )
}