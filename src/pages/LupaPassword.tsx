import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { IoEyeSharp, IoEyeOffSharp } from 'solid-icons/io';
import Swal from 'sweetalert2'; // Import SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // Import SweetAlert2 styles
import "../pages/LupaPassword.css";

const ForgotPassword = () => {
    const [email, setEmail] = createSignal('');
    const [question, setQuestion] = createSignal('');
    const [answer, setAnswer] = createSignal('');
    const [newPassword, setNewPassword] = createSignal('');
    const [showPassword, setShowPassword] = createSignal(false);
    const [passwordError, setPasswordError] = createSignal('');

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const password = newPassword();
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

        if (!email() || !question() || !answer() || !newPassword()) {
            Swal.fire({
                icon: 'warning',
                title: 'Form Tidak Lengkap',
                text: 'Semua kolom harus diisi.',
                width: '300px',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
            return;
        }

        if (!passwordRegex.test(password)) {
            Swal.fire({
                icon: 'error',
                title: 'Password Tidak Valid',
                text: 'Password baru harus minimal 6 karakter dan mengandung campuran huruf, angka, dan simbol.',
                width: '300px',  // Reduce the width of the pop-up
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
            return;
        }

        setPasswordError('');

        try {
            const data = {
                email: email(),
                security_question: question(),
                security_answer: answer(),
                password: newPassword()
            };

            const response = await fetch("http://127.0.0.1:8080/users/forgot_password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password berhasil diperbarui',
                    width: '300px',  // Reduce the width of the pop-up
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    navigate("/login");
                });
            } else {
                const result = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Memperbarui Password',
                    text: result.message || 'Terjadi kesalahan. Silakan coba lagi.',
                    width: '300px',  // Reduce the width of the pop-up
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi kesalahan',
                text: 'Terjadi kesalahan saat mencoba memperbarui password. Silakan coba lagi nanti.',
                width: '300px',  // Reduce the width of the pop-up
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <section class="forgot-password-form-section">
            <div class="forgot-password-ellipse-blur"></div>
            <div class="forgot-password-ellipse-blur"></div>

            <div class="forgot-password-form-container">
                <div class="forgot-password-card">
                    <img src="public/img/LogoBaruFix.png" alt="Logo" class="logo" />
                    <h1>Lupa Password</h1>
                    <p>Masukkan email, pilih pertanyaan keamanan, dan masukkan password baru Anda.</p>
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
                        <label for="question">Pertanyaan Keamanan</label>
                        <select
                            id="question"
                            value={question()}
                            onChange={(e) => setQuestion(e.target.value)}
                            class={question() ? 'has-content' : ''}
                        >
                            <option value="">Pilih pertanyaan keamanan</option>
                            <option value="Apa nama jalan tempat Anda dibesarkan?">Apa nama jalan tempat Anda dibesarkan?</option>
                            <option value="Apa nama hewan peliharaan pertama Anda?">Apa nama hewan peliharaan pertama Anda?</option>
                            <option value="Di kota mana Anda lahir?">Di kota mana Anda lahir?</option>
                        </select>
                        <label for="answer">Jawaban Pertanyaan Keamanan</label>
                        <input
                            type="text"
                            id="answer"
                            class={answer() ? 'has-content' : ''}
                            placeholder="Masukkan jawaban pertanyaan keamanan"
                            value={answer()}
                            onInput={(e) => setAnswer(e.target.value)}
                        />
                        <label for="new-password">Password Baru</label>
                        <div class="password-container">
                            <input
                                type={showPassword() ? "text" : "password"}
                                id="new-password"
                                class={newPassword() ? 'has-content' : ''}
                                placeholder="Masukkan password baru Anda"
                                value={newPassword()}
                                onInput={(e) => setNewPassword(e.target.value)}
                            />
                            <span class="password-toggle" onClick={togglePasswordVisibility}>
                                {showPassword() ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
                            </span>
                        </div>
                        <button type="submit">Kirim</button>
                    </form>
                    <p class="back-to-login-page">Kembali ke <a href="/login">Login</a></p>
                </div>
                <div class="forgot-password-illustration">
                    <img src="public/img/editpasswordasset.gif" alt="Forgot Password Illustration" class="forgot-password-form-illustration" />
                    <p>Isi formulir di atas untuk mengatur ulang password Anda dan mengakses akun Anda kembali.</p>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;
