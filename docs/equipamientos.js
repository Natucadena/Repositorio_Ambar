// Inicializar el mapa
const map = L.map('map');

// Capa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Cargar el polígono del barrio
fetch('barrio_la_macarena.geojson')
  .then(response => response.json())
  .then(data => {
    const barrio = data.features[0];
    const barrioBounds = L.geoJSON(barrio).getBounds();

    // Añadir el polígono del barrio (límite visual)
    L.geoJSON(barrio, {
      color: '#5d4037',
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.1,
      fillColor: '#5d4037'
    }).addTo(map);

    // Equipamientos filtrados por ubicación (dentro del barrio)
    const equipamientos = [
      {
        nombre: "Parque de la Independencia",
        tipo: "Parque",
        coords: [4.6105, -74.0848],
        info: "Gran parque con áreas verdes, juegos infantiles y zonas de ejercicio."
      },
      {
        nombre: "Centro de Salud Macarena",
        tipo: "Salud",
        coords: [4.6085, -74.0830],
        info: "Atención médica básica y servicios de prevención."
      },
      {
        nombre: "Colegio Agustín Codazzi",
        tipo: "Educación",
        coords: [4.6092, -74.0835],
        info: "Institución educativa pública de básica y media."
      },
      {
        nombre: "Iglesia de la Macarena",
        tipo: "Religión",
        coords: [4.6098, -74.0815],
        info: "Iglesia católica con misas y actividades comunitarias."
      },
      {
        nombre: "Estación Las Aguas (TransMilenio)",
        tipo: "Transporte",
        coords: [4.6075, -74.0840],
        info: "Estación del sistema TransMilenio con conexión a varias rutas."
      },
      {
        nombre: "Museo del Oro",
        tipo: "Cultura",
        coords: [4.6060, -74.0810],
        info: "Uno de los museos más importantes de Colombia, con colecciones precolombinas."
      },
      {
        nombre: "Parque Nacional",
        tipo: "Parque",
        coords: [4.6055, -74.0790],
        info: "Espacio amplio para deporte, paseos y eventos culturales al aire libre."
      }
    ];

    // Filtrar solo los que están dentro del barrio
    const equipamientosDentro = equipamientos.filter(eq => {
      const point = L.latLng(eq.coords[0], eq.coords[1]);
      return L.polygon([barrio.geometry.coordinates[0]]).contains(point);
    });

    // Añadir marcadores
    equipamientosDentro.forEach(eq => {
      const icon = icons[eq.tipo] || icons.Parque;
      const marker = L.marker(eq.coords, { icon }).addTo(map);
      marker.bindPopup(`
        <strong>${eq.nombre}</strong><br>
        <strong>Tipo:</strong> ${eq.tipo}<br>
        <em>${eq.info}</em>
      `);
    });

    // Centrar el mapa en el barrio
    map.fitBounds(barrioBounds, {
      padding: [50, 50],
      maxZoom: 16
    });
  })
  .catch(error => {
    console.error('Error al cargar el polígono del barrio:', error);
    alert('No se pudo cargar el barrio.');
  });

// Íconos personalizados
const icons = {
  Parque: L.icon({
    iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  Salud: L.divIcon({ html: '🏥', className: 'custom-icon' }),
  Educación: L.divIcon({ html: '🏫', className: 'custom-icon' }),
  Religión: L.divIcon({ html: '⛪', className: 'custom-icon' }),
  Transporte: L.divIcon({ html: '🚌', className: 'custom-icon' }),
  Cultura: L.divIcon({ html: '🏛️', className: 'custom-icon' })
};

// Función para copiar coordenadas
function copiarCoordenadas(lat, lng) {
  const coords = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  navigator.clipboard.writeText(coords)
    .then(() => {
      alert(`✅ Coordenadas copiadas:\n${coords}`);
    })
    .catch(err => {
      alert('❌ No se pudo copiar. Usa un navegador moderno o localhost.');
    });
}