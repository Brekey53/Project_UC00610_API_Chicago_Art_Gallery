import React from 'react';

function Footer() {
  return (
    <footer className="footer navbar-dark bg-dark mt-auto py-3">
      <div className="container text-center">
        <span className="text-white">© {new Date().getFullYear()} Chicago Art Gallery. All Rights Reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;