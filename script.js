var map = L.map('map', {
    maxBounds: [
        [8.35, 76.75],
        [8.65, 77.1]
    ],
    minZoom: 10,
    maxZoom: 18
}).setView([8.45, 76.9], 12);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add icons
var markerGroup = L.layerGroup().addTo(map);
// Create map centered at Trivandrum
var map = L.map('map', {
    maxBounds: [
        [8.45, 76.85], // Southwest corner
        [8.65, 77.00]  // Northeast corner
    ],
    minZoom: 12,
    maxZoom: 18
}).setView([8.5241, 76.9366], 13);

// Add map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Load data from JSON and draw on map
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(road => {
      let color = road.status === "flooded" ? "red" : "green";
      L.polyline(road.coordinates, { color: color, weight: 6 })
        .bindPopup(`${road.road} - ${road.status}`)
        .addTo(map);
    });
  });

function getRoute(start, end) {
  const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImViOTBkMjI4ZGUyNDRkMzg5MGU1ZWVkNjU0MDU0Y2MzIiwiaCI6Im11cm11cjY0In0='; // Replace with your real key

  const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${apiKey}`;
  const body = {
    coordinates: [start, end]
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(response => response.json())
  .then(json => {
    const coords = json.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
    L.polyline(coords, { color: 'blue', weight: 4 }).addTo(map)
      .bindPopup("Suggested Route").openPopup();
  });
}

// Start and End Coordinates (inside Trivandrum)
let start = [76.9366, 8.5241]; // Longitude, Latitude
let end = [76.9400, 8.5260];
getRoute(start, end);

