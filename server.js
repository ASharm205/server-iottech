const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Data - IoT Smart Home Devices
const devices = [
  {
    id: 1,
    name: "Smart Thermostat",
    type: "Temperature Control",
    status: "online",
    temperature: 72,
    humidity: 45,
    location: "Living Room",
    image: "/images/thermostat.jpg"
  },
  {
    id: 2,
    name: "Smart Light",
    type: "Lighting",
    status: "online",
    brightness: 80,
    color: "warm",
    location: "Bedroom",
    image: "/images/light.jpg"
  },
  {
    id: 3,
    name: "Smart Door Lock",
    type: "Security",
    status: "online",
    locked: true,
    lastAccess: "2025-11-11 10:30 AM",
    location: "Front Door",
    image: "/images/lock.jpg"
  },
  {
    id: 4,
    name: "Smart Camera",
    type: "Security",
    status: "online",
    recording: true,
    resolution: "1080p",
    location: "Garage",
    image: "/images/camera.jpg"
  },
  {
    id: 5,
    name: "Smart Plug",
    type: "Power Control",
    status: "online",
    powerUsage: 45,
    unit: "watts",
    location: "Kitchen",
    image: "/images/plug.jpg"
  },
  {
    id: 6,
    name: "Motion Sensor",
    type: "Detection",
    status: "online",
    motionDetected: false,
    sensitivity: "high",
    location: "Hallway",
    image: "/images/sensor.jpg"
  }
];

// Routes

// GET all devices
app.get('/api/devices', (req, res) => {
  res.json(devices);
});

// GET device by ID
app.get('/api/devices/:id', (req, res) => {
  const device = devices.find(d => d.id === parseInt(req.params.id));
  if (!device) {
    return res.status(404).json({ message: 'Device not found' });
  }
  res.json(device);
});

// GET devices by type
app.get('/api/devices/type/:type', (req, res) => {
  const type = req.params.type;
  const filteredDevices = devices.filter(d => 
    d.type.toLowerCase() === type.toLowerCase()
  );
  if (filteredDevices.length === 0) {
    return res.status(404).json({ message: 'No devices found for this type' });
  }
  res.json(filteredDevices);
});

// GET devices by status
app.get('/api/status/:status', (req, res) => {
  const status = req.params.status;
  const filteredDevices = devices.filter(d => 
    d.status.toLowerCase() === status.toLowerCase()
  );
  res.json(filteredDevices);
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`IoT Tech Server running on http://localhost:${PORT}`);
});
