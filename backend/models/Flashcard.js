import mongoose from 'mongoose'

const flashcardSchema = new mongoose.Schema({
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
    cards: [
      {
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium',
        },
        // 上次复习时间
        // 默认 null 表示未复习
        lastReviewed: {
            type: Date,
            default: null
        },
        // 复习次数
        // 默认 0
        reviewCount: {
            type: Number,
            default: 0
        },
        // 是否收藏
        // 默认 false
        isStarred: {
            type: Boolean,
            default: false
        },
    }],
}, {
    // 创建时间,更新时间
    // Mongoose 自动加两个字段：createdAt：创建时间；supdatedAt：更新时间（每次保存更新会变）
    timestamps: true
});

// 这一句是数据库性能优化的关键
// 在 flashcards 集合中，按 userId 和 documentId 创建一个联合索引
// 1 表示正序，-1 表示倒序
// 联合索引可以提高查询效率，因为可以同时按多个字段查询
flashcardSchema.index({ userId: 1, documentId: 1 });

// 把 Schema（结构定义）变成一个可以操作数据库的 Model（模型）
// 第一个参数：模型名称
// 第二个参数：文档结构定义
const Flashcard = mongoose.model('Flashcard', flashcardSchema);

export default Flashcard;