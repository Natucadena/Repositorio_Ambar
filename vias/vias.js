// Inicializar el mapa centrado en Bogotá (ajusta según la ubicación real de La Macarena)
const map = L.map('map').setView([4.6388, -74.0874], 16); // Coordenadas aproximadas de La Macarena, Bogotá

// Añadir capa de mapa base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Cargar el archivo GeoJSON de la malla vial
fetch('Vial_Macarena.geojson')
  .then(response => {
    if (!response.ok) throw new Error('No se pudo cargar el archivo GeoJSON');
    return response.json();
  })
  .then(data => {
    // Estilizar y añadir las vías al mapa
    L.geoJSON(data, {
      style: {
        color: "#8B4513",     // Marrón tierra
        weight: 4,
        opacity: 0.8
      },
      onEachFeature: function (feature, layer) {
        // Si el GeoJSON tiene propiedades como nombre de calle
        if (feature.properties && feature.properties.nombre) {
          layer.bindPopup("<strong>Calle:</strong> " + feature.properties.nombre);
        }
      }
    }).addTo(map);
  })
  .catch(error => {
    console.error('Error al cargar el GeoJSON:', error);
    alert('Hubo un problema al cargar los datos de la malla vial.');
  });