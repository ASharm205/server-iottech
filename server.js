const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Joi = require('joi');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || '';

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '_');
    const unique = `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    cb(null, `${base}_${unique}${ext}`);
  }
});
const upload = multer({ storage });

// mongodb connection
// Improve connection diagnostics and timeouts for Render
mongoose.set('bufferCommands', false);
let dbStatus = 'disconnected';
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 20000,
    maxPoolSize: 10,
  })
    .then(() => { dbStatus = 'connected'; console.log('MongoDB connected'); })
    .catch((err) => {
      dbStatus = 'error';
      console.error('MongoDB error:', err.message);
    });
} else {
  console.warn('MONGODB_URI not set. Skipping DB connection.');
}

// File-based persistence fallback (when MongoDB is not connected)
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'casestudies.json');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '[]', 'utf8');

function readFileStore() {
  try {
    const raw = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeFileStore(items) {
  fs.writeFileSync(dataFile, JSON.stringify(items, null, 2), 'utf8');
}

function genId() {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Mongoose model: CaseStudy
const caseStudySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  industry: { type: String, required: true, trim: true },
  imageUrl: { type: String },
}, { timestamps: true });
const CaseStudy = mongoose.models.CaseStudy || mongoose.model('CaseStudy', caseStudySchema);

// joi validation
const caseStudyJoi = Joi.object({
  title: Joi.string().min(2).max(120).required(),
  description: Joi.string().min(10).max(5000).required(),
  industry: Joi.string().min(2).max(120).required(),
});

// data - IOTTECH Smart Home Devices
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

// slideshow data
const slides = [
  {
    id: 1,
    title: "Innovative IoT Solutions",
    description: "Transform your business with cutting-edge technology",
    emoji: "💡"
  },
  {
    id: 2,
    title: "Expert Software Development",
    description: "Custom applications tailored to your needs",
    emoji: "💻"
  },
  {
    id: 3,
    title: "Strategic Management Consulting",
    description: "Optimize operations and drive growth",
    emoji: "📊"
  }
];

// services data
const services = [
  {
    id: 1,
    title: "IoT Solutions",
    description: "Custom IoT implementations for smart homes and enterprises",
    icon: "🏠"
  },
  {
    id: 2,
    title: "Software Development",
    description: "Full-stack development services for web and mobile applications",
    icon: "💻"
  },
  {
    id: 3,
    title: "Management Consulting",
    description: "Strategic consulting to optimize your operations",
    icon: "📈"
  }
];

// routes
// health status
app.get('/health', (req, res) => {
  res.json({ status: 'ok', port: PORT, db: dbStatus });
});

//  debug endpoint to inspect connection state
app.get('/debug/db', (req, res) => {
  res.json({
    status: dbStatus,
    readyState: mongoose.connection.readyState, 
    name: mongoose.connection?.name,
  });
});

// get all devices
app.get('/api/devices', (req, res) => {
  res.json(devices);
});

// get device by ID
app.get('/api/devices/:id', (req, res) => {
  const device = devices.find(d => d.id === parseInt(req.params.id));
  if (!device) {
    return res.status(404).json({ message: 'Device not found' });
  }
  res.json(device);
});

// get devices by type
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

// get devices by status
app.get('/api/status/:status', (req, res) => {
  const status = req.params.status;
  const filteredDevices = devices.filter(d => 
    d.status.toLowerCase() === status.toLowerCase()
  );
  res.json(filteredDevices);
});

// get slides for slideshow
app.get('/slides', (req, res) => {
  res.json(slides);
});

// get services
app.get('/services', (req, res) => {
  res.json(services);
});

// crud: CaseStudies
app.get('/api/casestudies', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const items = await CaseStudy.find().sort({ createdAt: -1 });
      return res.json(items);
    }
    const items = readFileStore();
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'server_error', message: err.message });
  }
});

app.post('/api/casestudies', upload.single('image'), async (req, res) => {
  try {
    const { error, value } = caseStudyJoi.validate(req.body);
    if (error) return res.status(400).json({ error: 'validation_error', message: error.message });

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    if (mongoose.connection.readyState === 1) {
      const created = await CaseStudy.create({ ...value, imageUrl });
      return res.status(201).json(created);
    }
    const items = readFileStore();
    const now = new Date().toISOString();
    const created = { _id: genId(), ...value, imageUrl, createdAt: now, updatedAt: now };
    items.push(created);
    writeFileStore(items);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'server_error', message: err.message });
  }
});

app.put('/api/casestudies/:id', upload.single('image'), async (req, res) => {
  try {
    const { error, value } = caseStudyJoi.validate(req.body);
    if (error) return res.status(400).json({ error: 'validation_error', message: error.message });

    const id = req.params.id;
    if (mongoose.connection.readyState === 1) {
      const existing = await CaseStudy.findById(id);
      if (!existing) return res.status(404).json({ error: 'not_found', message: 'CaseStudy not found' });

      let imageUrl = existing.imageUrl;
      if (req.file) {
        if (imageUrl && imageUrl.startsWith('/uploads/')) {
          const oldPath = path.join(__dirname, imageUrl);
          fs.access(oldPath, fs.constants.F_OK, (e) => { if (!e) fs.unlink(oldPath, () => {}); });
        }
        imageUrl = `/uploads/${req.file.filename}`;
      }

      existing.title = value.title;
      existing.description = value.description;
      existing.industry = value.industry;
      existing.imageUrl = imageUrl;
      await existing.save();
      return res.json(existing);
    }

    const items = readFileStore();
    const idx = items.findIndex(i => i._id === id);
    if (idx === -1) return res.status(404).json({ error: 'not_found', message: 'CaseStudy not found' });

    let imageUrl = items[idx].imageUrl;
    if (req.file) {
      if (imageUrl && imageUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, imageUrl);
        fs.access(oldPath, fs.constants.F_OK, (e) => { if (!e) fs.unlink(oldPath, () => {}); });
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }

    items[idx] = {
      ...items[idx],
      title: value.title,
      description: value.description,
      industry: value.industry,
      imageUrl,
      updatedAt: new Date().toISOString(),
    };
    writeFileStore(items);
    res.json(items[idx]);
  } catch (err) {
    res.status(500).json({ error: 'server_error', message: err.message });
  }
});

app.delete('/api/casestudies/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.connection.readyState === 1) {
      const existing = await CaseStudy.findById(id);
      if (!existing) return res.status(404).json({ error: 'not_found', message: 'CaseStudy not found' });
      if (existing.imageUrl && existing.imageUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, existing.imageUrl);
        fs.access(oldPath, fs.constants.F_OK, (e) => { if (!e) fs.unlink(oldPath, () => {}); });
      }
      await existing.deleteOne();
      return res.json({ success: true });
    }
    const items = readFileStore();
    const idx = items.findIndex(i => i._id === id);
    if (idx === -1) return res.status(404).json({ error: 'not_found', message: 'CaseStudy not found' });
    const imageUrl = items[idx].imageUrl;
    if (imageUrl && imageUrl.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, imageUrl);
      fs.access(oldPath, fs.constants.F_OK, (e) => { if (!e) fs.unlink(oldPath, () => {}); });
    }
    items.splice(idx, 1);
    writeFileStore(items);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'server_error', message: err.message });
  }
});

// serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// start server
app.listen(PORT, () => {
  console.log(`IoT Tech Server running on http://localhost:${PORT}`);
});
