console.log("STEP 1: Starting server...");
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
console.log("STEP 2: Imports done");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we always load `backend/.env` regardless of the current working directory.
dotenv.config({ path: path.join(__dirname, '.env') });

console.log("STEP 3: Env loaded");

const app = express();
const { default: aiRouter } = await import('./routes/aiRoutes.js');
const { default: connectCloudinary } = await import('./configs/cloudinary.js');
await connectCloudinary()

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/health', (req, res) => res.send('Server is Live'));

// Protect only API routes. Frontend static assets must stay public.
app.use('/api/ai', requireAuth(), aiRouter);

// In production, serve the built React app from `client/dist`.
const distPath = process.env.FRONTEND_DIST_DIR || path.join(__dirname, '..', 'client', 'dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // SPA fallback: support BrowserRouter direct links.
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("STEP 4: Server is Running on Port", PORT);
});