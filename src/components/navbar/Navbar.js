import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useState } from "react";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Pesquisar por:", searchTerm);
  };

  const handleLoginClick = () => {
    navigate("/Login");
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navbarContent}>
        <div className={styles.logo}>
          <Link to="/">
            <img
              src="./logoDelivery.png"
              alt="AppDelivery Logo"
              className={styles.logoImage}
            />
          </Link>
        </div>
        <div className={styles.rightSection}>
          <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Buscar
              <i className="fas fa-search"></i>
            </button>
          </form>
          <button
            type="button"
            className={styles.userIconButton}
            onClick={handleLoginClick}
          >
            <img
              src="./userLogo.png"
              alt="Login"
              className={styles.userImage}
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;