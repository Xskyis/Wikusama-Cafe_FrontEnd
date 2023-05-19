import React from "react";
import Menu from "./pages/menu";
import Login from "./pages/login";
import Transaksi from "./pages/transaksi";
import Navbar from "./components/Navbar"
import { Route, Routes, BrowserRouter } from "react-router-dom";

export default function App() {
    return (
        <BrowserRouter> 
            <Navbar />
            <Routes>
                <Route path="/menu" element={<Menu />} />
                <Route path="/login" element={<Login />} />
                <Route path="/transaksi" element={<Transaksi />} />
            </Routes>
        </BrowserRouter>
    )
}