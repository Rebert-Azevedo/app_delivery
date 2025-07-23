import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useState } from "react";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Pesquisar por:", searchTerm);
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
          <Link to="/login" className={styles.userIconButton}>
            <img
              src="./userLogo.png"
              alt="Login"
              className={styles.userImage}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
