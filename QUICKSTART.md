# Quick Start Guide - IoT Tech Server

## 📋 Setup Instructions

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Locally
```bash
npm run dev
```

Your server will be available at: `http://localhost:3001`

### Step 3: Test the API
Open your browser and visit `http://localhost:3001` to see:
- API documentation
- Interactive API testing interface
- Beautiful UI to explore endpoints

## 🌐 Deploying to Render.com

### Prerequisites
- GitHub account with this repository pushed
- Render.com account

### Deployment Steps

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Initial server setup"
   git push origin main
   ```

2. **Create Render Web Service**
   - Go to https://render.com
   - Click "Create New" → "Web Service"
   - Connect your GitHub account and select this repository

3. **Configure Build Settings**
   - **Name**: iottech-server (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free tier is fine for this project

4. **Deploy**
   - Click "Create Web Service"
   - Wait for the build and deployment to complete
   - Your server will have a URL like: `https://iottech-server.onrender.com`

5. **Update Your React Client**
   Update your React app's API calls:
   ```javascript
   const API_URL = 'https://iottech-server.onrender.com';
   
   // Example fetch
   fetch(`${API_URL}/api/devices`)
     .then(res => res.json())
     .then(data => console.log(data));
   ```

## 📡 Available API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/devices` | Get all devices |
| GET | `/api/devices/:id` | Get device by ID (1-6) |
| GET | `/api/devices/type/:type` | Filter by type |
| GET | `/api/status/:status` | Filter by status |

## 🧪 Testing in Browser

1. Visit `http://localhost:3001` (or your Render URL)
2. Click on "Get All Devices" to test
3. Try different endpoints with the provided input fields
4. See JSON responses in the right panel

## 📝 Device Data Structure

Each device object contains:
```json
{
  "id": 1,
  "name": "Smart Thermostat",
  "type": "Temperature Control",
  "status": "online",
  "temperature": 72,
  "humidity": 45,
  "location": "Living Room",
  "image": "/images/thermostat.jpg"
}
```

## 🔧 Troubleshooting

**Port Already in Use**
- Change port in `server.js`: `const PORT = 3002;`
- Or kill the process using port 3001

**CORS Issues with React Client**
- The server has CORS enabled for all origins
- Make sure your client uses the full URL (not relative path)

**Images Not Loading**
- Images are served from `/public/images/`
- Ensure you're accessing them with the full path: `/images/filename.jpg`

## 📚 Next Steps

1. Customize the device data in `server.js` to match your needs
2. Add more endpoints as required
3. Connect your React frontend to consume the API
4. Deploy both client and server to production

---

For questions or issues, refer to the main README.md file.
