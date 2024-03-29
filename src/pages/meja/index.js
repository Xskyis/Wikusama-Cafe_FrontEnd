import { useState, useEffect } from "react";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseURL = `http://localhost:8080`
const header = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}

const Meja = () => {
    const [id_meja, setIdMeja] = useState(0)
    const [nomor_meja, setNomorMeja] = useState("")
    const [status, setStatus] = useState(true)
    const [isEdit, setIsEdit] = useState(true)
    const [modal, setModal] = useState(null)
    const [meja, setMeja] = useState([])

    const getMeja = () => {
        const url = `${baseURL}/meja`
        axios.get(url, header)
            .then(response => {
                setMeja(response.data.data)
            })
            .catch(error => console.log(error))
    }

    const addMeja = () => {
        setIdMeja(0)
        setNomorMeja("")
        setStatus(true)
        setIsEdit(false)
        modal.show()
    }

    const editMeja = item => {
        setIdMeja(item.id_meja)
        setNomorMeja(item.nomor_meja)
        setStatus(item.status)
        setIsEdit(true)
        modal.show()
    }

    const saveMeja = event => {
        event.preventDefault()
        modal.hide()
        let payload = { id_meja, nomor_meja, status }
        if (isEdit) {
            // proses edit
            let url = `${baseURL}/meja/${id_meja}`
            axios.put(url, payload, header)
                .then(response => {
                    toast.success(`Data meja berhasil diubah!`)
                    // recall meja
                    getMeja()
                })
                .catch(error => console.log(error))
        } else {
            // proses insert
            let url = `${baseURL}/meja`
            axios.post(url, payload, header)
                .then(response => {
                    toast.success(`Data meja berhasil ditambahkan!`)
                    // recall meja
                    getMeja()
                })
                .catch(error => console.log(error))
        }
    }

    const dropMeja = (item) => {
        if (window.confirm(`Apakah anda yakin ingin menghapus meja ${item.nomor_meja} ?`)) {
            const url = `${baseURL}/meja/${item.id_meja}`
            axios.delete(url, header)
                .then(response => {
                    toast.success(`Meja ${item.nomor_meja} berhasil dihapus!`)
                    //recall meja
                    getMeja()
                })
                .catch(error => console.log(error))
        }
    }

    useEffect(() => {
        getMeja()
        setModal(new Modal(`#modal-meja`))
    }, [])

    return (
        <div className="container-fluid p-16 w-100">
            <h3 className="text-secondary fw-normal mb-1">DAFTAR MEJA</h3>
            <button className="btn btn-sm btn-dark mb-2" onClick={() => addMeja()}>
                <i className="bi bi-plus-circle"></i> Meja
            </button>
            <ul className="list-group">
                {meja.map(table => (
                    <li className="list-group-item rounded-lg mb-2 shadow-lg"
                        key={`keyMeja${table.id_meja}`}>
                        <div className="row">
                            <div className="col-md-4">
                                <small className="text-danger">
                                    Nomor Meja
                                </small> <br />
                                {table.nomor_meja}
                            </div>

                            <div className="col-md-4">
                                <small className="text-danger">
                                    Status
                                </small> <br />
                                <span className={`badge ${table.status ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {table.status ? 'Available' : 'In use'}
                                </span>
                            </div>

                            <div className="col-md-4">
                                <small className="text-danger">
                                    Action
                                </small> <br />
                                <button className="btn btn-sm btn-dark me-2" onClick={() => editMeja(table)}>
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => dropMeja(table)}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>

                        </div>
                    </li>
                ))}
            </ul>

            {/** modal meja */}
            <div className="modal fade" id="modal-meja">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <form onSubmit={saveMeja}>
                            <div className="modal-header bg-red-800 text-white">
                                <h4 className="modal-tittle">
                                    Form Meja
                                </h4>
                            </div>

                            <div className="modal-body">
                                <small>Nomor Meja</small>
                                <input type="text" className="form-control mb-2" value={nomor_meja} onChange={e => setNomorMeja(e.target.value)} />

                                <small>status</small>
                                <select className="form-control mb-2"
                                    value={status}
                                    onChange={e => setStatus(e.target.value)}
                                >
                                    <option value="">Pilih Status</option>
                                    <option value={true} className="text-green-500">Available</option>
                                    <option value={false}>In use</option>
                                </select>

                                <button type="submit" className="btn btn-dark w-100">
                                    Simpan
                                </button>


                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )


}

export default Meja