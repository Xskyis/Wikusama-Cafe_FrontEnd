import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './NavbarStyle.css'
import Dropdown from 'react-bootstrap/Dropdown';

const Navigasi = ({ handleSidebarToggle }) => {
  const isLoginPage = window.location.pathname === '/login';


  if (isLoginPage) {

    return null;
  }

  const handleLogout = () => {
    if (window.confirm(`Apakah Anda Ingin Logout ?`)) {
      localStorage.removeItem(`token`)
      localStorage.removeItem(`user`)
      /** return to login */
      window.location.href = "/login"
    }
  }

  return (
    <Navbar className='navbar' variant='dark' expand="lg">
      <Container>
        <Navbar.Brand className='me-auto fw-semibold' href="/home"><span className='fw-bold'>WIKUSAMA</span><span className='fw-bolder fst-italic text-dark'>CAFE</span>☕</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/** display react-clock */}
          </Nav>
          <Nav className='ms-auto'>
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-basic" >
                Login as <i class="bi bi-person"></i> <b>{JSON.parse(localStorage.getItem('user')).nama_user}</b>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleLogout()}> <i class="bi bi-box-arrow-in-right"></i> <b className='text-dark'>LogOut</b></Dropdown.Item>
                <Dropdown.Item><i class="bi bi-person-badge-fill"></i> Position: <b>{JSON.parse(localStorage.getItem('user')).role}</b>  </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigasi;