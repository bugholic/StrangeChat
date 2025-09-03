chatwithoutfear
 
Deployment
 
Frontend (Vercel)
 
- Framework preset: Vite
- Build command: npm run build
- Output directory: dist
- Env var: VITE_SOCKET_SERVER_URL set to your server URL (e.g., https://your-app.onrender.com)
 
Server (separate repo or server/ folder)
 
- Location: server/ (contains its own package.json and server.js)
- Start command: npm start
- PORT is provided by the platform
- Env var: CORS_ORIGIN set to your frontend origin (e.g., https://your-frontend.vercel.app)
 
Local Development
 
- Server: npm run dev:server (port 3001) from project root
- Web: npm run dev (Vite). Websocket proxy is configured in vite.config.ts
 
Environment Variables
 
- VITE_SOCKET_SERVER_URL: The Socket.IO server URL used by the client in production
- CORS_ORIGIN: Allowed origin for Socket.IO CORS on the server