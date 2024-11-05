import { createSignal, For, onCleanup, onMount } from 'solid-js';
import { IoEyeSharp, IoEyeOffSharp } from 'solid-icons/io';
import { useNavigate } from '@solidjs/router';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import "./Register.css";

import LogoReg from '../../public/img/LogoBaruFix.png';
import AssetReg from '../../public/img/RegisterAsset2.gif';

export default function Register() {
  const [name, setName] = createSignal('');
  const [birthdate, setBirthdate] = createSignal('');
  const [bloodType, setBloodType] = createSignal('');
  const [gender, setGender] = createSignal('');
  const [age, setAge] = createSignal('');
  const [province, setProvince] = createSignal('');
  const [filteredProvinces, setFilteredProvinces] = createSignal([]);
  const provinces = [
    "Aceh", "Sumatra Utara", "Sumatra Barat", "Riau", "Kepulauan Riau", "Jambi", "Bengkulu",
    "Sumatera Selatan", "Lampung", "Bangka Belitung", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta",
    "Jawa Timur", "Banten", "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah",
    "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara", "Gorontalo", "Sulawesi Tengah", "Sulawesi Selatan",
    "Sulawesi Barat", "Sulawesi Tenggara", "Maluku", "Maluku Utara", "Papua", "Papua Barat", "Papua Selatan", "Papua Tengah", "Papua Pegunungan"
  ];
  const [filteredRegencies, setFilteredRegencies] = createSignal([]);
  const [regency, setRegency] = createSignal('');
  const provincesWithRegencies = {
    "Aceh": ["Kabupaten Aceh Besar", "Kabupaten Aceh Utara", "Kabupaten Aceh Timur"],
    "Jawa Tengah": ["Kabupaten Banyumas", "Kabupaten Cilacap", "Kabupaten Kebumen"],
    "Jawa Barat": ["Kabupaten Bandung", "Kabupaten Bogor", "Kabupaten Cirebon"],
  };
  const [filteredDistricts, setFilteredDistricts] = createSignal([]);
  const [district, setDistrict] = createSignal('');
  const regenciesWithDistricts = {
    "Kabupaten Banyumas": ["Kecamatan Ajibarang", "Kecamatan Purwokerto Utara", "Kecamatan Sumbang"],
    "Kabupaten Cilacap": ["Kecamatan Cilacap Selatan", "Kecamatan Cilacap Utara", "Kecamatan Kesugihan"],
    "Kabupaten Kebumen": ["Kecamatan Kebumen", "Kecamatan Petanahan", "Kecamatan Kutowinangun"],
  };
  const [job, setJob] = createSignal('');
  const [income, setIncome] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [showPassword, setShowPassword] = createSignal(false);
  const [securityQuestion, setSecurityQuestion] = createSignal('');
  const [securityAnswer, setSecurityAnswer] = createSignal('');

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword());
  };

  const validateNameLength = (name) => {
    return name.length >= 4;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !name() ||
      !birthdate() ||
      !bloodType() ||
      !gender() ||
      !age() ||
      !province() ||
      !regency() ||
      !district() ||
      !job() ||
      !income() ||
      !email() ||
      !password() ||
      !securityQuestion() ||
      !securityAnswer()
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Semua kolom harus diisi.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal2-small-popup'
        }
      });
      return;
    }

    if (!validateNameLength(name())) {
      Swal.fire({
        icon: 'warning',
        title: 'Nama lengkap harus minimal 4 karakter.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal2-small-popup'
        }
      });
      return;
    }

    if (!validateEmail(email())) {
      Swal.fire({
        icon: 'warning',
        title: 'Email harus berakhiran @gmail.com.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal2-small-popup'
        }
      });
      return;
    }

    if (!validatePassword(password())) {
      Swal.fire({
        icon: 'warning',
        title: 'Password harus minimal 6 karakter dan mengandung campuran huruf, angka, dan simbol.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal2-small-popup'
        }
      });
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const emailExists = users.some((user) => user.email === email());
    if (emailExists) {
      Swal.fire({
        icon: 'error',
        title: 'Email sudah terdaftar.',
        text: 'Silakan gunakan email lain.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal2-small-popup'
        }
      });
      return;
    }

    const userData = {
      name: name(),
      birthdate: birthdate(),
      blood_type: bloodType(),
      gender: gender(),
      age: parseInt(age(), 10),
      province: province(),
      regency: regency(),
      district: district(),
      job: job(),
      income: income() || null,
      email: email(),
      password: password(),
      security_question: securityQuestion(),
      security_answer: securityAnswer()
    };

    try {
      const response = await fetch('http://127.0.0.1:8080/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Pendaftaran berhasil!',
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: 'swal2-small-popup'
          }
        });

        setName('');
        setBirthdate('');
        setBloodType('');
        setGender('');
        setAge('');
        setProvince('');
        setRegency('');
        setDistrict('');
        setJob('');
        setIncome('');
        setEmail('');
        setPassword('');
        setSecurityQuestion('');
        setSecurityAnswer('');

        navigate('/verifikasiotp');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Pendaftaran gagal.',
          text: 'Silakan coba lagi.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal2-small-popup'
          }
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Terjadi kesalahan.',
        text: 'Silakan coba lagi nanti.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal2-small-popup'
        }
      });
      console.error('Error:', error);
    }
  };

  const handleInput = (e) => {
    setProvince(e.target.value);
    if (e.target.value.length > 0) {
      const filtered = provinces.filter((prov) =>
        prov.toLowerCase().startsWith(e.target.value.toLowerCase())
      );
      setFilteredProvinces(filtered);
    } else {
      setFilteredProvinces([]);
    }
  };

  const selectProvince = (prov) => {
    setProvince(prov);
    setFilteredProvinces([]);
    setFilteredRegencies(provincesWithRegencies[prov] || []);  // Isi kabupaten yang sesuai
    setRegency('');  // Reset input kabupaten
  };

  const handleRegencyInput = (value) => {
    setRegency(value);
    setFilteredRegencies(
      provincesWithRegencies[province()].filter((kabupaten) =>
        kabupaten.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const selectRegency = (kabupaten) => {
    setRegency(kabupaten);
    setFilteredRegencies([]);  // Hapus dropdown kabupaten setelah memilih
    setFilteredDistricts(regenciesWithDistricts[kabupaten] || []);  // Isi kecamatan yang sesuai
    setDistrict('');  // Reset input kecamatan
  };

  const handleDistrictInput = (value) => {
    setDistrict(value);
    if (regency()) {  // Pastikan kabupaten sudah dipilih
      setFilteredDistricts(
        (regenciesWithDistricts[regency()] || []).filter((kecamatan) =>
          kecamatan.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const selectDistrict = (kecamatan) => {
    setDistrict(kecamatan);
    setFilteredDistricts([]);  // Hapus dropdown setelah memilih kecamatan
  };

  let container;
  const handleClickOutside = (e) => {
    if (container && !container.contains(e.target)) {
      setFilteredProvinces([]);
    }
  };
  document.addEventListener("click", handleClickOutside);
  onCleanup(() => document.removeEventListener("click", handleClickOutside));

  const validateEmail = (email) => {
    return email.endsWith('@gmail.com');
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasLetter && hasDigit && hasSpecialChar;
  };

  return (
    <section class="register-form-section">
      <div class="register-ellipse-blur"></div>
      <div class="register-ellipse-blur"></div>

      <div class="register-form-container">
        <div class="register-form-card">
          <img src={LogoReg} alt="Logo" class="register-form-logo" />
          <h1 class="register-form-title">Buat akun Anda</h1>
          <p class="register-form-subtitle">Selamat datang! Silahkan masukkan informasi Anda</p>
          <form onSubmit={handleRegister}>
            <div class="register-form-row">
              <div class="register-form-group">
                <label for="name" class="register-form-label">Nama Lengkap</label>
                <input
                  type="text"
                  id="name"
                  class="register-form-input"
                  placeholder="Masukkan nama lengkap"
                  value={name()}
                  onInput={(e) => setName(e.target.value)}
                />
              </div>
              <div class="register-form-group">
                <label for="birthdate" class="register-form-label">Tanggal Lahir</label>
                <input
                  type="date"
                  id="birthdate"
                  class="register-form-input"
                  value={birthdate()}
                  onInput={(e) => setBirthdate(e.target.value)}
                />
              </div>
            </div>

            <div class="register-form-row">
              <div class="register-form-group">
                <label for="bloodType" class="register-form-label">Golongan Darah</label>
                <select
                  id="bloodType"
                  class="register-form-input"
                  value={bloodType()}
                  onInput={(e) => setBloodType(e.target.value)}
                >
                  <option value="" class="dropdown-title">Pilih golongan darah</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </select>
              </div>
              <div class="register-form-group">
                <label for="gender" class="register-form-label">Jenis Kelamin</label>
                <select
                  id="gender"
                  class="register-form-input"
                  value={gender()}
                  onInput={(e) => setGender(e.target.value)}
                >
                  <option value="">Pilih jenis kelamin</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>
            </div>

            <div class="register-form-row">
              <div class="register-form-group">
                <label for="age" class="register-form-label">Umur</label>
                <input
                  type="number"
                  id="age"
                  class="register-form-input"
                  placeholder="Masukkan umur Anda"
                  value={age()}
                  onInput={(e) => setAge(e.target.value)}
                />
              </div>
              <div class="register-form-group" ref={container}>
                <label for="province" class="register-form-label">Provinsi</label>
                <input
                  type="text"
                  id="province"
                  class="register-form-input"
                  placeholder="Masukkan provinsi"
                  value={province()}
                  onInput={handleInput}
                />

                {/* Dropdown for province suggestions */}
                {filteredProvinces().length > 0 && (
                  <div class="autocomplete-items">
                    <For each={filteredProvinces()}>
                      {(prov) => (
                        <div
                          onClick={() => selectProvince(prov)}
                          class="autocomplete-item"
                        >
                          {prov}
                        </div>
                      )}
                    </For>
                  </div>
                )}
              </div>
            </div>

            <div class="register-form-row">
              <div class="register-form-group" ref={container}>
                <label for="regency" class="register-form-label">Kabupaten</label>
                <input
                  type="text"
                  id="regency"
                  class="register-form-input"
                  placeholder="Masukkan kabupaten"
                  value={regency()}
                  onInput={(e) => handleRegencyInput(e.target.value)}
                  disabled={!province()}
                />

                {/* Dropdown untuk kabupaten jika ada input dan hasil filter */}
                {regency() && filteredRegencies().length > 0 && (
                  <div class="autocomplete-regency-items">
                    <For each={filteredRegencies()}>
                      {(regency) => (
                        <div
                          onClick={() => selectRegency(regency)}
                          class="autocomplete-regency-item"
                        >
                          {regency}
                        </div>
                      )}
                    </For>
                  </div>
                )}
              </div>

              <div class="register-form-group" ref={container}>
                <label for="district" class="register-form-label">Kecamatan</label>
                <input
                  type="text"
                  id="district"
                  class="register-form-input"
                  placeholder="Masukkan kecamatan"
                  value={district()}
                  onInput={(e) => handleDistrictInput(e.target.value)}
                  disabled={!regency()}
                />

                {/* Dropdown untuk kecamatan jika ada input dan hasil filter */}
                {district() && filteredDistricts().length > 0 && (
                  <div class="autocomplete-district-items">
                    <For each={filteredDistricts()}>
                      {(district) => (
                        <div
                          onClick={() => selectDistrict(district)}
                          class="autocomplete-district-item"
                        >
                          {district}
                        </div>
                      )}
                    </For>
                  </div>
                )}
              </div>
            </div>

            <div class="register-form-row">
              <div class="register-form-group">
                <label for="job" class="register-form-label">Pekerjaan</label>
                <select
                  id="job"
                  class="register-form-input"
                  value={job()}
                  onInput={(e) => setJob(e.target.value)}
                >
                  <option value="">Pilih pekerjaan</option>
                  <option value="Murid">Murid</option>
                  <option value="Pekerja">Pekerja</option>
                </select>
              </div>
              <div class="register-form-group">
                <label for="income" class="register-form-label">Pendapatan/Bulan</label>
                <select
                  id="income"
                  class="register-form-input"
                  value={income()}
                  onInput={(e) => setIncome(e.target.value)}
                >
                  <option value="">Pilih pendapatan</option>
                  <option value="0">0</option>
                  <option value="1.000.000">1.000.000</option>
                  <option value="2.000.000">2.000.000</option>
                  <option value="3.000.000">3.000.000</option>
                  <option value="4.000.000">4.000.000</option>
                  <option value="5.000.000">5.000.000</option>
                  <option value="6.000.000">&gt;6.000.000</option>
                </select>
              </div>
            </div>

            <div class="register-form-full-row">
              <div class="register-form-full-group">
                <label for="email" class="register-form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  class="register-form-input"
                  placeholder="Masukkan email Anda"
                  value={email()}
                  onInput={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div class="register-form-full-row">
              <div class="register-form-full-group">
                <label for="password" class="register-form-label">Password</label>
                <div class="password-container">
                  <input
                    type={showPassword() ? "text" : "password"}
                    id="password"
                    class={password() ? 'has-content' : ''}
                    placeholder="Masukkan password Anda"
                    value={password()}
                    onInput={(e) => setPassword(e.target.value)}
                  />
                  <span class="register-form-password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword() ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
                  </span>
                </div>
              </div>
            </div>

            <div class="register-form-full-row">
              <div class="register-form-group">
                <label for="securityQuestion" class="register-form-label">Pertanyaan Keamanan</label>
                <select
                  id="securityQuestion"
                  class="register-form-input"
                  value={securityQuestion()}
                  onInput={(e) => setSecurityQuestion(e.target.value)}
                >
                  <option value="">Pilih pertanyaan keamanan</option>
                  <option value="Apa nama jalan tempat Anda dibesarkan?">Apa nama jalan tempat Anda dibesarkan?</option>
                  <option value="Apa nama hewan peliharaan pertama Anda?">Apa nama hewan peliharaan pertama Anda?</option>
                  <option value="Di kota mana Anda lahir?">Di kota mana Anda lahir?</option>
                </select>
              </div>
              <div class="register-form-group">
                <label for="securityAnswer" class="register-form-label">Jawaban Keamanan</label>
                <input
                  type="text"
                  id="securityAnswer"
                  class="register-form-input"
                  placeholder="Masukkan jawaban Anda"
                  value={securityAnswer()}
                  onInput={(e) => setSecurityAnswer(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" class="register-form-submit-button">
              Daftar
            </button>
            <p class="register-form-next-page">
              Sudah punya akun? <a href="/login">Masuk disini</a>
            </p>
          </form>
        </div>
        <div class="register-form-illustration">
          <img src={AssetReg} alt="Illustration" class="register-form-pict" />
          <p class="register-form-desc">D'board adalah solusi unggul yang memudahkan Anda dalam memantau dan mengelola data pengguna. Daftarkan akun Anda untuk mulai menjelajahi dashboard yang dirancang khusus untuk memenuhi kebutuhan Anda.</p>
        </div>
      </div>
    </section>
  );
}
