import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app= express();

app.use(express.json());
app.use(cors());

app.listen(process.env.PORT,()=>console.log(`Listening on Port ${process.env.PORT}`));