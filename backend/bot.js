require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const User = require('./models/User'); // Import User model

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Handle /start command
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.chat.first_name || 'User';

    // Check if user exists, if not, create a new record
    let user = await User.findOne({ chatId });
    if (!user) {
        user = new User({ chatId, tasks: [] });
        await user.save();
    }

    bot.sendMessage(chatId, `Hello, ${userName}! Welcome to the Persist Ventures Bot.`);
});

// Handle /addtask command
bot.onText(/\/addtask (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const task = match[1]; // Extract task from command

    const user = await User.findOne({ chatId });
    if (user) {
        user.tasks.push(task);
        await user.save();
        bot.sendMessage(chatId, `Task added: "${task}"`);
    } else {
        bot.sendMessage(chatId, 'Please start the bot first using /start.');
    }
});

// Handle /list tasks command
bot.onText(/\/listtasks/, async (msg) => {
    const chatId = msg.chat.id;
    const user = await User.findOne({ chatId });

    if (user && user.tasks.length > 0) {
        const taskList = user.tasks.map((task, index) => `${index + 1}. ${task}`).join('\n');
        bot.sendMessage(chatId, `Your tasks:\n${taskList}`);
    } else {
        bot.sendMessage(chatId, 'You have no tasks. Add one using /addtask <task>.');
    }
});

// Handle /clear tasks command
bot.onText(/\/cleartasks/, async (msg) => {
    const chatId = msg.chat.id;
    const user = await User.findOne({ chatId });

    if (user) {
        user.tasks = [];
        await user.save();
        bot.sendMessage(chatId, 'All tasks cleared.');
    } else {
        bot.sendMessage(chatId, 'Please start the bot first using /start.');
    }
});

module.exports = bot;
