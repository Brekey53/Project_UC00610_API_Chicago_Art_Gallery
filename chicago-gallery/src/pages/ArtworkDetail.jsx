import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ArtworkDetail(){
    const { id } = useParams(); // Captura o ID que vem do URL
    const [artwork, setArtworks] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Para dar Scroll para o topo ao clicar na imagem
        window.scrollTo(0, 0);

        // Fetch detalhes da obra
        fetch(`https://api.artic.edu/api/v1/artworks/${id}`).then((res) => res.json()).then((data) => {
            setArtworks(data.data);
            setLoading(false);
        }).catch((error) => {
            console.error("Erro: ", error);
            setLoading(false);
        });
    }, [id]);

    if (loading){
        return <div className="container mt-5 text-center">A carregar detalhes...</div>;
    }

    if (!artwork) {
        return <div className="container mt-5">Obra não encontrada.</div>;
    }
    
    const imageUrl = artwork.image_id
    ? `/api-artic/${artwork.image_id}/full/843,/0/default.jpg`
    : "https://via.placeholder.com/843x600?text=Sem+Imagem";

    return (
    <div className="container mt-5 mb-5">
      {/* Botão Voltar */}
      <Link to="/" className="btn btn-outline-secondary mb-4">
        &larr; Voltar à Galeria
      </Link>

      <div className="row">
        {/* Coluna da Imagem */}
        <div className="col-lg-6 mb-4">
          <img
            src={imageUrl}
            className="img-fluid rounded shadow"
            alt={artwork.title}
            style={{ minHeight: "300px", objectFit: "contain", width: "100%" }}
          />
        </div>

        {/* Coluna dos Textos */}
        <div className="col-lg-6">
          <h1 className="display-5 mb-3">{artwork.title}</h1>
          <h4 className="text-muted mb-3">{artwork.artist_display}</h4>

          <div className="p-3 bg-light rounded mb-4">
            <p className="mb-1"><strong>Data:</strong> {artwork.date_display}</p>
            <p className="mb-1"><strong>Dimensões:</strong> {artwork.dimensions}</p>
            <p className="mb-0"><strong>Tipo:</strong> {artwork.artwork_type_title}</p>
          </div>

          {/* Descrição (se existir) */}
          {artwork.description && (
            <div dangerouslySetInnerHTML={{ __html: artwork.description }} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtworkDetail;