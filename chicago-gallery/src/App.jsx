import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ArtworkDetail from "./pages/ArtworkDetail";
import Sobre from "./pages/sobre";
import Portfolio3D from "./pages/Portfolio3D";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-shrink-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artwork/:id" element={<ArtworkDetail />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/portfolio" element={<Portfolio3D />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
