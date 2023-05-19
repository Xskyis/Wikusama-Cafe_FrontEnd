/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import axios from "axios";
const baseURL = "http://localhost:8080";

const header = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}

const transaksi = () => {
    const [transaksi, setTransaksi] = useState([])

    /** method to get all transaksi */
    const getTransaksi = () => {
        const url = `${baseURL}/transaksi`
        axios.get(url, header)
            .then(response => {
                setTransaksi(response.data.data)
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {
        getTransaksi()
    }, [])

    return (
        <div className="container-fluid p-4 w-100">
            <h3>Data Transaksi</h3>
            <ul className="list-group">
                {transaksi.map((item, index) => (
                    <li className="list-group-item" key={`tran${index}`}>
                        <div className="row">
                            <div className="col-md-3">
                                <small className="text-info">
                                    Tgl. Transaksi
                                </small> <br />
                                {item.tgl_transaksi}
                            </div>

                            <div className="col-md-3">
                                <small className="text-info">
                                    Nama Pelanggan
                                </small> <br />
                                {item.nama_pelanggan}
                            </div>

                            <div className="col-md-2">
                                <small className="text-info">
                                    No Meja
                                </small> <br />
                                {item.meja.nomor_meja}
                            </div>

                            <div className="col-md-3">
                                <small className="text-info">
                                    Status
                                </small> <br />
                                {item.status}
                            </div>

                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default transaksi