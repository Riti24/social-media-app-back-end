import { configDotenv } from 'dotenv';
import express from 'express';
import cors from 'cors';

const app= express();

app.use(express.json());
app.use(cors());

app.listen(PORT,()=>console.log(`Listening on Port${PORT}`));