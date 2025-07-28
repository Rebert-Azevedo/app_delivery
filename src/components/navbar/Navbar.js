import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuthHook";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Pesquisar por:", searchTerm);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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
            {/*<FaSearch className={styles.searchIcon}/>*/}
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

          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
