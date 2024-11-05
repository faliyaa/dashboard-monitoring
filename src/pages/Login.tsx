import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { IoEyeSharp, IoEyeOffSharp } from 'solid-icons/io';
import Swal from 'sweetalert2'; // Import SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // Import SweetAlert2 styles
import "../pages/Login.css";

import Logo from '../../public/img/logogogogo.png';
import AssetLogin from '../../public/img/LoginAsset2.gif';

const Login = () => {
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [showPassword, setShowPassword] = createSignal(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email() || !password()) {
            Swal.fire({
                icon: 'warning',
                title: 'Email dan password harus diisi.',
                width: '300px',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8080/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email(),
                    password: password(),
                }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token); 
                localStorage.setItem('user_id', data.user_id); 
                localStorage.setItem('user_name', data.user_name);
                localStorage.setItem('currentUser', JSON.stringify({ name: data.user_name })); 
                
                Swal.fire({
                    icon: 'success',
                    title: 'Login berhasil!',
                    width: '300px',
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    navigate('/dashboard'); 
                });

            } else {
                const error = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Login gagal',
                    text: error.message || 'Password atau email Anda tidak sesuai',
                    width: '300px',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error("An error occurred during login:", error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi kesalahan saat login',
                text: 'Silakan coba lagi.',
                width: '300px',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <section class="login-form-section">
            <div class="login-ellipse-blur "></div>
            <div class="login-ellipse-blur "></div>

            <div class="login-form-container">
                <div class="login-card">
                    <img src={Logo} alt="Logo" class="logo" />
                    <h1>Masuk ke akun Anda</h1>
                    <p>Selamat datang kembali!</p>
                    <form onSubmit={handleSubmit}>
                        <label for="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            class={email() ? 'has-content' : ''}
                            placeholder="Masukkan email Anda"
                            value={email()}
                            onInput={(e) => setEmail(e.target.value)}
                        />
                        <label for="password">Password</label>
                        <div class="password-container">
                            <input
                                type={showPassword() ? "text" : "password"}
                                id="password"
                                class={password() ? 'has-content' : ''}
                                placeholder="Masukkan password Anda"
                                value={password()}
                                onInput={(e) => setPassword(e.target.value)}
                            />
                            <span class="password-toggle" onClick={togglePasswordVisibility}>
                                {showPassword() ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
                            </span>
                        </div>
                        <a href="/resetpassword" class="forgot-password">Lupa password?</a>
                        <button type="submit">Masuk</button>
                    </form>
                    <p class="register-page">Belum punya akun? <a href="/">Buat sekarang!</a></p>
                </div>
                <div class="login-illustration">
                    <img src={AssetLogin} alt="Dashboard Illustration" class="login-form-illustration" />
                    <p>Masuk sekarang untuk mengakses dashboard dan memanfaatkan semua fitur kami yang dirancang untuk membantu Anda memahami data secara lebih efektif.</p>
                </div>
            </div>
        </section>
    );
};

export default Login;
