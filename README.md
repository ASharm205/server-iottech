# IoTTech Server

A Node.js/Express server that provides a REST API for services at IOTTech. This server serves device data, case studies CRUD with optional image uploads, and includes a simple web UI to explore the available API endpoints.


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
├── uploads/               # Uploaded images (served at /uploads)
└── data/
  └── casestudies.json   # JSON store used when MongoDB is not connected
└── README.md
```
