import { useState, useEffect } from "react";
import ArtworkCard from "../components/ArtworkCard";


function Home() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Usado para o Debounce, esta será para o que o utilizador vê na caixa de pesquisa
  const [inputValue, setInputValue] = useState("");
  
  // Guardar o texto que o utilizador escreve para pequisar na API
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1); // Começar na página 1
  const [totalPages, setTotalPages] = useState(0);
  const [goToPageInput, setGoToPageInput] = useState("");

  useEffect(() => {
    // Cria um temporizador de 1000ms (1 segundo) para o efeito Debounce
    const timeoutId = setTimeout(() => {
      setSearchTerm(inputValue); // Atualiza o termo real
      setPage(1); // Volta à página 1 quando a pesquisa muda
    }, 1000);

    return () => clearTimeout(timeoutId); // função para dar reset do timeout sempre que o user escreve algo novo em menos de 1s
  }, [inputValue]);


 useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    // logica para pesquisar em toda a coleção e não apenas na pagina atual
    let url;

    if (searchTerm.trim() === ""){
      // pesquisa normal caso esteja vazio
      url = `https://api.artic.edu/api/v1/artworks?page=${page}&limit=12&fields=id,title,image_id,artist_display`;
    } else {
      // pesquisa com o termo, ja existe uma vertente da API para resolver este problema
      // Dentro da documentação encontrei que searchTearm entra dentro de uma query da API, pesquisando assim tudo o que contem a palavra pesquisada, pode ser titlo, descrição, autor, .... (Elasticsearch)
      // Tambem dentro do parametro da API /artworks/search, a API da sort das obras por score das próprias, fazendo com que apareça as melhores pontuadas em primeiro lugar, o que não acontece no URL a cima
      // outra diferença é a utilização dos fiels apos o searchTerm, pois caso não se especifique, apenas vai buscar a informação basica da obra, assim obrigamos a ir buscar o que necessitamos. (Hydration (fields))
      url = `https://api.artic.edu/api/v1/artworks/search?q=${searchTerm}&page=${page}&limit=12&fields=id,title,image_id,artist_display`;
    }
    // guardar coleção arte por pagina para apresentar varias obras (por pagina)
    fetch(url)
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
  }, [page, searchTerm]); // O useEffect corre sempre que o page muda E sempre que a searchTerm muda

  

  // Funções para mudar de página
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleManualPage = (e) => {
    e.preventDefault(); // Impede a página de recarregar

    // Converter texto para número
    const pageNumber = parseInt(goToPageInput);

    // Validação: Só muda se for um número válido dentro dos limites
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
      setGoToPageInput(""); // Limpa o input depois de ir
    } else {
      alert(`Por favor insira um número entre 1 e ${totalPages}`);
    }
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
              placeholder="Comece a escrever para pesquisar (ex: Monet)..."
              value={inputValue} 
              // Atualiza o visual instantaneamente, o debounce trata do resto
              onChange={(e) => setInputValue(e.target.value)} 
            />
            <small className="text-muted">
              {inputValue !== searchTerm ? "A aguardar que termine de escrever..." : " "}
            </small>
          </div>
        </div>
      </div>

      {artworks.length === 0 ? (
        <div className="text-center mt-5 text-muted">
          <h3>Nenhuma obra encontrada. 🎨</h3>
        </div>
      ) : (
        <div className="row">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}

      {artworks.length > 0 && (
        <div className="d-flex justify-content-center align-items-center mt-5 gap-3 flex-wrap">
          
          <button className="btn btn-outline-dark" itemID="ButaoAntes" onClick={handlePrevPage} disabled={page === 1}>
            &larr; Anterior
          </button>
          
          <span className="fw-bold">Página {page} de {totalPages}</span>
          
          <button className="btn btn-outline-dark" itemID="ButaoDepois" onClick={handleNextPage} disabled={page === totalPages}>
            Seguinte &rarr;
          </button>

          <form onSubmit={handleManualPage} className="d-flex align-items-center gap-2 ms-3">
            <label className="text-muted small">Ir para:</label>
            <input
              type="number"
              className="form-control form-control-sm text-center"
              style={{ width: "70px" }}
              placeholder="#"
              value={goToPageInput} 
              onChange={(e) => setGoToPageInput(e.target.value)} 
            />
            <button type="submit" className="btn btn-sm btn-dark">
              Ir
            </button>
          </form>

        </div>
      )}
    </div>
  );
}

export default Home;