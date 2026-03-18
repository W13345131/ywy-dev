import mongoose from 'mongoose'

const incomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    icon: {
        type: String
    },
    // 来源,比如：工资、奖金、投资收益、其他
    source: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        // 默认当前时间
        default: Date.now
    }
}, {
    timestamps: true
})

const Income = mongoose.model('Income', incomeSchema)

export default Income