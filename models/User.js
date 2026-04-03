import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['Viewer', 'Analyst', 'Admin'], default: 'Viewer'},
    status: {type: String, enum: ['active', 'inactive'], default: 'active'}
}, {timestamps: true});

UserSchema.pre('save', async function (){
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateToken = function(){
    return jwt.sign(
        {id: this._id, role: this.role},
        process.env.JWT_SECRET,
        {expiresIn: '10d'}
    );
};

export default mongoose.model('User', UserSchema);