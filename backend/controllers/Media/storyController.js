import fs from 'fs';
import imagekit from '../../config/imageKit.js';
import Story from '../../models/Media/Story.js';
import User from '../../models/User.js';



// 添加故事
export const addUserStory = async (req, res, next) => {
    
    try {

        // 获取用户ID
        const userId = req.user._id;
        // 获取故事内容，故事类型，背景颜色
        const { content, media_type, background_color } = req.body;

        // 获取媒体文件
        const media = req.file;
        // 获取媒体类型
        const normalizedMediaType = media_type || 'text';

        // 初始化媒体URL
        let media_url = '';
        // 如果媒体类型为图片或视频，则上传媒体文件
        if (normalizedMediaType === 'image' || normalizedMediaType === 'video') {
            // 如果媒体文件为空，则返回媒体文件为空
            if (!media) {
                return res.status(400).json({
                    success: false,
                    message: 'Media file is required',
                });
            }

            // 读取媒体文件
            const buffer = fs.readFileSync(media.path);
            // 上传媒体文件
            const response = await imagekit.upload({
                file: buffer,
                fileName: media.originalname,
            });

            media_url = response.url;
        }

        // 创建故事
        const story = await Story.create({
            // 用户ID
            user: userId,
            // 内容
            content: content || '',
            // 媒体URL
            media_url,
            // 媒体类型
            media_type: normalizedMediaType,
            // 背景颜色
            background_color: background_color || '#4f46e5',
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
        // 获取用户ID
        const userId = req.user._id;
        // 获取用户
        const user = await User.findById(userId);
        // 如果用户不存在，则返回用户不存在
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // 获取用户故事
        // 查询条件: 用户ID为 userId
        // populate('user') 是 MongoDB 的查询优化技巧，用于关联用户数据
        // sort({ createdAt: -1 }) 是 MongoDB 的查询优化技巧，用于按照创建时间排序，-1 表示倒序，最新创建的排在前面
        const stories = await Story.find({ user: userId }).populate('user').sort({ createdAt: -1 });
        // 返回用户故事
        res.status(200).json({
            success: true,
            data: stories,
        });
    } catch (error) {
        next(error);
    }
}
