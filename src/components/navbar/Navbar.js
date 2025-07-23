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
              src="./APP_Delivery.png"
              alt="AppDelivery Logo"
              className={styles.logoImage}
            />
          </Link>
        </div>
        {/*
        <ul className={styles.menuItems}>
          <li>
            <Link to="/cardapio" className={styles.navLink}>
              Cardápio
            </Link>
          </li>
        </ul>*/}
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

        <Link to="/carrinho" className={styles.cartLink}>
          <i className={`fas fa-shopping-cart ${styles.cartIcon}`}></i>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
