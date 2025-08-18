// Inicializar el mapa (coordenadas corregidas para La Macarena)
const map = L.map('map').setView([4.6097, -74.0817], 15);

// Añadir capa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Cargar GeoJSON
fetch('Vial_Macarena.geojson')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    const geojsonLayer = L.geoJSON(data, {
      style: {
        color: "#8B4513",
        weight: 4,
        opacity: 0.8
      },
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.nombre) {
          layer.bindPopup("<strong>Calle:</strong> " + feature.properties.nombre);
        }
      }
    }).addTo(map);

    // Ajustar la vista al área de las vías
    map.fitBounds(geojsonLayer.getBounds());
  })
  .catch(error => {
    console.error('Error al cargar el GeoJSON:', error);
    alert('No se pudieron cargar los datos de las vías: ' + error.message);
  });