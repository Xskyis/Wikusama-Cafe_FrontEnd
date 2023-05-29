import { useState, useEffect } from "react";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle";
import axios from "axios";

const baseURL = `http://localhost:8080`
const header = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}

const User = () => {
    const [id_user, setIdUser] = useState(0)
    const [nama_user, setNamaUser] = useState("")
    const [role, setRole] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isEdit, setIsEdit] = useState(true)
    const [modal, setModal] = useState(null)
    const [user, setUser] = useState([])

    const [showPassword, setShowPassword] = useState(false)

    const getUser = () => {
        const url = `${baseURL}/user`
        axios.get(url, header)
            .then(response => {
                setUser(response.data.data)
            })
            .catch(error => console.log(error))
    }

    const addUser = () => {
        setIdUser(0)
        setNamaUser("")
        setUsername("")
        setPassword("")
        setRole("")
        setIsEdit(false)
        modal.show()
    }

    const editUser = item => {
        setIdUser(item.id_user)
        setNamaUser(item.nama_user)
        setUsername(item.username)
        setPassword(item.password)
        setRole(item.role)
        setIsEdit(true)
        modal.show()
    }

    const saveUser = event => {
        event.preventDefault()
        let payload = { nama_user, role, username, password }
        if (isEdit) {
            // proses edit user
            let url = `${baseURL}/user/${id_user}`
            axios.put(url, payload, header)
                .then(response => {
                    window.alert(`Data user berhasil diubah!`)
                    // recall user
                    getUser()
                })
                .catch(error => console.log(error))
        } else {
            // proses insert user
            let url = `${baseURL}/user`
            axios.post(url, payload, header)
                .then(response => {
                    window.alert(`Data user berhasil ditambahkan!`)
                    // recall user
                    getUser()
                }
                )
        }
        modal.hide()
    }

    const deleteUser = id_user => {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini?")) {
            let url = `${baseURL}/user/${id_user}`
            axios.delete(url, header)
                .then(response => {
                    window.alert(`Data user berhasil dihapus!`)
                    // recall user
                    getUser()
                })
                .catch(error => console.log(error))
        }
    }

    useEffect(() => {
        let modalElement = document.getElementById('modal-user')
        let modal = new Modal(modalElement)
        setModal(modal)
        getUser()
    }, [])

    return (
        <>
            <div className="container-fluid w-100 p-3">
                <div className="row">
                    <div className="col-12">
                        <h3 className="text-left fw-normal text-secondary">DATA USER</h3>
                        <button className="btn btn-sm btn-dark mb-2" onClick={addUser}>Tambah User</button>
                        <ul className="list-group">
                            {user.map((item, index) => (
                                <li className="list-group-item" key={index}>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <small className="text-danger">
                                                Nama User
                                            </small><br />
                                            {item.nama_user}
                                        </div>

                                        <div className="col-md-2">
                                            <small className="text-danger">
                                                Role
                                            </small><br />
                                            {item.role}
                                        </div>

                                        <div className="col-md-2">
                                            <small className="text-danger">
                                                Username
                                            </small><br />
                                            {item.username}
                                        </div>

                                        <div className="col-md-4">
                                            <small className="text-danger">
                                                Password
                                            </small><br />
                                            {item.password}
                                        </div>

                                        <div className="col-md-2">
                                            <small className="text-danger">
                                                Aksi
                                            </small><br />
                                            <button className="btn btn-sm btn-dark me-2" onClick={() => editUser(item)}>
                                                <i className="bi bi-pencil">
                                                </i>
                                            </button>
                                            <button className="btn btn-sm btn-danger" onClick={() => deleteUser(item.id_user)}>
                                                <i className="bi bi-trash">
                                                </i>
                                            </button>
                                        </div>

                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="modal fade" id="modal-user">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-tittle">Form User</h5>
                                <button className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={saveUser}>
                                    <div className="mb-2">
                                        <label className="form-label">Nama User</label>
                                        <input type="text" className="form-control" value={nama_user} onChange={event => setNamaUser(event.target.value)} required />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label">Role</label>
                                        <select
                                            required={true}
                                            className="form-control mb-2"
                                            value={role}
                                            onChange={e => setRole(e.target.value)}
                                        >
                                            <option value="">--Pilih Role--</option>
                                            <option value="admin">Admin</option>
                                            <option value="kasir">Kasir</option>
                                            <option value="manajer">manajer</option>
                                        </select>
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label">Username</label>
                                        <input type="text" className="form-control" value={username} onChange={event => setUsername(event.target.value)} required />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label">Password</label>
                                        <input type={showPassword ? "text" : "password"} className="form-control" value={password} onChange={event => setPassword(event.target.value)} required />
                                    </div>
                                    <div className="mb-2">
                                        <button className="btn btn-primary me-2">Simpan</button>
                                        <button className="btn btn-danger" data-bs-dismiss="modal">Batal</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )


}

export default User