import Link from 'next/link'

export default function Home() {
  return (
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
  )
}