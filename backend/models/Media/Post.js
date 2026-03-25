import mongoose from 'mongoose';

// 回复 schema
const replySchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        ref: 'User',
    },
    // 回复目标用户名
    replyToUsername: {
        type: String,
        default: '',
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});

// 评论 schema
const commentSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        ref: 'User',
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    replies: [replySchema],
}, {
    timestamps: true,
});

// 帖子 schema
const postSchema = new mongoose.Schema({
    // 用户ID
    user: {
        type: String,
        required: true,
        ref: 'User',
    },
    // 内容
    content: {
        type: String
    },
    // 图片URL
    image_urls: [
        {
            type: String
        }
    ],
    // 帖子类型
    post_type: {
        type: String,
        enum: ['text', 'image', 'text_with_image'],
        required: true,
    },
    // 点赞数
    likes_count: [
        {
            type: String,
            ref: 'User',
        }
    ],
    // 评论
    comments: [commentSchema],
}, {
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

export default Post;