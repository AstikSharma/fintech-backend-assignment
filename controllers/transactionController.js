import Transaction from '../models/Transaction.js';

export const createTransaction = async (req, res) => {
    const {amount, type, category, status, isRecurring, description} = req.body;
    if (amount <= 0){
        return res.status(400).json({ message: "Amount must be positive" });
    }
    try{
        const transaction = await Transaction.create({
            amount,
            type,
            category,
            status,
            isRecurring,
            description,
            createdBy: req.user._id
        });
        res.status(201).json(transaction);
    } catch(error) {
        res.status(400).json({message: error.message});
    }
};

export const getTransactions = async (req, res) => {
    try{
        const {type, category, startDate, endDate} = req.query;
        let query = {};
        if(type) query.type = type;
        if(category) query.category = category;
        if(startDate || endDate){
            query.date = {};
            if(startDate){
                query.date.$gte = new Date(startDate);
            }
            if (endDate) {
                query.date.$lte = new Date(endDate);
            }
        }
        const transactions = await Transaction.find(query).sort({date: -1}).populate('createdBy', 'name role');
        res.status(200).json(transactions);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

export const updateTransaction = async (req, res) => {
    try{
        const transaction = await Transaction.findById(req.params.id);
        if(!transaction){
            return res.status(404).json({message: "Transaction not found"});
        }
        if(req.body.amount !== undefined && req.body.amount <= 0){
            return res.status(400).json({ message: "Amount must be positive" });
        }
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        res.json( {message: "Updated successfully"});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

export const deleteTransaction = async (req, res) => {
    try{
        const transaction = await Transaction.findById(req.params.id);
        if(!transaction){
            return res.status(404).json({message: "Transaction not found"});
        }
        await transaction.deleteOne();
        res.json({message: "Transaction rmoved successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}