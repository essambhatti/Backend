📺 VideoStream API
==================

**VideoStream** is a backend-only REST API designed for a modern video sharing platform. It includes features such as uploading videos, liking and commenting, managing playlists, tweeting updates, and a channel dashboard for analytics.

🛠️ Tech Stack
--------------

*   **Node.js** – JavaScript runtime
    
*   **Express.js** – Backend framework
    
*   **MongoDB** – NoSQL database
    
*   **Mongoose** – ODM for MongoDB
    
*   **Multer** – Handling file uploads
    
*   **Cloudinary** – Media storage and CDN
    
*   **Dotenv** – Environment variable management
    
*   **Railway** – Deployment platform
    

✨ Features
----------

*   Upload and store videos with metadata and thumbnails
    
*   Like and unlike videos and tweets
    
*   Post tweets and comment on videos
    
*   Create and manage video playlists
    
*   View channel dashboard for personal stats (views, likes, uploads, etc.)
    

🚀 Deployment
-------------

The API is deployed using **Railway**.**Public Base URL**:[https://videostream-production-3b93.up.railway.app/](https://videostream-production-3b93.up.railway.app/)

📮 How to Test the API with Postman
-----------------------------------

### ▶️ Using Public URL

1.  Open Postman
    
2.  Use the base URL: [https://videostream-production-3b93.up.railway.app/](https://videostream-production-3b93.up.railway.app/)
    
3.  GET [https://videostream-production-3b93.up.railway.app/](https://videostream-production-3b93.up.railway.app/)api/videos
    

You can test other endpoints like:

*   POST /api/videos/upload
    
*   GET /api/tweets
    
*   POST /api/comments/:videoId
    
*   GET /api/dashboard/:channelId
    

> Include headers or tokens if required by specific routes.

💻 How to Run Locally
---------------------

### 1\. Clone the Repository

`   git clone https://github.com/essambhatti/videostream.git  cd videostream   `

### 2\. Install Dependencies

`   npm install   `

### 3\. Set Up Environment Variables

Create a .env file in the root directory and add:
`   PORT=8000  MONGO_URI=your_mongodb_connection_string  CLOUDINARY_CLOUD_NAME=your_cloud_name  CLOUDINARY_API_KEY=your_key  CLOUDINARY_API_SECRET=your_secret  JWT_SECRET=your_jwt_secret   `

### 4\. Start the Server

`   npm run dev   `

Your API will be available at:http://localhost:8000

📂 Example API Routes
---------------------

`GET /api/videos` — Fetch all videos  
`POST /api/videos/upload` — Upload a new video  
`GET /api/tweets` — Get tweets  
`POST /api/tweets` — Create a new tweet  
`POST /api/comments/:videoId` — Comment on a video  
`GET /api/playlists` — Fetch user playlists  
`POST /api/playlists` — Create a playlist  
`POST /api/likes/video/:videoId` — Like a video  
`GET /api/dashboard/:channelId` — Get channel analytics

🙋 Author
---------

**Essam Bhatti**

Open to feedback, suggestions, and contributions!
