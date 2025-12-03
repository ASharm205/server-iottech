# IoTTech Server

A Node.js/Express server that provides a REST API for IoT devices and case studies with MongoDB persistence, Joi validation, and image uploads via multer.

## Live Demo

**GitHub Repository:** https://github.com/ASharm205/server-iottech

> **Note:** For live deployment, please use:
> - Clone and run locally (see Installation section below)
> - Or check Render deployment URL if provided separately

## 📁 Project Structure

```
server-iottech/
├── server.js              # Main Express server
├── package.json           # Project dependencies
├── .env                   # Environment variables (not committed)
├── .env.example           # Environment template
├── public/
│   ├── index.html         # API documentation UI
│   └── styles.css         # Styling
├── uploads/               # Uploaded images (served at /uploads)
└── data/
    └── casestudies.json   # JSON fallback store (when MongoDB disconnected)
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local installation or Atlas account)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ASharm205/server-iottech.git
   cd server-iottech
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**

   **Option A: Local MongoDB (Recommended for Development)**
   ```bash
   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb/brew/mongodb-community
   ```

   **Option B: MongoDB Atlas (Cloud)**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string

4. **Configure environment variables**
   ```bash
   # Create .env file
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   PORT=3001
   # For local MongoDB:
   MONGODB_URI=mongodb://127.0.0.1:27017/iottech
   
   # For Atlas (URL-encode password):
   # MONGODB_URI=mongodb+srv://username:<password>@cluster.mongodb.net/iottech?retryWrites=true&w=majority
   ```

5. **Start the server**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

6. **Verify it's running**
   ```bash
   curl http://localhost:3001/health
   # Should return: {"status":"ok","port":"3001","db":"connected"}
   ```

## 📡 API Endpoints

### Health & Status
- `GET /health` - Server health and database connection status
- `GET /debug/db` - Detailed database connection info

### IoT Devices
- `GET /api/devices` - List all devices
- `GET /api/devices/:id` - Get device by ID
- `GET /api/devices/type/:type` - Filter by device type
- `GET /api/status/:status` - Filter by status

### Case Studies (CRUD with MongoDB)
- `GET /api/casestudies` - List all case studies
- `POST /api/casestudies` - Create new case study (multipart/form-data)
- `PUT /api/casestudies/:id` - Update case study (multipart/form-data)
- `DELETE /api/casestudies/:id` - Delete case study

**Request Body (POST/PUT):**
- `title` (string, 2-120 chars, required)
- `description` (string, 10-5000 chars, required)
- `industry` (string, 2-120 chars, required)
- `image` (file, optional) - Uploaded via multipart form field `image`

**Example:**
```bash
curl -X POST http://localhost:3001/api/casestudies \
  -F "title=Smart Home Solution" \
  -F "description=IoT-enabled home automation system" \
  -F "industry=Residential" \
  -F "image=@/path/to/image.jpg"
```

### Additional Endpoints
- `GET /slides` - Get slideshow data
- `GET /services` - Get services list

## 🧪 Testing

```bash
# Health check
curl http://localhost:3001/health

# List case studies
curl http://localhost:3001/api/casestudies

# Create a case study
curl -X POST http://localhost:3001/api/casestudies \
  -F "title=Test Case" \
  -F "description=Testing MongoDB persistence" \
  -F "industry=Technology"

# Update case study (replace ID)
curl -X PUT http://localhost:3001/api/casestudies/<id> \
  -F "title=Updated Title" \
  -F "description=Updated description" \
  -F "industry=Technology"

# Delete case study
curl -X DELETE http://localhost:3001/api/casestudies/<id>
```

## 🔑 Features

- ✅ **MongoDB Integration**: Mongoose ODM with schema validation
- ✅ **Data Validation**: Joi validation for all mutations
- ✅ **Image Uploads**: Multer middleware with automatic cleanup
- ✅ **Persistent Storage**: MongoDB for production, JSON file fallback for development
- ✅ **CORS Enabled**: Cross-origin requests supported
- ✅ **Request Logging**: Morgan HTTP logger
- ✅ **Health Monitoring**: Built-in health and debug endpoints

## 🌐 Deployment (Render)

The app is deployed at: **https://server-iottech.onrender.com**

### Deploy Your Own

1. Push code to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Connect your repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - Add `MONGODB_URI` with your Atlas connection string
5. Deploy!

**Note:** On Render's free tier:
- Uploaded images are ephemeral (lost on restart/redeploy)
- MongoDB data persists if using Atlas
- Without Atlas, the server uses a JSON file fallback (also ephemeral)

## 📝 Notes for Grading

- **MongoDB Schema**: `CaseStudy` model with title, description, industry, imageUrl, timestamps
- **Validation**: Joi validates all POST/PUT requests
- **Image Handling**: Files uploaded via multer; old images automatically deleted on update/delete
- **Persistence**: Full CRUD operations persist to MongoDB when connected
- **Fallback Mode**: When MongoDB is unavailable, server uses `data/casestudies.json` for development/testing
- **Session Images**: Images work throughout the session but are ephemeral on Render free tier (as expected per assignment)

## 🔧 Troubleshooting

**"db":"error" in /health:**
- Ensure MongoDB is running: `brew services list` (macOS) or `sudo systemctl status mongod` (Linux)
- Check connection string in `.env`
- For Atlas: Ensure IP is whitelisted in Network Access

**Port already in use:**
```bash
lsof -ti tcp:3001 | xargs kill -9
npm start
```

**Images not displaying:**
- Check uploads directory exists: `ls -la uploads/`
- Verify file was uploaded: Check response `imageUrl` field
- Access directly: `http://localhost:3001/uploads/<filename>`
