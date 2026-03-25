import mongoose from 'mongoose';


const connectionSchema = new mongoose.Schema({
    // 发送者用户ID
    from_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // 接收者用户ID
    to_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // 状态
    status: {
        type: String,
        enum: ['pending', 'accepted'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

// 导出 Connection 模型
const Connection = mongoose.model('Connection', connectionSchema);

// 导出 Connection 模型
export default Connection;