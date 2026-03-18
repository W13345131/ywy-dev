import Expense from '../../models/Expense_tracker/Expense.js'
import Income from '../../models/Expense_tracker/Income.js'
// isValidObjectId：检查一个值看起来是不是合法的 ObjectId 字符串（24位hex）或 ObjectId。
import mongoose, { isValidObjectId } from 'mongoose'


// 获取支出仪表盘数据
export const getExpenseDashboardData = async (req, res, next) => {
    try {
        // 获取用户 ID
        const userId = req.user._id
        // 将用户 ID 转换为 ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId)

        // 查询所有收入
        const totalIncomes = await Income.aggregate([
            {
                // $match：只保留当前用户的 income，过滤掉其他用户的 income
                $match: {
                    userId: userObjectId
                }
            },
            {
                // $group：把这些记录分成一组（_id: null 表示所有符合条件的当成一组）
                $group: {
                    _id: null,
                    // $sum: '$amount'：把每条 income 的 amount 相加
                    totalAmount: { $sum: '$amount' }
                }
            }
        ])

        // isValidObjectId(userId) 判断 userId 是否为有效的 ObjectId
        console.log('totalIncomes', { totalIncomes, userId: isValidObjectId(userId) })


        // 查询所有支出
        const totalExpenses = await Expense.aggregate([
            {
                // 只保留 userId 等于当前登录用户 的 expense
                $match: {
                    userId: userObjectId
                }
            },
            {
                // 将所有 expense 的 amount 相加
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' }
                }
            }
        ])

        console.log('totalExpenses', { totalExpenses, userId: isValidObjectId(userId) })

        // 最近 60 天收入明细 + 求和
        const last60DaysIncomesTransaction = await Income.find({
            userId,
            // $gte：greater than or equal（大于等于）
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 })

        // reduce 把数组里的 amount 累加成一个总数
        // 初始值 0 很关键：即使数组为空也不会报错，结果是 0
        const incomeLast60Days = last60DaysIncomesTransaction.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        )

        // 最近 30 天支出明细 + 求和
        const last30DaysExpensesTransaction = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 })

        
        const expensesLast30Days = last30DaysExpensesTransaction.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        )

        // 合并最近收入+支出（各取 5 条）
        const lastTransactions = [
            // 用...把数组展开，相当于把两个数组拼在一起,否则会成为二维数组
            ...(await Income.find({userId}).sort({date: -1}).limit(5)).map(income => ({
                // 对象展开：把 income 对象的每个属性都复制到新对象里
                ...income.toObject(),
                type: 'income'
            })),
            ...(await Expense.find({userId}).sort({date: -1}).limit(5)).map(expense => ({
                ...expense.toObject(),
                type: 'expense'
            })),
        ].sort((a,b) => b.date - a.date)
        // 按日期倒序排序，最新的排在前面
        // 如果 a.date 大于 b.date，返回 -1，表示 a 排在 b 前面
        // 如果 a.date 小于 b.date，返回 1，表示 a 排在 b 后面
        // 如果 a.date 等于 b.date，返回 0，表示 a 和 b 位置不变
        // 这样就保证了最新的排在前面


        //
        res.status(200).json({
            success: true,
            data: {
                // 余额 = 总收入 - 总支出
                // 如果 totalIncomes[0] 存在，才读取 totalAmount，否则用 0
                // 取数组的第一个元素
                totalBalance:
                    (totalIncomes[0]?.totalAmount || 0) - (totalExpenses[0]?.totalAmount || 0),
                // 总收入
                totalIncomes: totalIncomes[0]?.totalAmount || 0,
                // 总支出
                totalExpenses: totalExpenses[0]?.totalAmount || 0,
                // 最近 30 天支出明细
                last30DaysExpenses: {
                    // total	30天支出总额
                    // transactions	30天支出列表
                    total: expensesLast30Days,
                    transactions: last30DaysExpensesTransaction
                },
                // 最近 60 天收入明细
                last60DaysIncomes: {
                    // total	60天收入总额
                    // transactions	60天收入列表
                    total: incomeLast60Days,
                    transactions: last60DaysIncomesTransaction
                },
                // 最近交易明细
                recentTransactions: lastTransactions
            }
        })
    } catch (error) {
        next(error)
    }
}

