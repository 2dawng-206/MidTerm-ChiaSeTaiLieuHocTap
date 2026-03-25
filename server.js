require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const documentRoutes = require('./routes/document');
const userRoutes = require('./routes/user');
const subjectRoutes = require('./routes/subject');
const app = express();

// Thay đổi PORT để linh hoạt khi deploy
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);



mongoose
    .connect(process.env.MONGO_URI) // Dùng biến từ file .env
    .then(() => {
        console.log('Database connected successfully!');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });