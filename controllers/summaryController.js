import Transaction from "../models/Transaction.js";

export const getDashboardSummary = async (req, res) => {
    try{
        const stats = await Transaction.aggregate([
            {
                $group: {
                    _id: null,
                    totalIncome: {
                        $sum: {$cond: [{$eq: ["$type", "income"]}, "$amount", 0]}
                    },
                    totalExpenses: {
                        $sum: {$cond: [{$eq: ["$type", "expense"]}, "$amount", 0]}
                    },
                    count: {$sum: 1}
                }
            },
            {
                $project: {
                    _id: 0,
                    totalIncome: 1,
                    totalExpenses: 1,
                    netBalance: { $subtract: ["$totalIncome", "$totalExpenses"] },
                    transactionCount: "$count"
                }
            }
        ]);
        const categoryStats = await Transaction.aggregate([
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        res.json({
            summary: stats[0] || { totalIncome: 0, totalExpenses: 0, netBalance: 0 },
            categories: categoryStats
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}