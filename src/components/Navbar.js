import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './NavbarStyle.css'

function BasicExample() {
  const isLoginPage = window.location.pathname === '/login';

  if (isLoginPage) {

    return null;
  }
  return (
    <Navbar className='navbar' variant='dark' expand="lg">
      <Container>
        <Navbar.Brand className='me-auto fw-semibold' href="/home"><span className='fw-bold'>WIKUSAMA</span> <span className='fw-bolder fst-italic text-dark'>CAFE</span>☕</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/menu">Menu</Nav.Link>
            <Nav.Link href="/">Meja</Nav.Link>
            <Nav.Link href="/transaksi">Transaksi</Nav.Link>
          </Nav>
          <Nav className='ms-auto'>
            <button className="btn btn-dark" >Logout</button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;