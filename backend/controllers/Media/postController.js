import Post from '../../models/Media/Post.js';
import User from '../../models/User.js';
import imagekit from '../../config/imageKit.js';
import FileSystem from 'fs';
import mongoose from 'mongoose';

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const sanitizePostUsers = (post) => {
    if (!post?.comments?.length) return post;

    post.comments.forEach((comment) => {
        if (!isValidObjectId(comment.user)) {
            comment.user = null;
        }

        (comment.replies || []).forEach((reply) => {
            if (!isValidObjectId(reply.user)) {
                reply.user = null;
            }
        });
    });

    return post;
};

const populatePostUsers = async (post) => {
    if (!post) return post;

    sanitizePostUsers(post);
    await post.populate('user');
    await post.populate('comments.user');
    await post.populate('comments.replies.user');

    return post;
};

const populatePostListUsers = async (posts) => {
    await Promise.all((posts || []).map((post) => populatePostUsers(post)));
    return posts;
};


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

        const posts = await Post.find({ user: { $in: userIds } }).sort({ createdAt: -1 });
        await populatePostListUsers(posts);

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
        const userId = req.user._id.toString();

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        const hasLiked = (post.likes_count || []).some((id) => id.toString() === userId);

        if (hasLiked) {
            post.likes_count = post.likes_count.filter((id) => id.toString() !== userId);

            await post.save();

            return res.status(200).json({
                success: true,
                message: 'Post unliked successfully',
                liked: false,
                likes_count: post.likes_count,
            });
        } else {
            post.likes_count.push(userId);
            await post.save();

            return res.status(200).json({
                success: true,
                message: 'Post liked successfully',
                liked: true,
                likes_count: post.likes_count,
            });
        }
    } catch (error) {
        next(error);
    }
}

export const getPostComments = async (req, res, next) => {

    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        await populatePostUsers(post);

        return res.status(200).json({
            success: true,
            comments: post.comments || [],
        });
    } catch (error) {
        next(error);
    }
}

export const addPostComment = async (req, res, next) => {

    try {
        const { postId } = req.params;
        const { content } = req.body;

        if (!content?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required',
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        post.comments.push({
            user: req.user._id.toString(),
            content: content.trim(),
        });

        await post.save();
        await populatePostUsers(post);

        return res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            comments: post.comments || [],
        });
    } catch (error) {
        next(error);
    }
}

export const addCommentReply = async (req, res, next) => {

    try {
        const { postId, commentId } = req.params;
        const { content, replyToUsername } = req.body;

        if (!content?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Reply content is required',
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
            });
        }

        comment.replies.push({
            user: req.user._id.toString(),
            replyToUsername: replyToUsername || '',
            content: content.trim(),
        });

        await post.save();
        await populatePostUsers(post);

        return res.status(201).json({
            success: true,
            message: 'Reply added successfully',
            comments: post.comments || [],
        });
    } catch (error) {
        next(error);
    }
}