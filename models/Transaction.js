import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema({
    amount: {type: Number, required: true},
    type: {type: String, enum:['income', 'expense'], required: true},
    category: {type: String, required: true},
    date: {type: Date, default: Date.now},
    description: String,
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true});

export default mongoose.model('Transaction', TransactionSchema);