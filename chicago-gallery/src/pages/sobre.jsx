import React from "react";

function Sobre() {
  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <h1 className="display-5 fw-bold mb-4 text-center">
                Sobre o Projeto
              </h1>

              <p className="lead text-center mb-5">
                Uma interface moderna para explorar a coleção digital do
                <span className="fw-bold text-primary">
                  {" "}
                  Art Institute of Chicago
                </span>
                .
              </p>

              <h4 className="mb-3">Objetivo:</h4>
              <p className="text-muted mb-4">
                Este projeto foi desenvolvido para demonstrar o consumo de APIs
                externas, paginação, pesquisa dinâmica e roteamento em uma
                aplicação React (SPA).
              </p>

              <h4 className="mb-3">Tecnologias usadas:</h4>
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item">
                  <strong>React + Vite</strong> - Para performance e
                  componentização.
                </li>
                <li className="list-group-item">
                  <strong>Bootstrap 5</strong> - Para estilização responsiva.
                </li>
                <li className="list-group-item">
                  <strong>React Router</strong> - Para navegação entre
                  páginas.
                </li>
                <li className="list-group-item">
                  <strong>Art Institute of Chicago API</strong> - Fonte dos
                  dados. (<a href="https://api.artic.edu/docs/" target="_blank">https://api.artic.edu/docs/</a>)
                </li>
              </ul>

              <div className="text-center mt-5">
                <p className="small text-muted">
                  Desenvolvido no âmbito da UC00610.<br/>
                  Formando: André Correia <a href="https://github.com/Brekey53?tab=repositories" target="_blank"><strong>GitHub</strong></a><br/>
                  Formador: Nelson Santos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sobre;
