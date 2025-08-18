// Inicializar el mapa centrado en La Macarena, Bogotá
const map = L.map('map').setView([4.6097, -74.0817], 15);

// Añadir capa de mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Cargar el archivo GeoJSON de la malla vial
fetch('Vial_Macarena.geojson')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    // Estilizar y añadir las vías al mapa
    const geojsonLayer = L.geoJSON(data, {
      style: {
        color: "#8B4513",     // Marrón tierra
        weight: 4,
        opacity: 0.8
      },
      onEachFeature: function (feature, layer) {
        // Mostrar MVIETIQUET en el popup
        if (feature.properties && feature.properties.MVIETIQUET) {
          layer.bindPopup(feature.properties.MVIETIQUET);
        } else {
          // Opcional: si no tiene nombre, mostrar algo genérico
          layer.bindPopup("Vía sin nombre");
        }
      }
    }).addTo(map);

    // Ajustar el zoom para mostrar todas las vías
    map.fitBounds(geojsonLayer.getBounds());
  })
  .catch(error => {
    console.error('Error al cargar el GeoJSON:', error);
    alert('Hubo un problema al cargar los datos de la malla vial: ' + error.message);
  });