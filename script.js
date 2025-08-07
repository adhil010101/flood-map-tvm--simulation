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
