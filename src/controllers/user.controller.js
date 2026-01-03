import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {config} from '../config/env.js';
import { authUser } from '../middleware/auth.middleware.js';
import redisClient from '../services/redis.service.js';

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

export const logout = async (req, res) => {
    try{
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        redisClient.set(token, 'logout', 'EX', 24 * 60 * 60);

        res.status(200).json({ success: true, message: "User logged out successfully" });
    }catch(error){
        console.error('Logout error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        // Find logged-in user
        const loggedInUser = await userModel.findOne({
            email: req.user.email
        });

        if (!loggedInUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Get all users except logged-in user
        const users = await userModel.find({
            _id: { $ne: loggedInUser._id }
        });

        return res.status(200).json({
            users
        });

    } catch (err) {
        console.error(err);
        return res.status(400).json({
            error: err.message
        });
    }
};
