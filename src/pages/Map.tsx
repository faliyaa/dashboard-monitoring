import { createSignal, onCleanup, onMount, For } from "solid-js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import { Chart, registerables } from 'chart.js';
import "./Map.css"

Chart.register(...registerables);

function HereMap() {
  let mapContainer: HTMLDivElement | undefined;
  let map: L.Map | undefined;
  let geocoder: L.Control.Geocoder | undefined;
  let tempMarker: L.Marker | undefined;

  const here = {
    apiKey: "bdTrRk2eHn9ffAH2X3FvO8UdSIvfOcPRY3-AXpdaKAE",
  };

  const style = "normal.day";
  const hereTileUrl = `https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/${style}/{z}/{x}/{y}/512/png8?apiKey=${here.apiKey}&ppi=320`;

  const markersData = [
    {
      name: "Aceh",
      lat: 5.55,
      lng: 95.32,
      luas: "57.956 km²",
      kabupaten: {
        "Banda Aceh": {
          lat: 5.54,
          lng: 95.32,
          luas: "61.36 km²",
          kecamatan: {
            "Baiturrahman": {
              lat: 5.55,
              lng: 95.33,
              luas: "15.23 km²",
            },
            "Kuta Alam": {
              lat: 5.56,
              lng: 95.34,
              luas: "20.12 km²",
            },
          },
        },
        "Aceh Besar": {
          lat: 5.27,
          lng: 96.21,
          luas: "2,903.50 km²",
          kecamatan: {
            "Darul Imarah": {
              lat: 5.28,
              lng: 96.20,
              luas: "38.5 km²",
            },
            "Ingin Jaya": {
              lat: 5.29,
              lng: 96.22,
              luas: "43.2 km²",
            },
          },
        },
      },
    },
    {
      name: "Sumatra Utara",
      lat: 3.5852,
      lng: 98.6739,
      luas: "72,981 km²",
      kabupaten: {
        "Medan": {
          lat: 3.5852,
          lng: 98.6739,
          luas: "265.10 km²",
          kecamatan: {
            "Medan Baru": {
              lat: 3.60,
              lng: 98.67,
              luas: "25.20 km²",
            },
            "Medan Tuntungan": {
              lat: 3.61,
              lng: 98.68,
              luas: "30.15 km²",
            },
          },
        },
        "Samosir": {
          lat: 2.9700,
          lng: 99.0682,
          luas: "2,069.60 km²",
          kecamatan: {
            "Pangururan": {
              lat: 2.98,
              lng: 99.07,
              luas: "38.00 km²",
            },
            "Nainggolan": {
              lat: 2.99,
              lng: 99.08,
              luas: "42.50 km²",
            },
          },
        },
      },
    },
    // Tambahkan provinsi lain...
  ];

  const [searchQuery, setSearchQuery] = createSignal("");
  const [filteredLocations, setFilteredLocations] = createSignal<any[]>([]);
  const [globalSearchResults, setGlobalSearchResults] = createSignal<any[]>([]);
  const [genderData, setGenderData] = createSignal<{ male: number, female: number }>({ male: 0, female: 0 });

  let provinsiMarkers: L.Marker[] = [];
  let kabupatenMarkers: L.Marker[] = [];
  let kecamatanMarkers: L.Marker[] = [];

  const zoomLevels = {
    provinsi: 6, // Contoh level zoom untuk menampilkan provinsi
    kabupaten: 10, // Contoh level zoom untuk menampilkan kabupaten
    kecamatan: 14, // Contoh level zoom untuk menampilkan kecamatan
  }

  const latitude = 3.5852;
  const longitude = 98.6739;
  const zoomLevel = 12;

  const searchGlobalLocation = async (query: string) => {
    const apiUrl = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(query)}&apiKey=${here.apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const searchResults = data.items.map((item: any) => ({
          type: "Global",
          name: item.title,
          lat: item.position.lat,
          lng: item.position.lng,
        }));
        setGlobalSearchResults(searchResults);
      } else {
        setGlobalSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching global geocoding data:", error);
      setGlobalSearchResults([]);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredLocations([]);
      setGlobalSearchResults([]);
      return;
    }

    const results: any[] = [];

    markersData.forEach((provinsi) => {
      if (provinsi.name.toLowerCase().startsWith(query.toLowerCase())) {
        results.push({ type: "Provinsi", name: provinsi.name, lat: provinsi.lat, lng: provinsi.lng });
      }

      for (const kabupaten in provinsi.kabupaten) {
        const dataKabupaten = provinsi.kabupaten[kabupaten];

        if (kabupaten.toLowerCase().startsWith(query.toLowerCase())) {
          results.push({ type: "Kabupaten", name: kabupaten, lat: dataKabupaten.lat, lng: dataKabupaten.lng });
        }

        for (const kecamatan in dataKabupaten.kecamatan) {
          const dataKecamatan = dataKabupaten.kecamatan[kecamatan];
          if (kecamatan.toLowerCase().startsWith(query.toLowerCase())) {
            results.push({ type: "Kecamatan", name: kecamatan, lat: dataKecamatan.lat, lng: dataKecamatan.lng });
          }
        }
      }
    });

    setFilteredLocations(results);

    if (results.length === 0) {
      geocoder?.geocode(query, (geocodeResults) => {
        const searchResults = geocodeResults.map((result: any) => ({
          type: "Global",
          name: result.name,
          lat: result.center.lat,
          lng: result.center.lng,
        }));
        setGlobalSearchResults(searchResults);
      });

      await searchGlobalLocation(query);
    }
  };

  const selectLocation = (location: any) => {
    if (map) {
      map.setView([location.lat, location.lng], 12);

      // Hapus marker sementara jika ada
      if (tempMarker) {
        map.removeLayer(tempMarker);
      }

      // Tambah marker sementara
      tempMarker = L.marker([location.lat, location.lng])
        .addTo(map)
        .bindPopup(`<b>${location.name}</b><br>Lat: ${location.lat}<br>Lng: ${location.lng}`)
        .openPopup();
    }

    setSearchQuery(location.name);
    setFilteredLocations([]);
    setGlobalSearchResults([]);
  };

  const createChart = (data: { male: number, female: number }, container: HTMLDivElement) => {
    const ctx = document.createElement('canvas');
    container.appendChild(ctx);

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Male', 'Female'],
        datasets: [{
          label: 'Population',
          data: [data.male, data.female],
          backgroundColor: ['#42A5F5', '#FF7043'], // Colors for male and female
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      },
    });
  };

  const addMarkers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/gender-data/aceh');
      const data = await response.json();
      const maleCount = data.find((item: any) => item.gender === 'male')?.count || 0;
      const femaleCount = data.find((item: any) => item.gender === 'female')?.count || 0;
      setGenderData({ male: maleCount, female: femaleCount });
      
      // Create and display the chart for Aceh province
      const chartContainer = document.getElementById('chart-container-Aceh') as HTMLDivElement;
      if (chartContainer) {
        createChart({ male: maleCount, female: femaleCount }, chartContainer);
      }

      markersData.forEach((provinsi) => {
        const provinsiMarker = L.marker([provinsi.lat, provinsi.lng])
          .bindPopup(
            `Provinsi: ${provinsi.name}<br>Long: ${provinsi.lng}, Lat: ${provinsi.lat}<br>Luas Wilayah: ${provinsi.luas}<br>
            <div id="chart-container-${provinsi.name.replace(/\s+/g, '')}" style="width: 300px; height: 200px;"></div>`
          )
          .on("mouseover", function () {
            provinsiMarker.openPopup();
          })
          .on("mouseout", function () {
            provinsiMarker.closePopup();
          })
          .on("click", () => {
            map?.setView([provinsi.lat, provinsi.lng], zoomLevels.kabupaten);

            // Remove previous kabupaten and kecamatan markers
            kabupatenMarkers.forEach(marker => map?.removeLayer(marker));
            kecamatanMarkers.forEach(marker => map?.removeLayer(marker));

            // Hide provinsi marker
            provinsiMarker.remove();

            // Add kabupaten and kecamatan markers
            for (const kabupaten in provinsi.kabupaten) {
              const kabupatenData = provinsi.kabupaten[kabupaten];
              const kabupatenMarker = L.marker([kabupatenData.lat, kabupatenData.lng])
                .bindPopup(`Kabupaten: ${kabupaten}<br>Long: ${kabupatenData.lng}, Lat: ${kabupatenData.lat}<br>Luas: ${kabupatenData.luas}`)
                .addTo(map!)
                .on("mouseover", function () {
                  kabupatenMarker.openPopup();
                })
                .on("mouseout", function () {
                  kabupatenMarker.closePopup();
                })
                .on("click", () => {
                  map?.setView([kabupatenData.lat, kabupatenData.lng], zoomLevels.kecamatan);

                  // Remove previous kecamatan markers
                  kecamatanMarkers.forEach(marker => map?.removeLayer(marker));

                  // Hide kabupaten marker
                  kabupatenMarker.remove();

                  // Add kecamatan markers
                  for (const kecamatan in kabupatenData.kecamatan) {
                    const kecamatanData = kabupatenData.kecamatan[kecamatan];
                    const kecamatanMarker = L.marker([kecamatanData.lat, kecamatanData.lng])
                      .bindPopup(`Kecamatan: ${kecamatan}<br>Long: ${kecamatanData.lng}, Lat: ${kecamatanData.lat}<br>Luas: ${kecamatanData.luas}`)
                      .addTo(map!)
                      .on("mouseover", function () {
                        kecamatanMarker.openPopup();
                      })
                      .on("mouseout", function () {
                        kecamatanMarker.closePopup();
                      });

                    kecamatanMarkers.push(kecamatanMarker);
                  }
                });

              kabupatenMarkers.push(kabupatenMarker);
            }

            // Display chart for the clicked province
            const chartContainer = document.getElementById(`chart-container-${provinsi.name.replace(/\s+/g, '')}`) as HTMLDivElement;
            // Remove old chart if present
            if (chartContainer.firstChild) {
              chartContainer.removeChild(chartContainer.firstChild);
            }

            // Create new chart
            createChart({ male: maleCount, female: femaleCount }, chartContainer);
          })
          .addTo(map!);

        provinsiMarkers.push(provinsiMarker);
      })
    } catch (error) {
      console.error("Error fetching gender data:", error);
    }
  };

  onMount(() => {
    if (mapContainer) {
      map = L.map(mapContainer, {
        center: [latitude, longitude],
        zoom: zoomLevel,
        layers: [
          L.tileLayer(hereTileUrl, {
            maxZoom: 20,
          }),
        ],
      });

      geocoder = L.Control.Geocoder.nominatim();
      addMarkers();
    }
  });

  onCleanup(() => {
    map?.remove();
  });

  return (
    <div>
      <input
        type="text"
        class="searchbar-maps"
        value={searchQuery()}
        onInput={(e) => handleSearch(e.currentTarget.value)}
        placeholder="Cari provinsi, kabupaten, atau kecamatan"
      />
      <ul class="dropdown-map">
        <For each={filteredLocations()}>
          {(location) => (
            <li class="li-dropdown-map" onClick={() => selectLocation(location)}>
              {location.name} - {location.type}
            </li>
          )}
        </For>
        <For each={globalSearchResults()}>
          {(result) => (
            <li class="li-dropdown-map" onClick={() => selectLocation(result)}>
              {result.name} - Global
            </li>
          )}
        </For>
      </ul>
      <div class="map-container" ref={mapContainer} style={{ height: "400px", width: "100%" }} />
    </div>
  );
}

export default HereMap;