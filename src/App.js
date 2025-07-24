import "./App.css";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/Login";
{/* import { AuthProvider } from "./context/AuthContext"; */}

function App() {
  return (
    /*<AuthProvider>*/
      <div className="App">
        <header className="App-header">
          <Navbar />
        </header>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
       
        <Footer />
      </div>
    /*</AuthProvider>*/
  );
}

export default App;
