import Transaction from "../models/Transaction.js";

export const getDashboardSummary = async (req, res) => {
    try {
        const stats = await Transaction.aggregate([
            {
                $group: {
                    _id: null,
                    totalIncome: {
                        $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] }
                    },
                    totalExpenses: {
                        $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] }
                    },
                    count: { $sum: 1 }
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
        const monthlyTrends = await Transaction.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$date" }, year: { $year: "$date" } },
                    monthlyIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                    monthlyExpenses: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } }
        ]);
        res.json({
            summary: stats[0] || { totalIncome: 0, totalExpenses: 0, netBalance: 0 },
            categories: categoryStats,
            trends: monthlyTrends
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}