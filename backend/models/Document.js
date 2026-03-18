import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
    },
    fileName: {
        // 文件名
        type: String,
        // 文件名是必填字段
        required: true,
    },
    filePath: {
        // 文件路径
        type: String,
        // 文件路径是必填字段
        required: true,
    },
    fileSize: {
        // 文件大小
        type: Number,
        // 文件大小是必填字段
        required: true,
    },
    extractedText: {
        // 提取的文本
        type: String,
        // 默认空字符串
        default: '',
    },
    // 文本块数组
    chunks: [{
        // 文本块内容
        content: {
            type: String,
            required: true,
        },
        // 页码
        pageNumber: {
            type: Number,
            default: 0,
        },
        // 这个文本块在整个文档中的顺序编号
        chunkIndex: {
            type: Number,
            required: true,
        },
    }],
    // 上传时间
    uploadDate: {
        // 上传时间
        type: Date,
        default: Date.now,
    },
    lastAccessed: {
        // 最后访问时间
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        // 状态枚举
        enum: ['processing', 'ready', 'failed'],
        // 默认处理中
        default: 'processing',
    },
}, {
    timestamps: true
});

// 这一句是数据库性能优化的关键
// 在 documents 集合中，按 userId 和 uploadDate 创建一个联合索引
// 1 表示正序，-1 表示倒序
// 联合索引可以提高查询效率，因为可以同时按多个字段查询

// -1 表示倒序，最新文档排在顶部
documentSchema.index({ userId: 1, uploadDate: -1 });

const Document = mongoose.model('Document', documentSchema);

export default Document;