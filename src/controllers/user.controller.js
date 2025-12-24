import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {config} from '../config/env.js';
import { authUser } from '../middleware/auth.middleware.js';

export const createUser = async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    if(password.length < 6){
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if(existingUser){
            return res.status(400).json({success: false, message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign({ 
            email: user.email}, 
            config.Jwt_secret, 
            { expiresIn: "1d" }
        );

        res.cookie("token", token);

        return res.status(201).json({success: true, message: "User registered successfully", 
            user:{
                email: user.email,
                id: user._id
            },
            token
        });


    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({success: false, message: "All fields are required"});
    }
    try {
        const user = await userModel.findOne({ email }).select('+password');
        if(!user){
            return res.status(400).json({success: false, message: "User does not exist"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({success: false, message: "Invalid credentials"});
        }

        const token = jwt.sign({ 
            email: user.email}, 
            config.Jwt_secret, 
            { expiresIn: "1d" }
        );

        res.cookie("token", token);

        return res.status(200).json({success: true, message: "User logged in successfully",
            user:{ 
                id: user._id,
                email: user.email 
            }, 
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const getUserProfile = async (req, res) => {
    console.log(req.user);
    res.status(200).json({ success: true, user: req.user });
}