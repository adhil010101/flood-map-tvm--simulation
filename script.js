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
const ROUTES = {
  "neyyatinkara-airport": {
    start: [8.3986, 77.0806], // Neyyattinkara
    end: [8.4826, 76.9203],   // Trivandrum Airport
    floodSegment: [           // Simulated flooded section
      [8.4500, 76.9500],
      [8.4600, 76.9400],
      [8.4700, 76.9300]
    ]
  }
};

function handleRoute() {
  markerGroup.clearLayers(); // Clear old routes
  map.eachLayer(layer => {
    if (layer instanceof L.Polyline && !layer._leaflet_id.toString().startsWith("base")) {
      map.removeLayer(layer);
    }
  });

  const selected = document.getElementById("route").value;
  if (!selected || !ROUTES[selected]) return;

  const route = ROUTES[selected];
  const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImViOTBkMjI4ZGUyNDRkMzg5MGU1ZWVkNjU0MDU0Y2MzIiwiaCI6Im11cm11cjY0In0="; // 👈 Replace this

  // Show original route
  getORSRoute(route.start, route.end, "blue", apiKey, () => {
    // Then simulate flood
    simulateFlood(route.floodSegment);
    
    // Then show alternate route
    getORSRoute(route.start, route.end, "green", apiKey, route.floodSegment);
  });

  // Add markers
  L.marker(route.start).bindPopup("Start").addTo(markerGroup);
  L.marker(route.end).bindPopup("Destination").addTo(markerGroup);
}

function getORSRoute(start, end, color, apiKey, avoidCoords = null) {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;
  const body = {
    coordinates: [start, end]
  };

  if (avoidCoords && Array.isArray(avoidCoords)) {
    body.avoid_polygons = {
      type: "Polygon",
      coordinates: [[...avoidCoords, avoidCoords[0]]] // Loop it back
    };
  }

  fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(res => res.json())
  .then(data => {
    const coords = data.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
    L.polyline(coords, { color: color, weight: 5 }).addTo(map)
      .bindPopup(color === "blue" ? "Original Route" : "Alternate Route");
  });
}

function simulateFlood(segment) {
  L.polyline(segment, { color: "red", weight: 6 })
    .addTo(map)
    .bindPopup("Flooded Segment");
}


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

