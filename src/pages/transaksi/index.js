/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { Chart } from "react-google-charts";
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import './transaksiStyle.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


/** define URL Backend  */
const baseURL = "http://localhost:8080";

const header = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}

const transaksi = () => {
    const [dataTransaksi, setDataTransaksi] = useState([])
    const [menu, setMenu] = useState([])
    const [meja, setMeja] = useState([])

    /** grab data user from localStorage after login */
    const USER = JSON.parse(
        localStorage.getItem('user')
    )

    const [hasSearchResults, setHasSearchResults] = useState(true);
    const [id_user, setIdUser] = useState(USER.id_user)
    const [tgl_transaksi, setTglTransaksi] = useState("")
    const [nama_pelanggan, setNamaPelanggan] = useState("")
    const [id_meja, setIdMeja] = useState("")

    /**-------------------ini state untuk search -------------------- */
    const [search, setSearch] = useState("")

    /** each detail contain id_menu dan jumlah */
    const [detail_transaksi, setDetailTransaksi] = useState([])

    const [id_menu, setIdMenu] = useState("")
    const [jumlah, setJumlah] = useState(0)
    const [modal, setModal] = useState(null)

    const [menuOrderCounts, setMenuOrderCounts] = useState({});

    const handleSearchInputChange = (e) => {
        const inputValue = e.target.value;
        setSearch(inputValue);

        // Check if the input is empty, and if so, refresh the window
        if (inputValue === "") {
            window.location.reload();
        }
    };
    /**-------------------ini akhir state-------------------- */

    /** Chart Start */
    const getMenuOrderCounts = () => {
        const menuOrderCounts = {};
        dataTransaksi.forEach((transaction) => {
            transaction.detail_transaksi.forEach((detail) => {
                const menuId = detail.id_menu;
                if (menuOrderCounts[menuId]) {
                    menuOrderCounts[menuId]++;
                } else {
                    menuOrderCounts[menuId] = 1;
                }
            });
        });
        return menuOrderCounts;
    };

    const formatMenuDataForChart = () => {
        const data = [["Menu", "Sales (Qty)"]];
        menu.forEach((menuItem) => {
            const menuName = menuItem.nama_menu;
            let totalQty = 0;
            dataTransaksi.forEach((transaction) => {
                transaction.detail_transaksi.forEach((detail) => {
                    if (detail.id_menu === menuItem.id_menu) {
                        totalQty += detail.jumlah;
                    }
                });
            });
            data.push([menuName, totalQty]);
        });
        return data;
    };

    const chartData = formatMenuDataForChart();

    /** Chart End */

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
                setDataTransaksi(response.data.data)
            })
            .catch(error => console.log(error))
    }

    const addMenu = () => {
        //jika jumlah menu yang dipilih lebih dari 0 maka bisa di tambahkan
        if (jumlah > 0) {
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
        } else {
            toast.error("Masukan jumlah menu yang ingin dipesan!")
        }
    }


    const handleSaveTransaksi = event => {
        event.preventDefault()
        if (nama_pelanggan === "" || id_meja === "" || tgl_transaksi === "" || detail_transaksi.length === 0) {
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
                    toast.success("Transaksi berhasil ditambahkan!")
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

                    /** recall get menu */
                    getMenu()

                    /** recall get menu order counts */
                    setMenuOrderCounts(getMenuOrderCounts());

                    /** refresh */
                    window.location.reload()
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

            toast.success("Transaksi berhasil dihapus!")
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
                    toast.success("Transaksi berhasil dibayar!")
                })
                .catch(error => console.log(error))
        }
    }

    const formatTransactionToHTML = (transaction) => {
        const { id_transaksi, tgl_transaksi, nama_pelanggan, meja, detail_transaksi } = transaction;
        const userData = JSON.parse(localStorage.getItem('user'));

        let html = `
          <h2 style="text-align: center;">Transaction ID: ${id_transaksi}</h2>
          <p style="text-align: center;">Date: ${tgl_transaksi}</p>
          <p style="text-align: center;">Cashier Name: ${userData.nama_user}</p>
          <p style="text-align: center;">Customer Name: <b>${nama_pelanggan}</b></p>
          <p style="text-align: center;">Table Number: ${meja.nomor_meja}</p>
          <p style="text-align: center;">----------------------------------------------------</p>
          <h3 style="text-align: center;">Ordered Items:</h3>
        `;

        detail_transaksi.forEach((detail) => {
            const { menu, jumlah, harga } = detail;
            html += `
              <p style="text-align: center;"><strong>${menu.nama_menu}</strong></p>
                <p style="text-align: center;">Quantity: ${jumlah}</p>
                <p style="text-align: center;">Price: Rp.${harga}</p>
                <p style="text-align: center;">Subtotal: Rp.${Number(harga) * Number(jumlah)}</p>
                <hr style="width: 130px"; />
                <br/>
                
          `;
        });

        html += `
            <p style="text-align: center;">----------------------------------------------------</p>
            </ul>
            <h3 style="text-align: center;">Total: Rp.${detail_transaksi.reduce((total, detail) => total + Number(detail.harga) * Number(detail.jumlah), 0)}</h3>
            `;

        html += `
            <h4 style="text-align: center;">Terimakasih Sudah Mampir ke Wikusama Cafe !</h4>
            `;

        html += `</ul>`;
        return html;
    };


    const handleCetakTransaksi = (item) => {
        const formattedTransaction = formatTransactionToHTML(item);

        // Open a new window and write the formatted content
        const printWindow = window.open("Wikusama Cafe", "Print Transaction", "width=800,height=600");
        printWindow.document.write(formattedTransaction);
        printWindow.document.close();

        // Trigger the print functionality
        printWindow.print();
    };


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

    const filteredTransaksi = dataTransaksi.filter(item =>
        item.nama_pelanggan.toLowerCase().includes(search.toLowerCase()) ||
        item.tgl_transaksi.toLowerCase().includes(search.toLowerCase()) ||
        item.meja.nomor_meja.toLowerCase().includes(search.toLowerCase()) ||
        item.status.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const menuOrderCounts = getMenuOrderCounts();
        setMenuOrderCounts(menuOrderCounts);

        setHasSearchResults(filteredTransaksi.length > 0);


    }, [search, dataTransaksi]);



    return (
        <div className="container-fluid p-16 w-100">

            <div>
                <div className="d-flex justify-content-start">
                    <h3 className="text-secondary fw-normal">STATISTIK PENJUALAN MENU</h3>
                </div>
                {/* <Chart
                    width={"100%"}
                    height={300}
                    chartType="BarChart"
                    loader={<div>Loading Chart</div>}
                    data={chartData}
                    options={{
                        title: "Menu Favorit",
                        chartArea: { width: "50%" },
                        hAxis: { title: "Menu", minValue: 0 },
                        vAxis: { title: "Orders", minValue: 0 },
                    }}
                    rootProps={{ "data-testid": "1" }}
                /> */}
            </div>

            <div className="transaksi-tittle">
                <div className="d-flex justify-content-start">
                    <h3 className="text-secondary fw-normal">DATA TRANSAKSI</h3>
                </div>
            </div>

            <div className="trss d-flex justify-content-center align-items-center col-lg-12">
                <div className="col-lg-6">
                    {ROLE.role === "kasir" && (
                        <div className="d-flex justify-content-start">
                            <button className="btn btn-dark btn-sm mb-1" onClick={() => modal.show()}> <i class="bi bi-plus-circle"></i> Transaksi</button>
                        </div>
                    )}
                </div>
                <div className="col-lg-6 text-end">
                    <b>Note: </b><small className="fw-semibold"> Terbaru Selalu Berada di Atas</small>
                </div>
            </div>

            <div className="d-flex justify-content-start mb-3">
                <InputGroup>
                    <InputGroup.Text id="basic-addon1"><i class="bi bi-search"></i></InputGroup.Text>
                    <Form.Control
                        placeholder="Cari transaksi"
                        aria-label="Cari transaksi"
                        aria-describedby="basic-addon1"
                        type="text"
                        value={search}
                        onChange={handleSearchInputChange}
                    />
                </InputGroup>
            </div>

            <ul className="list-group">
                {hasSearchResults ? (
                    filteredTransaksi.map((item, index) => (
                        <li className="list-group-item text-bg-light rounded-lg pb-5 mb-2 shadow-md" key={`tran${index}`}>
                            <div className="row ">
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
                                    <button className="btn btn-sm btn-danger me-1"
                                        onClick={() => handleDeleteTransaksi(item)}>
                                        <i class="bi bi-trash"></i>
                                    </button>
                                    <button className="btn btn-sm btn-dark" onClick={() => handleCetakTransaksi(item)}>
                                        <i className="bi bi-printer"></i> Cetak
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
                    ))
                ) : (
                    <p>No results found.</p>
                )}
            </ul>

            {/** Modal for  */}
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
                                            required={true}
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
                                            required={true}
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
            <ToastContainer />
        </div>
    )
}

export default transaksi