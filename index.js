import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Fintech backend running.");
});

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Successfully connected to DB");
    } catch(error) {
        console.log("Unable to connect to DB:", error.message);
        process.exit(1);
    }
};

app.use('/api/auth', authRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/summary', summaryRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server runnning on port ${PORT}`);
    });
});