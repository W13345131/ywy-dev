import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    // 用户ID
    user: {
        type: String,
        required: true,
        ref: 'User',
    },
    // 媒体URL
    media_url: {
        type: String,
    },
    // 内容
    content: {
        type: String,
    },
    // 媒体类型
    media_type: {
        type: String,
        enum: ['text', 'image', 'video'],
    },
    // 背景颜色
    background_color: {
        type: String,
    },
    // 浏览量
    views_count: [
        {
            type: String,
            // 用户ID
            ref: 'User',
        }
    ]
}, {
    timestamps: true,
    // 最小化，不压缩
    minimize: false,
});

const Story = mongoose.model('Story', storySchema);

export default Story;