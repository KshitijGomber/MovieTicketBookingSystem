const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String, sparse: true },
  isVerified: { type: Boolean, default: false },
  profilePicture: { type: String }
}, { timestamps: true });

// Hash password before saving if password is modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false; // If no password set (OAuth user)
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 