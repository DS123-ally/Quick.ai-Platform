console.log("STEP 1: Starting server...");
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express';
console.log("STEP 2: Imports done");
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
console.log("STEP 3: Router loaded");

const app = express();
await connectCloudinary()

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => res.send('Server is Live'));

app.use(requireAuth());
app.use('/api/ai', aiRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("STEP 4: Server is Running on Port", PORT);
});