import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ArtworkDetail from "./pages/ArtworkDetail";
import Sobre from "./pages/sobre";
import Portfolio3D from "./pages/Portfolio3D";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artwork/:id" element={<ArtworkDetail />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/portfolio" element={<Portfolio3D />} />
      </Routes>
    </>
  );
}

export default App;
