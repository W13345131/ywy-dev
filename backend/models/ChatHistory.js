import mongoose from 'mongoose'

const chatHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    messages: [{
        // 定义聊天消息的角色字段
        role: {
            type: String,
            // 用户 和 AI
            enum: ['user', 'assistant'],
            required: true
        },
        // 定义聊天消息的内容字段
        content: {
            type: String,
            required: true
        },
        // 定义聊天消息的时间戳字段
        timestamp: {
            type: Date,
            // 默认当前时间
            default: Date.now
        },
        relevantChunks: [{
            // relevantChunks 是一个数组；数组里的每一个元素，都是一个「Number 数组」
            // 类似一个「多维数组」
            type: [Number],
            default: [],
        }],
    }],
}, {
    timestamps: true
});

// 创建复合索引,提高查询效率
chatHistorySchema.index({ userId: 1, documentId: 1 });

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

export default ChatHistory;