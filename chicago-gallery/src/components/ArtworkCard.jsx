import { Link } from "react-router-dom";
import "../style/ArtworkCard.css"

function ArtworkCard({ artwork }) {
  const imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/400,/0/default.jpg`;

  return (
    <div className="col-md-4 mb-4" >
      <Link to={`/artwork/${artwork.id}`} id="cardArtwordDetail">
      <div className="card h-100 shadow-sm border-0" id="artInPage">
        <img
          src={imageUrl}
          className="card-img-top"
          alt={artwork.title}
          style={{ height: "250px", objectFit: "scale-down" }}
        />

          <div className="card-body d-flex flex-column text-start">
            <h5 className="card-title fw-bold">{artwork.title}</h5>
            <p className="card-text text-muted small">{artwork.artist_display}</p>

            <button className="btn btn-dark mt-auto w-100">Ver Detalhes</button>

          </div>
        </div>
      </Link>
    </div>
  );
}

export default ArtworkCard;
