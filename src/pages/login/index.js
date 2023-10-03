import React, { useState } from "react";
import axios from "axios";
import './loginStyle.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = event => {
        event.preventDefault()
        let payLoad = { username, password }
        let url = "http://localhost:8080/auth"

        axios.post(url, payLoad)
            .then(response => {
                if (response.data.status === true) {
                    /** grab token */
                    let token = response.data.token
                    /** grab data user */
                    let user = response.data.data

                    /** simpan data ke localstorage */
                    localStorage.setItem('token', token)
                    localStorage.setItem('user', JSON.stringify(user))

                    /** login success toast promise */
                    toast.promise(
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                resolve()
                            }, 1500)
                        }),
                        {
                            pending: "Loging in...",
                            success: "Login success!",
                            error: "Login failed!"
                        }
                    )

                    /** tunggu 2 detik */
                    setTimeout(() => {
                        window.location.href = "/home"
                    }, 2500)
                } else {
                    /** login gagal */
                    toast.error("Password atau username salah!");

                    /** kosongkan field password & username */
                    setUsername("")
                    setPassword("")
                }
            })
            .catch(error => {
                window.alert(error)
            })
    }

    const togglePassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="container vw-100 vh-100 d-flex justify-content-center align-items-center">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"></link>
            <div className="bg-image"></div>
            <div className="from-box col-md-5 border rounded-4 p-5 drop-shadow-md shadow-2xl">
                <form className="form-body" onSubmit={handleLogin}>
                    <h3 className="text-center fw-bolder mb-4">
                        <span className="text-danger fw-bolder">WIKUSAMA</span>
                        <span className="fw-bolder fst-italic">CAFE</span> ☕
                    </h3>
                    <input type="text" className="form-control mb-2 " required={true}
                        placeholder="Username"
                        value={username} onChange={e => setUsername(e.target.value)} />

                    {/** input group "password" with eye icon for show password */}
                    <div className="input-group mb-4">
                        <input type={showPassword ? "text" : "password"} className="form-control" required={true}
                            placeholder="Password"
                            value={password} onChange={e => setPassword(e.target.value)} />
                        <span className="input-group-text" onClick={togglePassword}>
                            <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                        </span>
                    </div>

                    <button type="submit" className="btn btn-dark w-100 mb-2 rounded-pill p-2">
                        Sign in
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login
