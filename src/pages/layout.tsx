import { Outlet, Link } from "react-router-dom";
import "./layout.css";

function Layout() {
  return (
    <div className="layout-container">
      <header className="header">
        <h1 className="pokedex-title">The Pokédex</h1>
        <div className="header-links">
            <nav>
            <Link to="/search" className="links">Search</Link>
            <Link to="/gallery" className="links">Gallery</Link>
            </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;