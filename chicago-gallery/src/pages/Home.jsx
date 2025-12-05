import { useState, useEffect } from "react";
import ArtworkCard from "../components/ArtworkCard";
// TODO: Pesquisar tudo e nao apenas na pagina atual
// TODO: Fazer com que apresente sempre 12 peças

function Home() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Guardar o texto que o utilizador escreve
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1); // Começamos na página 1
  const [totalPages, setTotalPages] = useState(0); // O total que a API nos vai dizer

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    // guardar coleção arte por pagina para apresentar varias obras (por pagina)
    fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=12`)
      .then((response) => response.json())
      .then((data) => {
        // // Filtrar para garantir que só mostra obras com imagem
        // const obrasComImagem = data.data.filter(
        //   (obra) => obra.image_id != null
        // );

        setArtworks(data.data);

        // Guarda o numero de pagina que a API indica
        setTotalPages(data.pagination.total_pages);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar: ", error);
        setLoading(false);
      });
  }, [page]); // O useEffect corre sempre que o page muda

  const filteredArtworks = artworks.filter((artwork) =>
    artwork.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funções para mudar de página
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">A carregar...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="text-center mb-5">
        <h1 className="mb-3">Galeria de Arte de Chicago</h1>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control form-control-lg shadow-sm"
              placeholder="Pesquisar nesta página..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredArtworks.length === 0 ? (
        <div className="text-center mt-5 text-muted">
          <h3>Nenhuma obra encontrada nesta página. 🎨</h3>
        </div>
      ) : (
        <div className="row">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}

      {/* 4. CONTROLOS DE PAGINAÇÃO (BOTOES) */}
      <div className="d-flex justify-content-center align-items-center mt-5 gap-3">
        <button
          className="btn btn-outline-dark"
          onClick={handlePrevPage}
          disabled={page === 1} // Desativa se estiver na 1ª página
        >
          &larr; Anterior
        </button>

        <span className="fw-bold">
          Página {page} de {totalPages}
        </span>

        <button
          className="btn btn-outline-dark"
          onClick={handleNextPage}
          disabled={page === totalPages} // Desativa se for a última página
        >
          Seguinte &rarr;
        </button>
      </div>
    </div>
  );
}

export default Home;
