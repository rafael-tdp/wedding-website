import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex gap-6">
          <li>
            <Link href="/">Accueil</Link>
          </li>
          <li>
            <Link href="/infos">Infos</Link>
          </li>
          <li>
            <Link href="/rsvp">RSVP</Link>
          </li>
          <li>
            <Link href="/gallery">Galerie</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
