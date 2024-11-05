import { createSignal, onMount, Component, createContext, useContext } from 'solid-js';
import { useNavigate } from "@solidjs/router";
import AgGridSolid from 'ag-grid-solid';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './DataGrid.css';
import { FiAlertCircle } from "solid-icons/fi";

type DataContextType = {
  rowData: any[];
};

// Create context
const DataContext = createContext<DataContextType>({ rowData: [] });

const DataGrid: Component = () => {
  const [rowData, setRowData] = createSignal<any[]>([]);
  const [filteredData, setFilteredData] = createSignal([]);
  const [showDeletePopup, setShowDeletePopup] = createSignal(false);
  const [userToDelete, setUserToDelete] = createSignal(null);
  const [searchTerm, setSearchTerm] = createSignal("");

  const navigate = useNavigate();

  const onEditClick = (userId) => {
    navigate(`/users/edit/${userId}`);
  };

  const onAddUserClick = () => {
    navigate('/adduser');
  };

  onMount(() => {
    loadUserData();
  });

  const loadUserData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/users/data");
      if (response.ok) {
        const data = await response.json();
        setRowData(data);
        setFilteredData(data);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateRowData = (newData) => {
    setRowData(newData);
    setFilteredData(newData);
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeletePopup(true);
  };

  const deleteUser = async () => {
    const userToDeleteValue = userToDelete();
    if (userToDeleteValue) {
      try {
        const response = await fetch(`http://127.0.0.1:8080/users/delete/${userToDeleteValue.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          await loadUserData();
          const updatedData = rowData().filter((user) => user.id !== userToDeleteValue.id);
          updateRowData(updatedData);
          setShowDeletePopup(false);

          const event = new Event('dataUpdated');
          window.dispatchEvent(event);
        } else {
          console.error("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const closePopup = () => {
    setShowDeletePopup(false);
    setUserToDelete(null);
  };

  const columnDefs = [
    { field: 'name', headerName: 'Nama Lengkap', editable: false, minWidth: 200 },
    { field: 'birthdate', headerName: 'Tanggal Lahir', editable: false, minWidth: 150 },
    { field: 'blood_type', headerName: 'Golongan Darah', editable: false, minWidth: 150 },
    { field: 'gender', headerName: 'Jenis Kelamin', editable: false, minWidth: 150 },
    { field: 'age', headerName: 'Umur', editable: false, minWidth: 100 },
    { field: 'job', headerName: 'Pekerjaan', editable: false, minWidth: 200 },
    { field: 'income', headerName: 'Pendapatan/Bulan', editable: false, minWidth: 200 },
    { field: 'email', headerName: 'Email', editable: false, minWidth: 200 },
    { field: 'password', headerName: 'Kata Sandi', editable: false, minWidth: 200 },
    { field: 'province', headerName: 'Provinsi', editable: false, minWidth: 150 }, // Menambahkan kolom Provinsi
    { field: 'regency', headerName: 'Kabupaten', editable: false, minWidth: 150 }, // Menambahkan kolom Kabupaten
    { field: 'district', headerName: 'Kecamatan', editable: false, minWidth: 150 }, // Menambahkan kolom Kecamatan
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        const container = document.createElement("div");
        container.classList.add("action-buttons");

        const updateButton = document.createElement("button");
        updateButton.innerText = "Edit";
        updateButton.classList.add("action-button", "update-button");
        updateButton.addEventListener("click", () => onEditClick(params.data.id));

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.classList.add("action-button", "delete-button");
        deleteButton.addEventListener("click", () => confirmDeleteUser(params.data));

        container.appendChild(updateButton);
        container.appendChild(deleteButton);

        return container;
      },
      minWidth: 200,
    },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  const handleSearch = (e: Event) => {
    const searchTerm = (e.target as HTMLInputElement).value;
    setSearchTerm(searchTerm);
    if (searchTerm === "") {
      setFilteredData(rowData());
    } else {
      const filtered = rowData().filter((user) => Object.values(user).some((val) => String(val).toLowerCase().includes(searchTerm.toLowerCase())));
      setFilteredData(filtered);
    }
  };

  return (
    <DataContext.Provider value={{ rowData: rowData() }}>
      <div class="data-grid-container">
        <div class="page-header">
          <div class="page-header-title">
            <h1 class="data-grid-h1">Data Pengguna</h1>
          </div>
          <div class="top-bar">
            <input type="text" placeholder="Search..." value={searchTerm()} onInput={handleSearch} class="search-inputt" />
            <button onClick={onAddUserClick} class="add-user-button">Add User</button>
          </div>
        </div>

        <div class="ag-theme-alpine custom-theme" style={{ height: '380vh', width: '100%' }}>
          {filteredData().length > 0 ? (
            <AgGridSolid
              columnDefs={columnDefs}
              rowData={filteredData()}
              defaultColDef={defaultColDef}
              animateRows={true}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {showDeletePopup() && (
          <div class="popup-delete-overlay">
            <div class="popup-delete">
              <h2>
                <FiAlertCircle size={80} style={{ color: "red" }} />
              </h2>
              <p>Are you sure you want to delete this user?</p>
              <div class="popup-delete-buttons">
                <button onClick={deleteUser} class="popup-delete-button confirm">
                  Yes
                </button>
                <button onClick={closePopup} class="popup-delete-button cancel">
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DataContext.Provider>
  );
};

export default DataGrid;
export { DataContext };