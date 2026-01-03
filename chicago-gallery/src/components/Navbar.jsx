import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true); // Começa fechada

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          🏛️ Chicago Art
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleNavCollapse}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`${isNavCollapsed ? "collapse" : "collapse show"} navbar-collapse`} id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
                onClick={() => setIsNavCollapsed(true)}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/sobre"
                onClick={() => setIsNavCollapsed(true)}
              >
                Sobre
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/portfolio"
                onClick={() => setIsNavCollapsed(true)}
              >
                Portfólio 3D 🧊
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
