import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';
import { connectDB } from './config/database';
import path from 'path';
// import authRoutes from './routes/authRoutes';
import warehouseRoutes from './routes/warehouseRoutes';

const app: Express = express();

// Middleware
// Middleware — use ONE configured CORS instance
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads/warehouses', express.static(path.join(process.cwd(), 'uploads/warehouses')));


// Connect to database
connectDB();

// Routes
// app.use('/api/auth', authRoutes);
app.use('/api/warehouses', warehouseRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
