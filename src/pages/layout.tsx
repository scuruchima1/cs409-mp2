import { Outlet, Link } from "react-router-dom";
import "./layout.css";

function Layout() {
  return (
    <div className="layout-container">
      <header className="header">
        <h1 className="pokedex-title">The Pokédex</h1>
        <nav>
          <Link to="/search">Search</Link>
          <Link to="/gallery">Gallery</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;