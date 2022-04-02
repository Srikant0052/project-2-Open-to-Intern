const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const internSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,   // validate email using regex
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        match: /^(\+\d{1,3}[- ]?)?\d{10}$/,   // validate mobile number using regex
        unique: true,
        trim: true
    },
    collegeId: {
        type: ObjectId,
        ref: 'College',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true })

module.exports = mongoose.model('Intern', internSchema);