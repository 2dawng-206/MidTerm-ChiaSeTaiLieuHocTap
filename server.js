const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const documentRoutes = require('./routes/document');
const userRoutes = require('./routes/user');
const subjectRoutes = require('./routes/subject');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);

mongoose
	.connect('mongodb://localhost:27017/document-sharing')
	.then(() => {
		console.log('Database connected');
		app.listen(3000, () => {
			console.log('Server running on port 3000');
		});
	})
	.catch(err => {
		console.log(err);
	});