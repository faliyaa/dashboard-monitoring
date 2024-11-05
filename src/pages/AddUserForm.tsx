import { createSignal, Component, onCleanup, For } from 'solid-js';
import { IoEyeSharp, IoEyeOffSharp } from 'solid-icons/io';
import { useNavigate } from '@solidjs/router';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './AddUserForm.css';

const AddUserForm: Component<{ onAddUser: (newUser: any) => void }> = (props) => {
  const [currentPage, setCurrentPage] = createSignal(1);
  const [name, setName] = createSignal('');
  const [birthdate, setBirthdate] = createSignal('');
  const [bloodType, setBloodType] = createSignal('');
  const [gender, setGender] = createSignal('');
  const [age, setAge] = createSignal('');
  const [job, setJob] = createSignal('');
  const [income, setIncome] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [showPassword, setShowPassword] = createSignal(false);
  const [securityQuestion, setSecurityQuestion] = createSignal('');
  const [securityAnswer, setSecurityAnswer] = createSignal('');
  const [province, setProvince] = createSignal('');
  const [filteredProvinces, setFilteredProvinces] = createSignal([]);
  const provinces = [
    "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau", "Jambi", "Bengkulu",
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
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name() ||
      !birthdate() ||
      !bloodType() ||
      !gender() ||
      !age() ||
      !job() ||
      !income() ||
      !email() ||
      !password() ||
      !securityQuestion() ||
      !securityAnswer()
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulir Tidak Lengkap',
        text: 'Semua kolom harus diisi.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!validateEmail(email())) {
      Swal.fire({
        icon: 'error',
        title: 'Email Tidak Valid',
        text: 'Email harus berakhiran @gmail.com.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!validatePassword(password())) {
      Swal.fire({
        icon: 'error',
        title: 'Password Tidak Valid',
        text: 'Password harus minimal 6 karakter dan mengandung campuran huruf, angka, dan simbol.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const emailExists = users.some((user) => user.email === email());
    if (emailExists) {
      Swal.fire({
        icon: 'error',
        title: 'Email Terdaftar',
        text: 'Email sudah terdaftar. Silakan gunakan email lain.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
      return;
    }

    const userData = {
      name: name(),
      birthdate: birthdate(),
      blood_type: bloodType(),
      gender: gender(),
      age: parseInt(age(), 10),
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
          title: 'Pendaftaran Berhasil',
          width: '300px',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          // Reset form fields
          setName('');
          setBirthdate('');
          setBloodType('');
          setGender('');
          setAge('');
          setJob('');
          setIncome('');
          setEmail('');
          setPassword('');
          setSecurityQuestion('');
          setSecurityAnswer('');

          navigate('/dashboard');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Pendaftaran Gagal',
          text: 'Pendaftaran gagal. Silakan coba lagi.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Terjadi kesalahan saat pendaftaran.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
      console.error('Error:', error);
    }
  };

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


  return (
    <div class="add-data-form-container">
      <Navbar />
      <Sidebar />
      <div class="add-data-form-content">
        <h1>Add Data User</h1>
        <form onSubmit={handleSubmit} class="add-data-form">
          <div class="add-form">
            <label>Nama Lengkap:</label>
            <input
              class="input-add"
              type="text"
              id="name"
              placeholder='Masukkan nama lengkap'
              value={name()}
              onInput={(e) => setName(e.target.value)}
            />
          </div>
          <div class="add-form">
            <label>Tanggal Lahir:</label>
            <input
              class="input-add"
              type="date"
              id="birthdate"
              value={birthdate()}
              onInput={(e) => setBirthdate(e.target.value)}
            />
          </div>
          <div class="add-form">
            <label>Golongan Darah:</label>
            <select
              id='bloodType'
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
          <div class="add-form">
            <label>Jenis Kelamin:</label>
            <select
              id='gender'
              value={gender()}
              onInput={(e) => setGender(e.target.value)}
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>
          <div class="add-form">
            <label>Umur:</label>
            <input
              type="number"
              id='age'
              class="input-add"
              placeholder='Masukkan umur Anda'
              value={age()}
              onInput={(e) => setAge(e.target.value)}
            />
          </div>

          <div class="add-form">
            <label>Provinsi:</label>
            <input
              type="text"
              class="input-add"
              placeholder="Masukkan provinsi"
              value={province()}
              onInput={handleInput}
            />
            {filteredProvinces().length > 0 && (
              <div class="add-user-autocomplete-items">
                <For each={filteredProvinces()}>
                  {(prov) => (
                    <div
                      onClick={() => selectProvince(prov)}
                      class="add-user-autocomplete-item"
                    >
                      {prov}
                    </div>
                  )}
                </For>
              </div>
            )}
          </div>

          {/* Regency */}
          <div class="add-form">
            <label>Kabupaten:</label>
            <input
              type="text"
              class="input-add"
              placeholder="Masukkan kabupaten"
              value={regency()}
              onInput={(e) => handleRegencyInput(e.target.value)}
              disabled={!province()}
            />
            {regency() && filteredRegencies().length > 0 && (
              <div class="add-user-autocomplete-regency-items">
                <For each={filteredRegencies()}>
                  {(regency) => (
                    <div
                      onClick={() => selectRegency(regency)}
                      class="add-user-autocomplete-regency-item"
                    >
                      {regency}
                    </div>
                  )}
                </For>
              </div>
            )}
          </div>

          {/* District */}
          <div class="add-form">
            <label>Kecamatan:</label>
            <input
              type="text"
              class="input-add"
              placeholder="Masukkan kecamatan"
              value={district()}
              onInput={(e) => handleDistrictInput(e.target.value)}
              disabled={!regency()}  // Disable if no regency selected
            />
            {district() && filteredDistricts().length > 0 && (
              <div class="add-user-autocomplete-district-items">
                <For each={filteredDistricts()}>
                  {(district) => (
                    <div
                      onClick={() => selectDistrict(district)}
                      class="add-user-autocomplete-district-item"
                    >
                      {district}
                    </div>
                  )}
                </For>
              </div>
            )}
          </div>

          <div class="add-form">
            <label>Pekerjaan:</label>
            <select
              id='job'
              value={job()}
              onInput={(e) => setJob(e.target.value)}
            >
              <option value="">Pilih pekerjaan</option>
              <option value="Murid">Murid</option>
              <option value="Pekerja">Pekerja</option>
            </select>
          </div>
          <div class="add-form">
            <label>Pendapatan/Bulan:</label>
            <select
              id='income'
              value={income()}
              onInput={(e) => setIncome(e.target.value)}
            >
              <option value="">Pilih pendapatan/bulan</option>
              <option value="0">0</option>
              <option value="1.000.000">1.000.000</option>
              <option value="2.000.000">2.000.000</option>
              <option value="3.000.000">3.000.000</option>
              <option value="4.000.000">4.000.000</option>
              <option value="5.000.000">5.000.000</option>
              <option value="6.000.000">6.000.000</option>
            </select>
          </div>
          <div class="add-form">
            <label>Email:</label>
            <input
              type="email"
              class="input-add"
              id='email'
              placeholder='Masukkan email'
              value={email()}
              onInput={(e) => setEmail(e.target.value)}
            />
          </div>
          <div class="add-form">
            <label>Password:</label>
            <div class="add-form-password-input-container">
              <input
                class="input-add"
                type={showPassword() ? "text" : "password"}
                id='password'
                placeholder='Masukkan password'
                value={password()}
                onInput={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                class="add-form-password-toggle-button"
              >
                {showPassword() ? <IoEyeOffSharp /> : <IoEyeSharp />}
              </button>
            </div>
          </div>
          <div class="add-form">
            <label>Pertanyaan Keamanan</label>
            <select
              id="securityQuestion"
              value={securityQuestion()}
              onInput={(e) => setSecurityQuestion(e.target.value)}
            >
              <option value="">Pilih pertanyaan keamanan</option>
              <option value="Apa nama jalan tempat Anda dibesarkan?">Apa nama jalan tempat Anda dibesarkan?</option>
              <option value="Apa nama hewan peliharaan pertama Anda?">Apa nama hewan peliharaan pertama Anda?</option>
              <option value="Di kota mana Anda lahir?">Di kota mana Anda lahir?</option>
            </select>
          </div>
          <div class="add-form">
            <label>Jawaban Keamanan:</label>
            <input
              type="text"
              class="input-add"
              id='securityAnswer'
              placeholder='Masukkan jawaban keamanan'
              value={securityAnswer()}
              onInput={(e) => setSecurityAnswer(e.target.value)}
            />
          </div>
          <div class="button-add-user">
            <button type="submit">Tambah Data</button>
          </div>
        </form >
      </div>
    </div >
  );
};

export default AddUserForm;
