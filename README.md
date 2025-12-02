# IoTTech Server

A Node.js/Express server that provides a REST API for services at IOTTech. This server serves device data and includes a beautiful web interface to explore the available API endpoints.


```
server-iottech/
├── server.js              # Main Express server
├── package.json           # Project dependencies
├── public/
│   ├── index.html         # API documentation UI
│   ├── styles.css         # Styling for the UI
│   └── images/            # Device icons (SVG)
│       ├── thermostat.jpg
│       ├── light.jpg
│       ├── lock.jpg
│       ├── camera.jpg
│       ├── plug.jpg
│       └── sensor.jpg
└── README.md
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ASharm205/server-iottech.git
cd server-iottech
```

2. Install dependencies:
```bash
npm install
```

## Running Locally

Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### Get All Devices
- **Method**: GET
- **Endpoint**: `/api/devices`
- **Description**: Returns all connected IoT devices
- **Response**: Array of device objects

### Get Device by ID
- **Method**: GET
- **Endpoint**: `/api/devices/:id`
- **Description**: Returns a specific device (IDs: 1-6)
- **Response**: Single device object

### Get Devices by Type
- **Method**: GET
- **Endpoint**: `/api/devices/type/:type`
- **Description**: Filter devices by type
- **Types**: "Temperature Control", "Lighting", "Security", "Power Control", "Detection"
- **Response**: Array of matching devices

### Get Devices by Status
- **Method**: GET
- **Endpoint**: `/api/status/:status`
- **Description**: Filter devices by status
- **Response**: Array of devices with specified status

## Deployment on Render.com

1. Push your code to GitHub
2. Create a new Web Service on Render.com
3. Connect your GitHub repository
4. Set the following:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Deploy!

## Connecting from Client

Update your React client to fetch from the server:

```javascript
// example API call from client
const fetchDevices = async () => {
  const response = await fetch('https://your-render-url.onrender.com/api/devices');
  const data = await response.json();
  setDevices(data);
};
```
