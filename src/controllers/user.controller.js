import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {config} from '../config/env.js';

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

        //res.cookie("token", token);

        return res.status(201).json({success: true, message: "User registered successfully", 
            user:{
                email: user.email,
                id: user._id
            },
            token
        });


    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}