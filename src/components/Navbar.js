import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './NavbarStyle.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Navigasi = ({ handleSidebarToggle }) => {
  const isLoginPage = window.location.pathname === '/login';
  // Use the useMediaQuery hook to detect the screen size
  const isMobileSize = useMediaQuery({ maxWidth: 767 });

  // Check if the user data exists in local storage
  const userData = JSON.parse(localStorage.getItem('user'));
  const role = userData?.role || 'guest';

  if (isLoginPage) {
    return null;
  }

  const handleLogout = () => {
    if (window.confirm(`Apakah Anda Ingin Logout ?`)) {
      /** remove data user & token di localstorage */
      localStorage.removeItem(`token`);
      localStorage.removeItem(`user`);

      /** show toast promise */
      toast.promise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        }),
        {
          pending: 'Signed Out...',
          success: 'Logout success!',
          error: 'Logout failed!',
        }
      )

      /** jeda 2 detik */
      setTimeout(() => {
        window.location.href = "/login";
      }, 2600);
    }
  };

  return (
    <Navbar className='navbar shadow-xl fixed-top' variant='dark' expand="lg">
      <Container>
        <Navbar.Brand className='me-auto fw-semibold' href="/home">
          <span className='fw-bold'>WIKUSAMA</span>
          <span className='fw-bolder fst-italic text-dark'>CAFE</span>  ☕
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Conditionally render the Link component for mobile size only */}
            {isMobileSize && (
              <>
                <Link className={`w-100 p-3 text-start text-white text-decoration-none h6 ${['admin', 'kasir', 'manajer'].includes(role) ? 'd-block' : 'd-none'}`} to="/home">
                  <i className="bi bi-house me-2"></i>
                  Dashboard
                </Link>

                <Link className={`w-100 p-3 text-start text-white text-decoration-none h6 ${['admin'].includes(role) ? 'd-block' : 'd-none'}`} to="/menu">
                  <i className="bi bi-list-task me-2"></i>
                  Menu
                </Link>

                <Link className={`w-100 p-3 text-start text-white text-decoration-none h6 ${['admin'].includes(role) ? 'd-block' : 'd-none'}`} to="/user">
                  <i className="bi bi-person me-2"></i>
                  User
                </Link>

                <Link className={`w-100 p-3 text-start text-white text-decoration-none h6 ${['admin', 'kasir'].includes(role) ? 'd-block' : 'd-none'}`} to="/meja">
                  <i className="bi bi-plus-square me-2"></i>
                  Meja
                </Link>

                <Link className={`w-100 p-3 text-start text-white text-decoration-none h6 ${['kasir', 'manajer', 'admin'].includes(role) ? 'd-block' : 'd-none'}`} to="/transaksi">
                  <i className="bi bi-receipt me-2"></i>
                  Transaksi
                </Link>
              </>
            )}
          </Nav>
          <Nav className='ms-auto'>
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-basic" >
                Login as <i className="bi bi-person"></i> <b>{userData?.nama_user || 'Guest'}</b>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item><i className="bi bi-person-badge-fill"></i> Position: <b>{role}</b>  </Dropdown.Item>
                <Dropdown.Item onClick={() => handleLogout()}> <i className="bi bi-box-arrow-in-right"></i> Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <ToastContainer />
    </Navbar>
  );
};

export default Navigasi;
