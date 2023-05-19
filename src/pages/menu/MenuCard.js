import React from 'react'
import './menu.css'

export default function MenuCard(props) {
    return (
        <div className='card mb-4 text-bg-light'>
            <img src={props.img} className="card-img-top" alt="img-menu"></img>
            <div class="card-body">
                <h5 class="card-title fw-bold text-red-600">{props.nama_menu}</h5>
                <p className="card-text"><b>Deskripsi:</b> {props.deskripsi}</p>
                <h6 className="card-text">Jenis: {props.jenis}</h6>
                <small className="card-text text-primary"><b className='text-dark'>Harga: Rp.</b>{props.harga}</small>

                <div className="mt-2 d-flex justify-content-center">
                    <button className='btn btn-dark w-50 rounded-pill' onClick={() => props.onEdit()}>
                        Edit
                    </button>
                    <button className="btn btn-danger mx-1 w-50 rounded-pill" onClick={() => props.onDelete()}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}
