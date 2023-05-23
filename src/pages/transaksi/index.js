/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

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
        const url = `${baseURL}/meja`
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

    useEffect(() => {
        getTransaksi()
        getMenu()
        getMeja()

        /** register modal */
        setModal(new Modal(`#modal-transaksi`))
    }, [])

    return (
        <div className="container-fluid p-4 w-100">
            <b><h3>Data Transaksi</h3></b>


            <button className="btn btn-dark m-1" onClick={() => modal.show()}>
                Transaksi Baru
            </button>

            <ul className="list-group">
                {transaksi.map((item, index) => (
                    <li className="list-group-item" key={`tran${index}`}>
                        <div className="row">
                            <div className="col-md-3">
                                <small className="text-dark fw-bold">
                                    Tgl. Transaksi
                                </small> <br />
                                {item.tgl_transaksi}
                            </div>

                            <div className="col-md-3">
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

                            <div className="col-md-3">
                                <small className="text-dark fw-bold">
                                    Status
                                </small> <br />
                                {item.status}
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
                                            <div className="col-md-2">
                                                <b>Harga:</b> <br />
                                                Rp.{detail.harga}
                                            </div>

                                            {/** tampilkan harga total */}
                                            <div className="col-md-1">
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
                        <form action="">
                            <div className="modal-header">
                                <h4 className="modal-tittle">
                                    Form Transaksi
                                </h4>
                                <small>
                                    Tambahkan pesanan anda
                                </small>

                            </div>

                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-8">
                                        <small className="text-info">
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
                                        <small className="text-info">
                                            Jumlah
                                        </small> <br />
                                        <input type="number"
                                            className="mb-2 w-50"
                                            value={jumlah}
                                            onChange={e => setJumlah(e.target.value)} 
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        <small className="text-info">
                                            Action
                                        </small> <br />
                                        <button type="button" className="btn btn-sm btn-success"
                                            onClick={() => addMenu()}>
                                            Add
                                        </button>
                                    </div>
                                </div>

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
                                                    <div className="col-md-2">
                                                        <b>Harga:</b> <br />
                                                        Rp.{detail.harga}
                                                    </div>

                                                    {/** tampilkan harga total */}
                                                    <div className="col-md-1">
                                                        <b>Harga Total: </b> <br />
                                                        Rp.{Number(detail.harga) * Number(detail.jumlah)}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default transaksi