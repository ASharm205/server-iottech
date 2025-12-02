const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const multer = require('multer');
const fs = require('fs');
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
let dbStatus = 'disconnected';
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => { dbStatus = 'connected'; console.log('MongoDB connected'); })
    .catch((err) => { dbStatus = 'error'; console.error('MongoDB error:', err.message); });
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

// Slideshow data
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

// Services data
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

// Routes
// Health status
app.get('/health', (req, res) => {
  res.json({ status: 'ok', port: PORT, db: dbStatus });
});

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

// GET slides for slideshow
app.get('/slides', (req, res) => {
  res.json(slides);
});

// GET services
app.get('/services', (req, res) => {
  res.json(services);
});

// CRUD: CaseStudies
app.get('/api/casestudies', async (req, res) => {
  try {
    const items = await CaseStudy.find().sort({ createdAt: -1 });
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
    const created = await CaseStudy.create({ ...value, imageUrl });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'server_error', message: err.message });
  }
});

app.put('/api/casestudies/:id', upload.single('image'), async (req, res) => {
  try {
    const { error, value } = caseStudyJoi.validate(req.body);
    if (error) return res.status(400).json({ error: 'validation_error', message: error.message });

    const existing = await CaseStudy.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'not_found', message: 'CaseStudy not found' });

    let imageUrl = existing.imageUrl;
    if (req.file) {
      // delete old file if exists
      if (imageUrl && imageUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, imageUrl);
        fs.access(oldPath, fs.constants.F_OK, (e) => {
          if (!e) fs.unlink(oldPath, () => {});
        });
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }

    existing.title = value.title;
    existing.description = value.description;
    existing.industry = value.industry;
    existing.imageUrl = imageUrl;
    await existing.save();
    res.json(existing);
  } catch (err) {
    res.status(500).json({ error: 'server_error', message: err.message });
  }
});

app.delete('/api/casestudies/:id', async (req, res) => {
  try {
    const existing = await CaseStudy.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'not_found', message: 'CaseStudy not found' });

    // delete file if exists
    if (existing.imageUrl && existing.imageUrl.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, existing.imageUrl);
      fs.access(oldPath, fs.constants.F_OK, (e) => {
        if (!e) fs.unlink(oldPath, () => {});
      });
    }

    await existing.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'server_error', message: err.message });
  }
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`IoT Tech Server running on http://localhost:${PORT}`);
});
