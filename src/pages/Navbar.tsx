import { Component, createSignal, onMount, onCleanup } from "solid-js";
import { BiSolidSearch, BiSolidBell } from "solid-icons/bi";
import "./Navbar.css";
import DarkMode from "./DarkMode";
import "./DarkMode.css";


const Navbar: Component = () => {
  const [username, setUsername] = createSignal("User");

  const updateUsername = () => {
    const name = localStorage.getItem("user_name");
    if (name) {
      setUsername(name);
    } else {
      setUsername("User");
    }
  };

  onMount(() => {
    updateUsername();

    // Event listener untuk mendengarkan perubahan pada localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user_name") {
        updateUsername();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Membersihkan event listener saat komponen di-unmount
    onCleanup(() => {
      window.removeEventListener("storage", handleStorageChange);
    });

    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (window.pageYOffset > 0) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    onCleanup(() => {
      window.removeEventListener("scroll", handleScroll);
    });

  });

  return (
    <div class="navbar">
      <div class="greeting">
        <h1>Hello, {username()}!</h1> {/* Menampilkan nama pengguna dari state */}
      </div>
      <div class="navbar-right">
        <div class="dark">
          <DarkMode />
        </div>
        <div class="icon">
          <BiSolidBell size={24} class="notif-icon" />
        </div>
        <div class="profile-pic">
          <img src="public/img/user.jpg" alt="Profile" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
