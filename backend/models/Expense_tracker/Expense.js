import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    icon: {
        type: String,
    },
    // 分类 (餐饮、交通、住宿、购物、娱乐、医疗、教育、其他)
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
})

const Expense = mongoose.model('Expense', expenseSchema)

export default Expense