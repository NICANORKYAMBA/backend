const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: 'No Description' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  originalDueDate: { type: Date, required: true },
  importance: { type: String, required: true, enum: ['less important', 'important', 'very important'] },
  completed: { type: Boolean, default: false },
  completedDate: { type: Date, default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;