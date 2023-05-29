/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import './transaksiStyle.css'

const baseURL = "http://localhost:8080";

const header = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}

const transaksi = () => {
    const [transaksi, setTransaksi] = useState([])
    const [menu, setMenu] = useState([])
    const [meja, setMeja] = useState([])

    /** grab data user from localStorage after login */
    const USER = JSON.parse(
        localStorage.getItem('user')
    )

    const [id_user, setIdUser] = useState(
        USER.id_user
    )
    const [tgl_transaksi, setTglTransaksi] = useState("")
    const [nama_pelanggan, setNamaPelanggan] = useState("")
    const [id_meja, setIdMeja] = useState("")

    const [search, setSearch] = useState("")
    const [role, setRole] = useState("")


    const [detail_transaksi, setDetailTransaksi] =
        useState([])
    /** each detail contain ud_menu dan jumlah */

    const [id_menu, setIdMenu] = useState("")
    const [jumlah, setJumlah] = useState(0)

    const [modal, setModal] = useState(null)
    /**-------------------ini akhir state-------------------- */

    /** method for get all menu */
    const getMenu = () => {
        const url = `${baseURL}/menu`
        axios.get(url, header)
            .then(response => {
                setMenu(response.data.data)
            })
            .catch(error => console.log(error))
    }

    /** method for get all meja */
    const getMeja = () => {
        const url = `${baseURL}/meja/avail`
        axios.get(url, header)
            .then(response => {
                setMeja(response.data.data)
            })
            .catch(error => console.log(error))
    }

    /** method to get all transaksi */
    const getTransaksi = () => {
        const url = `${baseURL}/transaksi`
        axios.get(url, header)
            .then(response => {
                setTransaksi(response.data.data)
            })
            .catch(error => console.log(error))
    }

    const addMenu = () => {
        /** set selected menu */
        let selectedMenu = menu.find(
            item => item.id_menu == id_menu
        )

        let newItem = {
            ...selectedMenu,
            jumlah: jumlah
        }

        let tempDetail = [...detail_transaksi]
        /** insert new ittem to detail */
        tempDetail.push(newItem)

        /** update array detail menu */
        setDetailTransaksi(tempDetail)

        /** reset id option menu dan jumlah */
        setIdMenu("")
        setJumlah(0)
    }


    const handleSaveTransaksi = event => {
        event.preventDefault()
        if (nama_pelanggan === "" || id_meja === "" || tgl_transaksi === "" || detail_transaksi.length == 0) {
            window.alert(`Isi Form Terlebih Dahulu!!`)
        } else {
            const url = `${baseURL}/transaksi`
            const payload = {
                tgl_transaksi, id_meja, id_user,
                nama_pelanggan, detail_transaksi
            }

            axios.post(url, payload, header)
                .then(response => {
                    /** show message */
                    window.alert(`Data Transaksi Berhasil Ditambahkan!`)
                    /** close model */
                    modal.hide()

                    /** reset data inside form */
                    setTglTransaksi("")
                    setIdMeja("")
                    setIdMeja("")
                    setJumlah(0)
                    setNamaPelanggan("")
                    setDetailTransaksi([])

                    /** recall get transaksi */
                    getTransaksi()

                    /** recall get available meja */
                    getMeja()
                })
                .catch(error => console.log(error))
        }
    }

    const handleDeleteTransaksi = item => {
        if (window.confirm(`Apakah anda yakin akan menghapus transaksi "${item.id_transaksi}" atas nama "${item.nama_pelanggan}" ?`)) {
            const url = `${baseURL}/transaksi/${item.id_transaksi}`

            axios.delete(url, header)
                .then(response => getTransaksi())
                .catch(error => console.log(error))
        }
    }


    const handlePay = async item => {
        if (window.confirm(`Apakah yakin ingin membayar?`)) {
            await axios.put(`${baseURL}/meja/${item.id_meja}`, { status: true }, header)
            const url = `${baseURL}/transaksi/${item.id_transaksi}`
            const payload = { ...item, status: "lunas" }
            axios.put(url, payload, header)
                .then(response => {
                    getTransaksi()
                    getMeja()
                })
                .catch(error => console.log(error))
        }
    }


    //ambil data role dari local storage
    const ROLE = JSON.parse(
        localStorage.getItem('user')
    )


    useEffect(() => {
        getTransaksi()
        getMenu()
        getMeja()

        /** register modal */
        setModal(new Modal(`#modal-transaksi`))
    }, [])

    return (
        <div className="container-fluid p-4 w-100">
            <div className="transaksi-tittle">
                <div className="d-flex justify-content-start">
                    <h3 className="text-secondary fw-normal">DATA TRANSAKSI</h3>
                </div>
                <b>Note: </b><small className="fw-semibold">Data Transaksi Terbaru Selalu Berada di Atas</small>
            </div>
            {/** buat tombol muncul hanya saar login dengan role 'kasir */}
            {ROLE.role === "kasir" && (
                <div className="d-flex justify-content-start">
                    <button className="btn btn-dark btn-sm mb-3" onClick={() => modal.show()}> <i className="fas fa-plus"></i> Tambah Transaksi</button>
                </div>
            )}

            {ROLE.role === "admin" && (
                <div className="d-flex justify-content-start mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Cari transaksi"
                        value={search}
                        onChange={e => setSearch(e.target.value)} // Fungsi untuk mengubah nilai pencarian
                    />
                </div>
            )}

            {ROLE.role === "manajer" && (
                <div className="d-flex justify-content-start mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Cari transaksi"
                        value={search}
                        onChange={e => setSearch(e.target.value)} // Fungsi untuk mengubah nilai pencarian
                    />
                </div>
            )}

            <ul className="list-group">
                {transaksi
                    //filter agar berdasarkan nama pelanggan dan tggl transaksi
                    .filter(item =>
                        item.nama_pelanggan.toLowerCase().includes(search.toLowerCase()) ||
                        item.tgl_transaksi.toLowerCase().includes(search.toLowerCase()) ||
                        item.meja.nomor_meja.toLowerCase().includes(search.toLowerCase()) ||
                        item.status.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((item, index) => (
                        <li className="list-group-item text-bg-light pb-5 shadow-lg" key={`tran${index}`}>
                            <div className="row">
                                <div className="col-md-2">
                                    <small className="text-dark fw-bold">
                                        Tgl. Transaksi
                                    </small> <br />
                                    {item.tgl_transaksi}
                                </div>

                                <div className="col-md-2">
                                    <small className="text-dark fw-bold">
                                        Nama Pelanggan
                                    </small> <br />
                                    {item.nama_pelanggan}
                                </div>

                                <div className="col-md-2">
                                    <small className="text-dark fw-bold">
                                        No Meja
                                    </small> <br />
                                    {item.meja.nomor_meja}
                                </div>

                                <div className="col-md-2">
                                    <small className="text-dark fw-bold">
                                        Status
                                    </small> <br />
                                    <span className={`badge ${item.status === `belum_bayar` ? `bg-danger` : `bg-success`}`}>
                                        {item.status}
                                    </span>
                                    <br />
                                    {item.status === 'belum_bayar' ?
                                        <>
                                            <button className="btn btn-sm btn-success mt-1 badge" onClick={() => handlePay(item)}>
                                                PAY <i class="bi bi-currency-dollar"></i>
                                            </button>
                                        </>
                                        :
                                        <>
                                        </>}
                                </div>

                                <div className="col-md-2">
                                    <small className="text-dark fw-bold">
                                        Harga Total
                                    </small> <br />
                                    Rp.{item
                                        .detail_transaksi
                                        .reduce((sum, obj) =>
                                            Number(sum) + (obj["jumlah"] * obj["harga"]), 0)
                                    }
                                </div>

                                <div className="col-md-2">
                                    <small className="text-dark fw-bold">
                                        Action
                                    </small> <br />
                                    <button className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteTransaksi(item)}>
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>


                            </div>
                            {/** list menu yg di pesan */}
                            <div className="row mt-2">
                                <div className="title mb-1">
                                    <b><small>Detail yang dipesan :</small></b>
                                </div>
                                <ul className="list-group">
                                    {item.detail_transaksi.map((detail) => (
                                        <li className="list-group-item"
                                            key={`detail${item.id_transaksi}`}>
                                            <div className="row">
                                                {/** tampilkan nama pesanannya */}
                                                <div className="col-md-3">
                                                    <b>Menu:</b> <br />
                                                    {detail.menu.nama_menu}
                                                </div>

                                                {/** tampilkan jumlah */}
                                                <div className="col-md-3">
                                                    <b>Qty: </b> <br />
                                                    {detail.jumlah}
                                                </div>

                                                {/** tampilkan harga satuan */}
                                                <div className="col-md-3">
                                                    <b>Harga:</b> <br />
                                                    Rp.{detail.harga}
                                                </div>

                                                {/** tampilkan harga total */}
                                                <div className="col-md-3">
                                                    <b>Harga Total: </b> <br />
                                                    Rp.{Number(detail.harga) * Number(detail.jumlah)}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>

                    ))}
            </ul>

            {/** modal for  */}
            <div className="modal fade" id="modal-transaksi">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form onSubmit={handleSaveTransaksi}>
                            <div className="modal-header bg-red-800 text-light">
                                <h4 className="modal-tittle">
                                    Form Transaksi
                                </h4>
                                <small className="fst-italic">
                                    Tambahkan pesanan anda
                                </small>

                            </div>

                            <div className="modal-body">
                                {/** fill customer area */}
                                <div className="row">
                                    <div className="col-md-4">
                                        <small className="text-danger">
                                            Nama Pelanggan
                                        </small>
                                        <input type="text"
                                            className="form-control"
                                            value={nama_pelanggan}
                                            placeholder="Nama"
                                            onChange={
                                                e => setNamaPelanggan(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <small className="text-danger">
                                            Pilih Meja
                                        </small>
                                        <select
                                            className="form-control mb-2"
                                            value={id_meja}
                                            onChange={e => setIdMeja(e.target.value)}
                                        >
                                            <option value="">--Pilih Meja--</option>
                                            {meja.map(table => (
                                                <option value={table.id_meja}
                                                    key={`keyMeja${table.id_meja}`}
                                                >
                                                    Nomor Meja {table.nomor_meja}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <small className="text-danger">
                                            Tgl.Transaksi
                                        </small>
                                        <input type="date" className="form-control mb-2"
                                            value={tgl_transaksi}
                                            onChange={e => setTglTransaksi(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/** choose menu area */}
                                <div className="row">
                                    <div className="col-md-8">
                                        <small className="text-danger">
                                            Pilih Menu
                                        </small>
                                        <select className="form-control mb-2"
                                            value={id_menu}
                                            onChange={e => setIdMenu(e.target.value)}>
                                            <option value="">--pilih menu--</option>
                                            {menu.map(item => (
                                                <option value={item.id_menu} key={item.id_menu}>
                                                    {item.nama_menu}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-2">
                                        <small className="text-danger">
                                            Jumlah
                                        </small>
                                        <input type="number"
                                            className="form-control mb-2"
                                            value={jumlah}
                                            onChange={e => setJumlah(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        <small className="text-danger">
                                            Action
                                        </small> <br />
                                        <button type="button" className="btn btn-md btn-dark"
                                            onClick={() => addMenu()}>
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {/** detail order area */}
                                <div className="row">
                                    <div className="title mb-1">
                                        <b><small>Detail yang dipesan :</small></b>
                                    </div>
                                    <ul className="list-group">
                                        {detail_transaksi.map((detail) => (
                                            <li className="list-group-item"
                                                key={`detail${detail.id_menu}`}>
                                                <div className="row">
                                                    {/** tampilkan nama pesanannya */}
                                                    <div className="col-md-3">
                                                        <b>Menu:</b> <br />
                                                        {detail.nama_menu}
                                                    </div>

                                                    {/** tampilkan jumlah */}
                                                    <div className="col-md-3">
                                                        <b>Qty: </b> <br />
                                                        {detail.jumlah}
                                                    </div>

                                                    {/** tampilkan harga satuan */}
                                                    <div className="col-md-3">
                                                        <b>Harga:</b> <br />
                                                        Rp.{detail.harga}
                                                    </div>

                                                    {/** tampilkan harga total */}
                                                    <div className="col-md-2">
                                                        <b>Harga Total: </b> <br />
                                                        Rp.{Number(detail.harga) * Number(detail.jumlah)}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/** Button For Save */}
                                <button type="submit" className="w-100 btn btn-dark my-2">
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

export default transaksi