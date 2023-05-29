import React from 'react'
import './menu.css'

export default function MenuCard(props) {
    return (
        <div className='card mb-4 text-bg-light'>
            <div className="card-footer gambar border-0 d-flex justify-center align-middle">
                <img src={props.img} className="card-img-top" alt="img-menu"></img>
            </div>
            <div class="card-body">
                <h4 class="card-title fw-bold text-red-600 fst-italic">{props.nama_menu}</h4>
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
