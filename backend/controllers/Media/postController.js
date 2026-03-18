import Post from '../../models/Media/Post.js';
import User from '../../models/User.js';
import imagekit from '../../config/imageKit.js';
import FileSystem from 'fs';


export const addPost = async (req, res, next) => {

    try {
        const { content, post_type } = req.body;
        const images = req.files || [];

        let image_urls = [];

        if (images.length) {
            image_urls = await Promise.all(images.map(async (image) => {

                const fileBuffer = FileSystem.readFileSync(image.path);

                const response = await imagekit.upload({
                    file: fileBuffer,
                    fileName: image.originalname,
                    folder: 'posts',
                });

                const url = imagekit.url({
                    path: response.filePath,
                    transformation: [{ quality: 'auto' }, { format: 'webp' }, { width: 1280 }],
                });

                return url;
            }));
        }

        const post = await Post.create({
            user: req.user._id,
            content,
            image_urls,
            post_type,
        });

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post,
        });
    } catch (error) {
        next(error);
    }
}


export const getPosts = async (req, res, next) => {

    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userIds = [userId, ...(user.connections || []), ...(user.following || [])];

        const posts = await Post.find({ user: { $in: userIds } }).populate('user').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: posts,
        });

    } catch (error) {
        next(error);
    }
}


export const likePost = async (req, res, next) => {

    try {
        const { postId } = req.body;

        const post = await Post.findById(postId);

        if(post.likes_count.includes(req.user._id)) {

            post.likes_count = post.likes_count.filter((id) => id.toString() !== req.user._id.toString());

            await post.save();

            res.status(200).json({
                success: true,
                message: 'Post unliked successfully',
            });
        } else {
            post.likes_count.push(req.user._id);
            await post.save();

            res.status(200).json({
                success: true,
                message: 'Post liked successfully',
            });
        }
    } catch (error) {
        next(error);
    }
}