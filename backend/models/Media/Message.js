import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    // 发送者用户ID
    from_user_id: {
        type: String,
        required: true,
        ref: 'User',
    },
    // 接收者用户ID
    to_user_id: {
        type: String,
        required: true,
        ref: 'User',
    },
    // 消息类型
    message_type: {
        type: String,
        enum: ['text', 'image'],
    },
    // 文本
    text: {
        type: String,
        trim: true,
    },
    // 媒体URL
    media_url: {
        type: String,
    },
    // 是否已读
    seen: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
    minimize: false,
});

const Message = mongoose.model('Message', messageSchema);

export default Message;