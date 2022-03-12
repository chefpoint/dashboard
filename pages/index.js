import Link from 'next/link';

export default function Kiosk() {
  return (
    <div>
      <Link href='/pos'>
        <a>Point of Sale</a>
      </Link>
      <br />
      <br />
      <Link href='/dashboard'>
        <a>Dashboard</a>
      </Link>
    </div>
  );
}
