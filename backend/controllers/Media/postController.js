import Post from '../../models/Media/Post.js';
import User from '../../models/User.js';
import imagekit from '../../config/imageKit.js';
import FileSystem from 'fs';
import mongoose from 'mongoose';


// 防止非法 ID 导致 Mongo 报错
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// 清洗评论用户
const sanitizePostUsers = (post) => {
    // 如果帖子没有评论，则返回帖子
    if (!post?.comments?.length) return post;

    // 遍历评论
    post.comments.forEach((comment) => {
        // 如果评论用户ID不是合法的 ObjectId，则设置为 null
        if (!isValidObjectId(comment.user)) {
            comment.user = null;
        }

        // 遍历评论回复
        (comment.replies || []).forEach((reply) => {
            // 如果评论回复用户ID不是合法的 ObjectId，则设置为 null
            if (!isValidObjectId(reply.user)) {
                reply.user = null;
            }
        });
    });

    return post;
};


// 填充帖子用户
const populatePostUsers = async (post) => {
    // 如果帖子不存在，则返回帖子
    if (!post) return post;
    // 清洗帖子用户
    sanitizePostUsers(post);
    // 填充帖子用户
    await post.populate('user');
    // 填充帖子评论用户
    await post.populate('comments.user');
    // 填充帖子评论回复用户
    await post.populate('comments.replies.user');

    return post;
};


// 填充帖子列表用户
const populatePostListUsers = async (posts) => {
    // 遍历帖子
    // Promise.all 是 JavaScript 的 Promise 对象的 API，用于并行执行多个 Promise，提高效率
    await Promise.all((posts || []).map((post) => populatePostUsers(post)));
    // 返回帖子列表
    return posts;
};

// 获取共同关注用户ID,既在 followers 里，又在 following 里的用户 ID
const getMutualFollowIds = (user) => {
    // 创建一个 Set 对象，用于存储用户关注者ID
    // 查找速度 O(1)（非常快）
    const followerIds = new Set((user.followers || []).map((id) => id.toString()));
    // 只保留那些也在 following 里的 ID
    // filter() 是 JavaScript 数组的方法，从数组中筛选出“符合条件”的元素，返回一个新数组。
    // 遍历我关注的人
    // 如果这个人也在 followers 里
    // 保留下来
    return (user.following || []).filter((id) => followerIds.has(id.toString()));
};


// 添加帖子
export const addPost = async (req, res, next) => {

    try {
        // 获取帖子内容和帖子类型
        const { content, post_type } = req.body;
        // 获取图片
        const images = req.files || [];

        // 初始化图片URL
        let image_urls = [];

        // 如果图片数组长度大于0，则上传图片
        if (images.length) {
            image_urls = await Promise.all(images.map(async (image) => {

                // 读取图片文件
                const fileBuffer = FileSystem.readFileSync(image.path);

                // 上传图片到 ImageKit
                const response = await imagekit.upload({
                    file: fileBuffer,
                    fileName: image.originalname,
                    folder: 'posts',
                });

                // 获取图片URL
                const url = imagekit.url({
                    path: response.filePath,
                    transformation: [{ quality: 'auto' }, { format: 'webp' }, { width: 1280 }],
                });

                return url;
            }));
        }

        // 创建帖子
        const post = await Post.create({
            // 用户ID
            user: req.user._id,
            // 内容
            content,
            // 图片URL
            image_urls,
            // 帖子类型
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


// 获取帖子
export const getPosts = async (req, res, next) => {

    try {
        // 获取用户ID
        const userId = req.user._id;
        // 获取用户
        const user = await User.findById(userId);
        // 如果用户不存在，则返回用户不存在
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // 获取共同关注用户ID
        const mutualFollowIds = getMutualFollowIds(user);
        // 用户ID列表
        const userIds = [userId, ...mutualFollowIds];

        // 获取帖子
        // 查询条件: 用户ID在 userIds 列表中
        // $in 是 MongoDB 的查询操作符，用于匹配数组中的任意一个元素
        const posts = await Post.find({ user: { $in: userIds } }).sort({ createdAt: -1 });
        // 填充帖子列表用户
        await populatePostListUsers(posts);

        res.status(200).json({
            success: true,
            data: posts,
        });

    } catch (error) {
        next(error);
    }
}


// 点赞帖子
export const likePost = async (req, res, next) => {

    try {
        // 获取帖子ID
        const { postId } = req.body;
        // 获取用户ID
        const userId = req.user._id.toString();

        // 获取帖子
        const post = await Post.findById(postId);
        // 如果帖子不存在，则返回帖子不存在
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        // 判断用户是否点赞过帖子
        // some() 是 JavaScript 数组的方法，用于判断数组中是否存在符合条件的元素
        // 只要有一个元素满足条件，就返回 true
        // id.toString() === userId 表示当前用户 ID 是否等于点赞数组中的 ID
        // 如果满足条件，则返回 true，否则返回 false
        const hasLiked = (post.likes_count || []).some((id) => id.toString() === userId);
        // 如果用户点赞过帖子，则取消点赞
        if (hasLiked) {
            // 取消点赞
            post.likes_count = post.likes_count.filter((id) => id.toString() !== userId);

            await post.save();

            return res.status(200).json({
                success: true,
                message: 'Post unliked successfully',
                liked: false,
                likes_count: post.likes_count,
            });
        } else {
            // 点赞
            post.likes_count.push(userId);
            // 保存帖子
            await post.save();
            // 返回点赞成功
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


// 获取帖子评论
export const getPostComments = async (req, res, next) => {

    try {
        // 获取帖子ID
        const { postId } = req.params;

        // 获取帖子
        const post = await Post.findById(postId);
        // 如果帖子不存在，则返回帖子不存在
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        // 填充帖子用户
        await populatePostUsers(post);

        // 返回帖子评论
        return res.status(200).json({
            success: true,
            comments: post.comments || [],
        });
    } catch (error) {
        next(error);
    }
}


// 添加帖子评论
export const addPostComment = async (req, res, next) => {

    try {
        // 获取帖子ID
        const { postId } = req.params;
        // 获取评论内容
        const { content } = req.body;

        // 如果评论内容为空，则返回评论内容为空
        if (!content?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required',
            });
        }

        // 获取帖子
        const post = await Post.findById(postId);
        // 如果帖子不存在，则返回帖子不存在
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        // 添加评论
        post.comments.push({
            user: req.user._id.toString(),
            content: content.trim(),
        });

        // 保存帖子
        await post.save();
        // 填充帖子用户
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


// 添加帖子评论回复
export const addCommentReply = async (req, res, next) => {

    try {
        // 获取帖子ID，评论ID
        const { postId, commentId } = req.params;
        // 获取回复内容，回复目标用户名
        const { content, replyToUsername } = req.body;
        // 如果回复内容为空，则返回回复内容为空
        if (!content?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Reply content is required',
            });
        }

        // 获取帖子
        const post = await Post.findById(postId);
        // 如果帖子不存在，则返回帖子不存在
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        // 获取评论
        const comment = post.comments.id(commentId);
        // 如果评论不存在，则返回评论不存在
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
            });
        }

        // 添加回复
        comment.replies.push({
            // 用户ID
            user: req.user._id.toString(),
            // 回复目标用户名
            replyToUsername: replyToUsername || '',
            // 回复内容
            content: content.trim(),
        });

        // 保存帖子
        await post.save();
        // 填充帖子用户
        await populatePostUsers(post);

        // 返回回复成功
        return res.status(201).json({
            success: true,
            message: 'Reply added successfully',
            comments: post.comments || [],
        });
    } catch (error) {
        next(error);
    }
}