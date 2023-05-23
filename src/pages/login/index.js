import React, { useState } from "react";
import axios from "axios";
import './loginStyle.css'

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

                    /** login success */
                    window.alert("Login success !")

                    /** redirect ke endpoint Menu */
                    window.location.href = "/menu"
                } else {
                    /** login gagal */
                    window.alert("Username or password is incorrect !")

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
            <div className="bg-image"></div>
            <div className="from-box col-md-5 border rounded-2 p-5 drop-shadow-md shadow-lg">
                <form className="form-body" onSubmit={handleLogin}>
                    <h3 className="text-center fw-bolder mb-4">
                        <span className="text-danger fw-bolder">WIKUSAMA</span> <span className="fw-bolder fst-italic">CAFE</span> ☕
                    </h3>
                    <input type="text" className="form-control mb-2 rounded-pill" required={true}
                        placeholder="Username"
                        value={username} onChange={e => setUsername(e.target.value)} />

                    <div className="input-group mb-2">
                        <input type={showPassword ? "text" : "password"} id="password" className="form-control rounded-pill" required={true}
                            placeholder="Password"
                            value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                            <input type="checkbox" className="ms-2 mt-1 mb-3" onChange={togglePassword} /> <b><small>Show Password</small></b>

                    <button type="submit" className="fw-semibold btn btn-dark w-100 mb-2 rounded-pill">
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
