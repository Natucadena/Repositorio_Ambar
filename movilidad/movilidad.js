document.addEventListener('DOMContentLoaded', function() {
  // Inicializar el mapa centrado en Bogotá (esto se ajustará luego)
  const map = L.map('map').setView([4.60971, -74.08175], 14);

  // Agregar capa base de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  let barrioProps = null;

  // Cargar y mostrar el contorno del barrio La Macarena y guardar sus propiedades
  fetch('BARRIO LA MACARENA.geojson')
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, {
        style: {
          color: 'black', // Contorno negro
          weight: 3,
          fillOpacity: 0 // Sin fondo, solo contorno
        }
      }).addTo(map);

      // Suponiendo que solo hay un barrio, tomamos las propiedades del primer feature
      if (data.features && data.features.length > 0) {
        barrioProps = data.features[0].properties;
      }
    })
    .catch(error => console.error('Error al cargar el GeoJSON del barrio:', error));

  // Cargar y mostrar los puntos del sitp desde el archivo GeoJSON
  fetch('SITP_Macarena.geojson')
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            radius: 7,
            fillColor: "#1976d2",
            color: "#0d47a1",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
          });
        }
      }).addTo(map);
    })
    .catch(error => console.error('Error al cargar el GeoJSON de los puntos SITP:', error));

  // Cargar y mostrar la ruta del SITP desde el archivo GeoJSON
  fetch('Ruta_Sitp_Macarena.geojson')
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, {
        style: {
          color: '#1976d2',
          weight: 4,
          opacity: 0.4 // Más transparente para ver el barrio debajo
        },
        onEachFeature: function (feature, layer) {
          let popupContent = '';
          for (const key in feature.properties) {
            if (feature.properties.hasOwnProperty(key)) {
              popupContent += `<strong>${key}:</strong> ${feature.properties[key]}<br>`;
            }
          }
          layer.bindPopup(popupContent || 'Ruta SITP');
        }
      }).addTo(map);
    })
    .catch(error => console.error('Error al cargar el GeoJSON de la ruta SITP:', error));
});
