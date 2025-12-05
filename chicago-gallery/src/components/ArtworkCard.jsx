import { Link } from "react-router-dom";

function ArtworkCard({ artwork }) {
  const imageUrl = `/api-artic/${artwork.image_id}/full/400,/0/default.jpg`;

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm border-0">
        <img
          src={imageUrl}
          className="card-img-top"
          alt={artwork.title}
          style={{ height: "250px", objectFit: "fill" }}
        />

        <div className="card-body d-flex flex-column text-start">
          <h5 className="card-title fw-bold">{artwork.title}</h5>
          <p className="card-text text-muted small">{artwork.artist_display}</p>

          <Link
            to={`/artwork/${artwork.id}`}
            className="btn btn-dark mt-auto w-100"
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ArtworkCard;
