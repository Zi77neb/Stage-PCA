import Sidebar from "../Sidebar";
import "../../styles/Layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout">

      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <main className="layout-content">
        {children}
      </main>

    </div>
  );
}