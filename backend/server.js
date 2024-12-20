require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/User');
const bot = require('./bot');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// API: Get all users and their tasks
app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// API: Add a task to a user
app.post('/api/users/:chatId/tasks', async (req, res) => {
    const { chatId } = req.params;
    const { task } = req.body;

    let user = await User.findOne({ chatId });
    if (!user) {
        user = new User({ chatId, tasks: [] });
    }
    user.tasks.push(task);
    await user.save();
    res.json(user);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
