import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import './sidebarStyle.css'

const Sidebar = ({ title, children }) => {
    const [username, setUsername] = useState("")
    const [role, setRole] = useState("")

    useEffect(() => {
        let data = JSON.parse(localStorage.getItem('user'))
        setUsername(data.nama_user)
        setRole(data?.role)
    }, [])

    return (
        <div className="container-fluid">
            <div className="row nowrap">

                <div className="sidebar col-2 vh-100 sticky-top" style={{ backgroundColor: `#20262E` }}>

                    <div className="d-flex justify-content-center my-5 pt-5 bg-dark shadow-white rounded p-2">
                        <h4 className="text-white">Selamat datang, {role} <span class="badge bg-light text-black">{username}</span> !😃</h4>
                    </div>

                    <div className="w-100 p-2 d-flex flex-column">

                        <Link className={`w-100 p-3 text-start text-white text-decoration-none h6 ${['admin', 'kasir', 'manajer'].includes(role) ? 'd-block' : 'd-none'}`} to="/home">
                            <i className="bi bi-house me-2"></i>
                            Home
                        </Link>

                        <Link className={`w-100 p-3 text-start text-white text-decoration-none h6 ${['admin'].includes(role) ? 'd-block' : 'd-none'}`} to="/menu">
                            <i className="bi bi-list-task me-2"></i>
                            Menu
                        </Link>

                        <Link className={`w-100 p-3 text-start text-white text-decoration-none h6 ${['admin'].includes(role) ? 'd-block' : 'd-none'}`} to="/user">
                            <i className="bi bi-person me-2"></i>
                            User
                        </Link>

                        <Link className={`w-100 p-3 text-start text-white text-decoration-none h6 ${['admin','kasir'].includes(role) ? 'd-block' : 'd-none'}`} to="/meja">
                            <i className="bi bi-plus-square me-2"></i>
                            Meja
                        </Link>

                        <Link className={`w-100 p-3 text-start text-white text-decoration-none h6 ${['kasir', 'manajer', 'admin'].includes(role) ? 'd-block' : 'd-none'}`} to="/transaksi">
                            <i className="bi bi-receipt me-2"></i>
                            Transaksi
                        </Link>

                    </div>
                </div>

                <div className="col min-vh-100 p-0">
                    <div className="w-auto">
                        {children}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Sidebar