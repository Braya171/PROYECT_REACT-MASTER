
function Navbar(){
    
      <Navbar expand="lg" variant="dark" className="dashboard-navbar">
        <Container>
          <Navbar.Brand onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <img
              src={logo}
              alt="taller Logo"
              height="40"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown title="Personas" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => navigate('/clientes')}>
                  Clientes
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate('/auxiliares')}>
                  Auxiliares
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link onClick={() => navigate('/servicios')}>Servicios</Nav.Link>
              <Nav.Link onClick={() => navigate('/cronograma')}>Cronograma</Nav.Link>
              <Nav.Link onClick={() => navigate('/opcion1')}>Opción 1</Nav.Link>
              <Nav.Link onClick={() => navigate('/opcion2')}>Opción 2</Nav.Link>
              <Nav.Item className="logout-container" onClick={handleLogout}>
                <Nav.Link className="logout-link d-flex align-items-center gap-2">
                  <FaSignOutAlt /> Cerrar Sesión
                  <img
                    src={userPhoto}
                    alt="Foto de usuario"
                    className="user-photo-nav"
                  />
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
};

export default Navbar;