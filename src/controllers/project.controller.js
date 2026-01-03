import projectModel from '../models/project.model.js';
import userModel from '../models/user.model.js';    
import * as projectService from '../services/project.service.js';
import {validationResult} from 'express-validator';

export const createProjectController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });

        if (!loggedInUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userId = loggedInUser._id;
        const newProject = await projectService.createProject({ name, userId });

        return res.status(201).json({ success: true, message: 'Project created successfully', project: newProject });
    } catch (error) {
        console.error('Error creating project:', error);
        return res.status(400).json({ error: error.message });
    }
}

export const getAllProjectsController = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({ email: req.user.email });

        if (!loggedInUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userId = loggedInUser._id;
        const allProjects = await projectService.getAllProjects({ userId });

        return res.status(200).json({ success: true, projects: allProjects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return res.status(400).json({ error: error.message });
    }
}

export const addUsersToProjectController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { projectId, users } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });

        const project = await projectService.addUsersToProject({ 
            projectId, 
            users, 
            userId: loggedInUser._id 
        });

        return res.status(200).json({ success: true, message: 'Users added to project successfully', project });
    }catch (error) {
        console.error('Error adding users to project:', error);
        return res.status(400).json({ error: error.message });
    }
}

    