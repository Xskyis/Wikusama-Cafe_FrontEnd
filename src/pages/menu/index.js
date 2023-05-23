import React from 'react'
import MenuCard from './MenuCard'
import { useState, useEffect } from 'react'
import { Modal } from 'bootstrap'

/** library for connect to another server */
import axios from 'axios'
const baseURL = "http://localhost:8080"
const header = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
}

export default function Menu() {
  /** define state for store menu */
  const [menus, setMenus] = useState([])

  /** define state for store props of menus */
  const [id_Menu, setIDMenu] = useState(0)
  const [nama_Menu, setNamaMenu] = useState(" ")
  const [jenis, setJenis] = useState(" ")
  const [deskripsi, setDeskripsi] = useState(" ")
  const [harga, setHarga] = useState(0)
  const [gambar, setGambar] = useState(undefined)

  /** define state to store modal */
  const [modal, setModal] = useState(undefined)

  /** define state to store status of menu */
  const [isEdit, setIsEdit] = useState(true)

  /**  */
  const [keyword, setKeyword] = useState(" ")

  async function getMenu() {
    try {
      let url = `${baseURL}/menu`
      let { data } = await axios.get(url, header)
      setMenus(data.data)
    } catch (error) {
      console.log(error);
    }
  }

  async function searching(e) {
    try {
      if (e.keyCode == 13) {
        let url = `${baseURL}/menu/find`
        let dataSearch = {
          keyword: keyword
        }
        let { data } = await axios.post(url, dataSearch, header)
        setMenus(data.data)
      } else if (e.keyCode == 13 || keyword == "") {
        getMenu()
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function addMenu() {
    /** show modal */
    modal.show()

    /** reset state of menu */
    setIDMenu(0)
    setNamaMenu("")
    setDeskripsi("")
    setHarga(0)
    setJenis("")
    setGambar(undefined)
    setIsEdit(false)

    /** close modal */
  }

  async function edit(menu) {
    /** open modal */
    modal.show()
    setIsEdit(true)

    setIDMenu(menu.id_menu)
    setNamaMenu(menu.nama_menu)
    setDeskripsi(menu.deskripsi)
    setHarga(menu.harga)
    setJenis(menu.jenis)
    setGambar(undefined)
  }

  async function saveMenu(e) {
    try {
      e.preventDefault()
      /** close modal */
      modal.hide()
      if (isEdit) {
        /** ini utk edit */
        let form = new FormData()
        form.append("nama_menu", nama_Menu)
        form.append("harga", harga)
        form.append("jenis", jenis)
        form.append("deskripsi", deskripsi)

        // eslint-disable-next-line eqeqeq
        if (gambar != undefined) {
          form.append("gambar", gambar)
        }

        /** send to backend */
        let url = `${baseURL}/menu/${id_Menu}`
        let result = await axios.put(url, form, header)

        if (result.data.status === true) {
          /** refresh data menu */
          getMenu()
        }
        window.alert(result.data.message)

      } else {
        /** ini utk tambah */
        let form = new FormData()
        form.append("nama_menu", nama_Menu)
        form.append("harga", harga)
        form.append("jenis", jenis)
        form.append("deskripsi", deskripsi)
        form.append("gambar", gambar)

        /** send to backend */
        let url = `${baseURL}/menu`
        let result = await axios.post(url, form, header)

        if (result.data.status === true) {
          /** refresh data menu */
          getMenu()
        }
        window.alert(result.data.message)
      }
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  }

  /** funct to delete menu */
  async function drop(menu) {
    try {
      if (window.confirm(`Are you sure to delete '${menu.nama_menu}' ?`)) {
        let url = `${baseURL}/menu/${menu.id_menu}`
        axios.delete(url, header)
          .then(result => {
            if (result.data.status == true) {
              window.alert(result.data.message)
            }
            /** refresh data */
            getMenu()
          })
          .catch(error => {
            console.log(error)
          })
      }
    } catch (error) {
      console.log(error);
    }
  }

  /** use effect => menjalankan aksi saat
   * komponen ini dimuat
   */
  useEffect(() => {
    /** initialiazing modal */
    setModal(new Modal(`#modalMenu`))
    getMenu()
  }, [])

  return (
    <div className='container-fluid p-4 w-100'>
      <h3 className='fw-bold'>Daftar Menu</h3>
      <br />
      <button className='btn btn-dark mb-3' onClick={() => addMenu()}>
        Tambah Menu
      </button>

      <input
        type="text"
        className='form-control my-2 mb-3'
        placeholder='Pencarian'
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        onKeyUp={e => searching(e)}
      />

      <div className="row">
        {menus.map(menu => (
          <div key={`menu${menu.id_menu}`} className="col-md-6 col-lg-4">
            <MenuCard
              img={`${baseURL}/menu_image/${menu.gambar}`}
              nama_menu={menu.nama_menu}
              deskripsi={menu.deskripsi}
              harga={menu.harga}
              jenis={menu.jenis}
              onEdit={() => edit(menu)}
              onDelete={() => drop(menu)}
            />
          </div>
        ))}
      </div>

      {/** create div of modal */}
      <div className="modal fade" id="modalMenu">
        <div className="modal-dialog modal-md">
          <div className="modal-content">
            <form onSubmit={e => saveMenu(e)}>
              <div className="modal-header bg-red-800 text-white">
                <h4>Form Menu</h4>
              </div>

              <div className="modal-body">
                <small>Nama Menu</small>
                <input
                  required={true}
                  type="text"
                  className='form-control mb-2'
                  value={nama_Menu}
                  onChange={e => setNamaMenu(e.target.value)}
                />

                <small>Deskripsi</small>
                <input
                  required={true}
                  type="text"
                  className='form-control mb-2'
                  value={deskripsi}
                  onChange={e => setDeskripsi(e.target.value)}
                />


                <small>Harga</small>
                <input
                  required={true}
                  type="number"
                  className='form-control mb-2'
                  value={harga}
                  onChange={e => setHarga(e.target.value)}
                />

                <small>Gambar</small>
                <input
                  type="file"
                  className='form-control mb-2'
                  accept='image/*'
                  onChange={e => setGambar(e.target.files[0])}
                />

                <small>Jenis</small>
                <select
                  required={true}
                  className='form-control mb-2'
                  value={jenis}
                  onChange={e => setJenis(e.target.value)}>
                  <option value="">--Pilih Jenis Makanan--</option>
                  <option value="makanan">Makanan</option>
                  <option value="minuman">Minuman</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type='submit' className='w-100 btn btn-dark'>
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
