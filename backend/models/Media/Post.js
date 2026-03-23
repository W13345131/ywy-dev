import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        ref: 'User',
    },
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

const postSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        ref: 'User',
    },
    content: {
        type: String
    },
    image_urls: [
        {
            type: String
        }
    ],
    post_type: {
        type: String,
        enum: ['text', 'image', 'text_with_image'],
        required: true,
    },
    likes_count: [
        {
            type: String,
            ref: 'User',
        }
    ],
    comments: [commentSchema],
}, {
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

export default Post;