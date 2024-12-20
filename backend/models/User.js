const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    chatId: { type: String, required: true },
    tasks: [{ type: String }], // Array of tasks
});

module.exports = mongoose.model('User', userSchema);
