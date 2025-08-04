import React from "react";
import { Link } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { FaBoxes, FaPlusCircle } from "react-icons/fa";

function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sideBar}>
        <h3 className={styles.title}>Painel de Admin</h3>
        <nav>
          <ul>
            <li className={styles.listItem}>
              <Link to="/Dashboard/CadastroCategoria" className={styles.link}>
                <FaPlusCircle className={styles.icon} />
                Cadastrar Categorias
              </Link>
            </li>
            <li className={styles.listItem}>
              <Link to="/Dashboard/CadastroProduto" className={styles.link}>
                <FaBoxes className={styles.icon} />
                Cadastrar Produtos
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <section className={styles.content}></section>
    </div>
  );
}

export default Dashboard;