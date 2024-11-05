import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import Swal from 'sweetalert2'; // Import SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // Import SweetAlert2 styles
import "./VerifikasiOtp.css";

const OtpVerification = () => {
    const [otp, setOtp] = createSignal(['', '', '', '', '', '']);
    const navigate = useNavigate();

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^[0-9]$/.test(value)) {
            const newOtp = [...otp()];
            newOtp[index] = value;
            setOtp(newOtp);

            if (index < 5 && value !== '') {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        } else {
            e.target.value = '';
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && otp()[index] === '' && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const otpValue = otp().join('');

        try {
            const emailResponse = await fetch('http://127.0.0.1:8080/users/email-by-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp: otpValue }),
            });

            if (emailResponse.ok) {
                const email = await emailResponse.json();

                const verifyResponse = await fetch('http://127.0.0.1:8080/users/verified', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        otp: otpValue,
                    }),
                });

                if (verifyResponse.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'OTP berhasil diverifikasi!',
                        width: '300px',  // Reduce the width of the pop-up
                        showConfirmButton: false,
                        timer: 2000
                    }).then(() => {
                        navigate('/login');
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Verifikasi OTP gagal',
                        width: '300px',  // Reduce the width of the pop-up
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'OK'
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal mendapatkan email',
                    width: '300px',  // Reduce the width of the pop-up
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error("An error occurred during OTP verification:", error);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi kesalahan saat verifikasi OTP',
                text: 'Silakan coba lagi.',
                width: '300px',  // Reduce the width of the pop-up
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <section class="otp-verification-form-section">
            <div class="otp-verification-ellipse-blur"></div>
            <div class="otp-verification-ellipse-blur"></div>

            <div class="otp-verification-form-container">
                <div class="otp-verification-card">
                    <img src="public/img/LogoBaruFix.png" alt="Logo" class="logo" />
                    <h1>Verifikasi OTP</h1>
                    <p>Masukkan kode OTP 6 digit Anda.</p>
                    <form onSubmit={handleSubmit}>
                        <div class="otp-inputs">
                            {otp().map((value, index) => (
                                <input
                                    type="text"
                                    id={`otp-${index}`}
                                    class="otp-input"
                                    maxlength="1"
                                    value={value}
                                    onInput={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                />
                            ))}
                        </div>
                        <button type="submit">Verifikasi</button>
                    </form>
                    <p class="back-to-login-page">Kembali ke <a href="/">Register</a></p>
                </div>
                <div class="otp-verification-illustration">
                    <img src="public/img/otp.gif" alt="OTP Verification Illustration" class="otp-verification-form-illustration" />
                    <p>Isi kode OTP di atas untuk memverifikasi akun Anda.</p>
                </div>
            </div>
        </section>
    );
};

export default OtpVerification;
