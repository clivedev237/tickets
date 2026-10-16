export default function Footer() {
  return (
    <footer className="pied-de-page">
      <div className="conteneur pied-contenu">
        <p>
          © {new Date().getFullYear()} — Suivi des tickets
        </p>
      </div>
    </footer>
  );
}
