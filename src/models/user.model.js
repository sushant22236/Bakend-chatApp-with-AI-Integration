import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minLength: [5, 'Email must be at least 5 characters long'],
    maxLength: [49, 'Email must be at most 255 characters long'],
  },
  password: {       
    type: String,
    required: true,
    select: false,
    minLength: [6, 'Password must be at least 6 characters long'],
    maxLength: [8, 'Password must be at most 8 characters long'],
  },  
})  

const User = mongoose.model('User', userSchema);

export default User;