import fs from 'fs';
import imagekit from '../../config/imageKit.js';
import Story from '../../models/Media/Story.js';
import User from '../../models/User.js';



// 添加故事
export const addUserStory = async (req, res, next) => {
    
    try {

        const userId = req.user._id;

        const { content, media_type, background_color } = req.body;

        const media = req.file;

        let media_url = '';

        if(media_type === 'image' || media_type === 'video') {

            const buffer = fs.readFileSync(media.path);

            const response = await imagekit.upload({
                file: buffer,
                fileName: media.originalname,
            });

            media_url = response.url;
        }

        const story = await Story.create({
            user: userId,
            content,
            media_url,
            media_type,
            background_color,
        });

        res.status(201).json({
            success: true,
            message: 'Story created successfully',
            story,
        });
    } catch (error) {
        next(error);
    }
}

// 获取用户故事
export const getUserStories = async (req, res, next) => {

    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        const userIds = [userId, ...user.connections, ...user.following];

        const stories = await Story.find({ user: { $in: userIds } }).populate('user').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: stories,
        });
    } catch (error) {
        next(error);
    }
}
