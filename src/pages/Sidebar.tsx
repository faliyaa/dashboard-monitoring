import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { BiSolidDashboard, BiSolidUser, BiSolidChart, BiSolidUserCircle, BiSolidCog, BiSolidLogOutCircle } from "solid-icons/bi";
import Swal from 'sweetalert2'; // Import SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // Import SweetAlert2 styles
import './Sidebar.css';

import LogoDashboard from '../../public/img/Logo2.png';


const Sidebar: Component = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Tidak Ada Token',
        text: 'Tidak ada token ditemukan. Silakan login terlebih dahulu.',
        width: '300px',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8080/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Logout Berhasil',
          width: '300px',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("status");
          localStorage.removeItem("user_name");
          localStorage.removeItem("currentUser");
          window.location.href = "/login";
        });
      } else {
        const errorText = await response.text();
        Swal.fire({
          icon: 'error',
          title: 'Logout Gagal',
          text: errorText,
          width: '300px',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Terjadi kesalahan saat mencoba logout. Silakan coba lagi nanti.',
        width: '300px',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div class="sidebar">
      <div class="logo-sidebar">
        <img src={LogoDashboard} alt="Logo" />
        <h1>Watch<span>flow</span></h1>
      </div>
      <nav>
        <ul>
          <h3 class="sidebar-title">Main Menu</h3>
          <li class="active">
            <a href="/dashboard">
              <BiSolidDashboard size={20} /> Dashboard
            </a>
          </li>
          <li>
            <a href="#">
              <BiSolidUser size={20} /> Users Data
            </a>
          </li>
          <li>
            <a href="#">
              <BiSolidChart size={20} /> Analytics
            </a>
          </li>
        </ul>
      </nav>
      <div class="account">
        <ul>
          <h3 class="sidebar-title">Account</h3>
          <li>
            <a href="#">
              <BiSolidUserCircle size={20} /> Profile
            </a>
          </li>
          <li>
            <a href="#">
              <BiSolidCog size={20} /> Settings
            </a>
          </li>
          <li>
            <button onClick={handleLogout} class="sidebar-logout-button">
              <BiSolidLogOutCircle size={20} /> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
