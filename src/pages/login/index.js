import React, { useState } from "react";
import axios from "axios";
import './loginStyle.css'

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = event => {
        event.preventDefault()
        let payLoad = { username, password }

        let url = "http://localhost:8080/auth"

        axios.post(url, payLoad)
            .then(response => {
                if (response.data.status == true) {
                    /** Login success */
                    /** grab token */
                    let token = response.data.token
                    /** grab data user */
                    let user = response.data.data

                    /** store to local storage */
                    localStorage.setItem('token', token)
                    localStorage.setItem('user', JSON.stringify(user))

                    window.alert("Login success !")

                    /** redirect to menu */
                    window.location.href = "/menu"
                } else {
                    /** Login failed */
                    window.alert("Username atau password salah !")

                    /** clear form */
                    setUsername("")
                    setPassword("")
                }
            })
            .catch(error => {
                window.alert(error)
            })
    }

    return (
        <div className="container vw-100 vh-100 d-flex justify-content-center align-items-center">
            <div className="bg-image"></div>
            <div className="from-box col-md-5 border rounded-2 p-5 drop-shadow-md shadow-lg">
                <form className="form-body" onSubmit={handleLogin}>
                    <h3 className="text-center fw-bolder mb-4">
                        <span className="text-danger fw-bolder">WIKUSAMA</span> <span className="fw-bolder fst-italic">CAFE</span> ☕
                    </h3>
                    <input type="text" className="form-control mb-2 rounded-pill" required={true}
                        placeholder="Username"
                        value={username} onChange={e => setUsername(e.target.value)} />

                    <input type="password" className="form-control mb-2 rounded-pill" required={true}
                        placeholder="Password"
                        value={password} onChange={e => setPassword(e.target.value)} />

                    <button type="submit" className="fw-semibold btn btn-dark w-100 mb-2 rounded-pill">
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login