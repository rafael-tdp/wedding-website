export default function Header() {
  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex gap-6">
          <li>
            <a href="/">Accueil</a>
          </li>
          <li>
            <a href="/infos">Infos</a>
          </li>
          <li>
            <a href="/rsvp">RSVP</a>
          </li>
          <li>
            <a href="/gallery">Galerie</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
