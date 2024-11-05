import { createSignal, onMount, Component, For } from 'solid-js';
import { useNavigate, useParams } from "@solidjs/router";
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './EditForm.css';

const EditDataForm: Component = () => {
  const params = useParams();
  const [userData, setUserData] = createSignal({
    name: "",
    birthdate: "",
    blood_type: "",
    gender: "",
    age: "",
    job: "",
    income: ""
  });
  const navigate = useNavigate();

  onMount(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8080/users/edit/${params.id}`);
        if (response.ok) {
          const user = await response.json();

          let formattedDate = "";
          if (user.birthdate) {
            const dateParts = user.birthdate.split(/[-/]/);
            if (dateParts.length === 3) {
              formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            } else {
              formattedDate = user.birthdate;
            }
          }

          if (formattedDate.includes('/')) {
            const [day, month, year] = formattedDate.split('/');
            formattedDate = `${year}-${month}-${day}`;
          } else if (formattedDate.includes('-')) {
            const [day, month, year] = formattedDate.split('-');
            formattedDate = `${year}-${month}-${day}`;
          }

          setUserData({
            ...user,
            birthdate: formattedDate || '',
          });
        } else {
          alert("User tidak ditemukan");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Terjadi kesalahan saat mengambil data pengguna.");
        navigate("/dashboard");
      }
    };

    fetchUserData();
  });

  const handleInputChange = (e) => {
    const { name, value } = e.currentTarget;
    setUserData({ ...userData(), [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      name: userData().name,
      birthdate: userData().birthdate,
      blood_type: userData().blood_type,
      gender: userData().gender,
      age: parseInt(userData().age, 10),
      job: userData().job,
      income: userData().income
    };

    try {
      const response = await fetch(`http://127.0.0.1:8080/users/edit/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      alert("Data berhasil diupdate");
      navigate("/dashboard");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div class="edit-data-form-container">
      <Navbar />
      <Sidebar />
      <div class="edit-data-form-content">
        <h1>Edit Data User</h1>
        <form onSubmit={handleSubmit} class="edit-akun-form">
          <div class="form-edit">
            <label>Nama Lengkap</label>
            <input
              class="input-edit"
              type="text"
              name="name"
              value={userData().name}
              onInput={handleInputChange}
            />
          </div>
          <div class="form-edit">
            <label>Tanggal Lahir</label>
            <input
              class="input-edit"
              type="date"
              name="birthdate"
              value={userData().birthdate || ''}
              onInput={handleInputChange}
            />
          </div>
          <div class="form-edit">
            <label>Golongan Darah</label>
            <select
              name="blood_type"
              value={userData().blood_type.trim() || ''}
              onChange={handleInputChange}
            >
              <option value="">Pilih Golongan Darah</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </div>
          <div class="form-edit">
            <label>Jenis Kelamin</label>
            <select
              name="gender"
              value={userData().gender || ''}
              onChange={handleInputChange}
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          <div class="form-edit">
            <label>Umur</label>
            <input
              class="input-edit"
              type="number"
              name="age"
              value={userData().age || ''}
              onInput={handleInputChange}
            />
          </div>
          <div class="form-edit">
            <label>Pekerjaan</label>
            <select
              name="job"
              value={userData().job || ''}
              onChange={handleInputChange}
            >
              <option value="">Pilih Pekerjaan</option>
              <option value="Murid">Murid</option>
              <option value="Pekerja">Pekerja</option>
            </select>
          </div>
          <div class="form-edit">
            <label>Pendapatan/Bulan</label>
            <select
              name="income"
              value={userData().income || ''}
              onChange={handleInputChange}
            >
              <option value="">Pilih Pendapatan</option>
              <option value="0">0</option>
              <option value="1.000.000">1.000.000</option>
              <option value="2.000.000">2.000.000</option>
              <option value="3.000.000">3.000.000</option>
              <option value="4.000.000">4.000.000</option>
              <option value="5.000.000">5.000.000</option>
              <option value="6.000.000">&gt;6.000.000</option>
            </select>
          </div>
          <div class="button-edit">
            <button class="input-edit" type="submit">Update Data</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDataForm;
