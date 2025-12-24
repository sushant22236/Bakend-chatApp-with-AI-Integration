import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const authUser = async (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, config.Jwt_secret);
        // const user = await userModel.findOne({ email: decoded.email }).select('-password');
        // if (!user) {
        //     return res.status(401).json({ success: false, message: "User not found" });
        // }
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};