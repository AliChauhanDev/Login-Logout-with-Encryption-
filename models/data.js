const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const dataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pass: { type: String, required: true },
});

// Middleware to hash password before saving
dataSchema.pre('save', async function (next) {
  if (!this.isModified('pass')) return next(); 
  try {
    const salt = await bcrypt.genSalt(10); 
    this.pass = await bcrypt.hash(this.pass, salt); 
    next();
  } catch (err) {
    next(err);
  }
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
