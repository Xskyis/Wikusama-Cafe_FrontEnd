import React from 'react'
import './menu.css'

export default function MenuCard(props) {
    return (
        <div className='card mb-4 text-bg-light'>
            <div className="card-footer gambar border-0 d-flex justify-center align-middle">
                <img src={props.img} className="card-img-top" alt="img-menu"></img>
            </div>
            <div className="card-body">
                <h4 className="card-title text-center mb-5">-- <span class="bg-gray-100 text-white text-sm font-medium mr-2 px-2.5 py-1 rounded dark:bg-black dark:text-gray-300">{props.nama_menu}</span>--</h4>
                <h6 className="card-text"><b>Deskripsi:</b> <small>{props.deskripsi}</small></h6>
                <h6 className="card-text"><b>Jenis:</b> {props.jenis}</h6>
                <small className="card-text"><b className='text-dark'>Harga: Rp.</b>{props.harga}</small>
            </div>
            <div className="card-footer p-3 d-flex justify-content-center border-0">
                <button className='btn btn-dark w-50' onClick={() => props.onEdit()}>
                    Edit
                </button>
                <button className="btn btn-danger mx-1 w-50" onClick={() => props.onDelete()}>
                    Delete
                </button>
            </div>
        </div>
    )
}
