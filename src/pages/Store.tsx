// import { createSignal, createEffect, useContext } from "solid-js";
// import { DataContext } from "./DataGrid";

// // Define signals for store data
// export const [genderData, setGenderData] = createSignal<any[]>([]);

// const fetchDataFromDataGrid = () => {
//   const { rowData } = useContext(DataContext);

//   if (rowData) {
//     const aggregatedGenderData = rowData.reduce((acc, user) => {
//       const province = user.province;

//       if (!acc[province]) {
//         acc[province] = { male: 0, female: 0 };
//       }
//       if (user.gender === 'male') {
//         acc[province].male += 1;
//       } else if (user.gender === 'female') {
//         acc[province].female += 1;
//       }

//       return acc;
//     }, {});

//     console.log("Aggregated gender data:", aggregatedGenderData); // Tambahkan logging untuk cek data
//     const formattedGenderData = Object.keys(aggregatedGenderData).map(province => ({
//       province,
//       ...aggregatedGenderData[province]
//     }));

//     setGenderData(formattedGenderData);
//   }
// };


// // Fetch data on initialization
// createEffect(() => {
//   fetchDataFromDataGrid();
// });
