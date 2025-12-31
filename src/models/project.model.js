import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    users: [{   
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
});

const project = mongoose.model('project', projectSchema);
export default project;