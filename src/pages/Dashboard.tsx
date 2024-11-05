// src/pages/Dashboard.tsx
import { createSignal, onMount } from "solid-js";
import DataGrid from './DataGrid';
import BloodTypeChart from './BloodTypeChart';
import AgeChart from './AgeChart';
import GenderChart from './GenderChart';
import Card from './Card';
import IncomeChart from './IncomeChart';
import Map from './Map';
import './Dashboard.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { FaSolidUser, FaSolidGraduationCap, FaSolidBriefcase } from "solid-icons/fa";

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = createSignal(0);
  const [students, setStudents] = createSignal(0);
  const [workers, setWorkers] = createSignal(0);

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/users/total_pengguna");
      if (response.ok) {
        const totalUsersFromBackend = await response.json();
        setTotalUsers(parseInt(totalUsersFromBackend, 10));
      } else {
        console.error("Failed to fetch total users");
      }

      const studentsResponse = await fetch("http://127.0.0.1:8080/users/students_count");
      if (studentsResponse.ok) {
        const studentsCount = await studentsResponse.json();
        setStudents(studentsCount);
      } else {
        console.error("Failed to fetch students count");
      }

      const workersResponse = await fetch("http://127.0.0.1:8080/users/workers_count");
      if (workersResponse.ok) {
        const workersCount = await workersResponse.json();
        setWorkers(workersCount);
      } else {
        console.error("Failed to fetch workers count");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  onMount(() => {
    fetchData();

    // Listen for data updates
    window.addEventListener('dataUpdated', fetchData);

    return () => {
      window.removeEventListener('dataUpdated', fetchData);
    };
  });

  return (
    <div class="dashboard-page-container">
      <div class="dashboard-sidebar">
        <Sidebar />
      </div>
      <div class="dashboard-navbar">
        <Navbar />
      </div>
      <section class="dashboard-page">
        <div class="dashboard-content">
          <div class="cards-data-container">
            <div class="cards-section">
              <div class="cards-container">
                <Card
                  title="Total User"
                  value={totalUsers()}
                  color="#E0DAF3"
                  icon={<FaSolidUser />}
                  circleColor="#B477D9"
                />
                <Card
                  title="Murid"
                  value={students()}
                  color="#F4E2FF"
                  icon={<FaSolidGraduationCap />}
                  circleColor="#D977BD"
                />
                <Card
                  title="Pekerja"
                  value={workers()}
                  color="#D4DEFF"
                  icon={<FaSolidBriefcase />}
                  circleColor="#7174B0"
                />
              </div>
            </div>
            <div class="additional-section">
              <div class="income-container">
                <IncomeChart />
              </div>
              <div class="data-gridd-container">
                <DataGrid />
              </div>
            </div>
          </div>
          <div class="charts-section">
            <div class="charts-container">
              <div class="age-container">
                <AgeChart />
              </div>

              <div class="blood-type-container">
                <BloodTypeChart />
              </div>

              <div class="gender-container">
                <GenderChart />
              </div>
            </div>
          </div>
        </div>
        <div class="map-container">
          <Map />
        </div>
      </section>
    </div>
  );
}
