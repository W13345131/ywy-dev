import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        ref: 'User',
    },
    media_url: {
        type: String,
    },
    content: {
        type: String,
    },
    media_type: {
        type: String,
        enum: ['text', 'image', 'video'],
    },
    background_color: {
        type: String,
    },
    views_count: [
        {
            type: String,
            ref: 'User',
        }
    ]
}, {
    timestamps: true,
    minimize: false,
});

const Story = mongoose.model('Story', storySchema);

export default Story;