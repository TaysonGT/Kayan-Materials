import express from 'express';
import { myDataSource } from './app-data-source';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import BodyParser from 'body-parser';
import dotenv from 'dotenv';
import materialRouter from './routes/material.router';
import supplierRouter from './routes/supplier.router';
import transactionRouter from './routes/transaction.router';
import supplierMaterialRouter from './routes/supplier-material.router';
import invoiceRouter from './routes/invoice.router';

// Load environment variables
dotenv.config();

// Initializing App
const app = express()

// Configure port and environment
const PORT = process.env.PORT || '5000';
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS configuration - allow frontend URL
const allowedOrigins = NODE_ENV === 'production' 
  ? FRONTEND_URL 
  : true; // Allow all origins in development

// Middlewares 
app.use(express.json())
app.use(cookieParser())
app.use(BodyParser.json())
app.use(cors({
    credentials: true,
    origin: allowedOrigins,
    methods: ["POST", "GET", "DELETE", "PUT"]
}))
app.use(express.urlencoded({
    extended: true
}))

// Routes - all API routes prefixed with /api for clear separation
const API_PREFIX = '/api'

// app.use(`/auth`, authRouter)
// app.use(auth)
app.use(`${API_PREFIX}/materials`, materialRouter)
app.use(`${API_PREFIX}/suppliers`, supplierRouter)
app.use(`${API_PREFIX}/supplier-materials`, supplierMaterialRouter)
app.use(`${API_PREFIX}/transactions`, transactionRouter)
app.use(`${API_PREFIX}/invoices`, invoiceRouter)

// Server Running
myDataSource
.initialize() 
.then(()=>{
    app.listen(parseInt(PORT),'0.0.0.0', () => {
        console.log(`Server running at http://localhost:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
        console.log(`CORS Origin: ${allowedOrigins}`);
    });
    console.log("Data Source Has Been Initialized!")
}).catch((err)=>{
    console.error("Error during Data Source initialization:", err)
})
