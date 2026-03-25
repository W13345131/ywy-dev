import User from '../../models/User.js';
import fs from 'fs';
import imagekit from '../../config/imageKit.js';
import Connection from '../../models/Media/Connection.js';
import Post from '../../models/Media/Post.js';
import mongoose from 'mongoose';

// 防止非法 ID 导致 Mongo 报错
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// 清洗帖子用户
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


// 获取用户数据
export const getUserData = async (req, res, next) => {

    try {
        // 获取用户
        const user = await User.findById(req.user._id).select('-password');
        // 如果用户不存在，则返回用户不存在
        if(!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                statusCode: 404,
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

// 更新用户数据
export const updateUserData = async (req, res, next) => {

    try {

        // 获取用户名，用户简介，用户位置
        const { username, bio, location } = req.body;

        // 初始化更新数据
        const updatedData = {};
        // 如果用户名不为空，则更新用户名
        if (username !== undefined) updatedData.username = username;
        // 如果用户简介不为空，则更新用户简介
        if (bio !== undefined) updatedData.bio = bio;
        // 如果用户位置不为空，则更新用户位置
        if (location !== undefined) updatedData.location = location;

        // 如果用户名不为空，则检查用户名是否已被占用
        if (username) {
            // $ne: req.user._id 表示用户ID不等于当前用户ID,即不等于自己
            const existingUser = await User.findOne({ username, _id: { $ne: req.user._id } });
            // 如果用户名已被占用，则返回用户名已被占用错误
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: 'Username already taken',
                    statusCode: 400,
                });
            }
        }

        // 获取用户头像文件
        const profileImageFile = req.files?.profileImageUrl?.[0];
        // 获取用户封面文件
        const coverImageFile = req.files?.coverImageUrl?.[0];

        // 如果用户头像文件不为空，则上传用户头像文件
        if(profileImageFile) {
            // 读取用户头像文件
            const buffer = fs.readFileSync(profileImageFile.path);
            // 上传用户头像文件
            const response = await imagekit.upload({
                file: buffer,
                fileName: profileImageFile.originalname,
            });
            // 获取用户头像URL
            const url = imagekit.url({
                path: response.filePath,
                transformation: [{ quality: 'auto' }, { format: 'webp' }, { width: 1280 }],
            });
            // 更新用户头像URL
            updatedData.profileImageUrl = url;
        }

        // 如果用户封面文件不为空，则上传用户封面文件
        if(coverImageFile) {
            // 读取用户封面文件
            const buffer = fs.readFileSync(coverImageFile.path);
            // 上传用户封面文件
            const response = await imagekit.upload({
                file: buffer,
                fileName: coverImageFile.originalname,
            });
            // 获取用户封面URL
            const url = imagekit.url({
                path: response.filePath,
                transformation: [{ quality: 'auto' }, { format: 'webp' }, { width: 1280 }],
            });
            // 更新用户封面URL
            updatedData.coverImageUrl = url;
        }

        // 更新用户数据
        const user = await User.findByIdAndUpdate(req.user._id, updatedData, { new: true });

        // 返回更新后的用户数据
        res.status(200).json({
            success: true,
            data: user,
            message: 'User data updated successfully',
        });
    } catch (error) {
        next(error);
    }
}

// 发现用户
export const discoverUsers = async (req, res, next) => {

    try {
        // 获取搜索关键词
        const { input } = req.query;
        // 搜索关键词
        const searchTerm = input || '';

        // 查询所有用户
        const allUsers = await User.find(
            // 如果搜索关键词不为空，则查询用户名，用户简介，用户位置包含搜索关键词的用户
            searchTerm
                ? {
                    //  'i' 表示不区分大小写
                    $or: [
                        { username: new RegExp(searchTerm, 'i') },
                        { bio: new RegExp(searchTerm, 'i') },
                        { location: new RegExp(searchTerm, 'i') },
                    ]
                }
                : {}
        ).select('-password');

        // 过滤掉当前用户
        const filteredUsers = allUsers.filter((user) => user._id.toString() !== req.user._id.toString());
        // 返回用户数据
        res.status(200).json({
            success: true,
            data: filteredUsers,
            message: 'Users found successfully',
        });
    } catch (error) {
        next(error);
    }

}



// 关注用户
export const followUser = async (req, res, next) => {

    try {
        // 获取用户ID
        const { userId } = req.body;
        // 如果用户ID为空，则返回用户ID为空错误
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required',
                statusCode: 400,
            });
        }

        // 获取当前用户
        const user = await User.findById(req.user._id);
        // 如果当前用户不存在，则返回当前用户不存在错误
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                statusCode: 404,
            });
        }

        // 如果当前用户已经关注了该用户，则返回当前用户已经关注了该用户错误
        if((user.following || []).some((fid) => fid.toString() === userId)) {
            return res.status(400).json({
                success: false,
                error: 'You are already following this user',
                statusCode: 400,
            });
        }

        // 更新当前用户关注列表
        user.following = user.following || [];
        // 添加用户ID到当前用户关注列表
        user.following.push(userId);
        // 保存当前用户
        await user.save();

        // 获取被关注用户
        const toUser = await User.findById(userId);
        // 如果被关注用户不存在，则返回被关注用户不存在错误
        if (toUser) {
            // 更新被关注用户关注列表
            toUser.followers = toUser.followers || [];
            // 添加当前用户ID到被关注用户关注列表
            toUser.followers.push(req.user._id);
            // 保存被关注用户
            await toUser.save();
        }

        res.status(200).json({
            success: true,
            data: user,
            message: 'User followed successfully',
        });
    } catch (error) {
        next(error);
    }
}

// 取消关注用户
export const unfollowUser = async (req, res, next) => {

    try {
        // 获取用户ID
        const { userId } = req.body;
        // 如果用户ID为空，则返回用户ID为空错误
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required',
                statusCode: 400,
            });
        }

        // 获取当前用户
        const user = await User.findById(req.user._id);
        // 如果当前用户不存在，则返回当前用户不存在错误
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                statusCode: 404,
            });
        }

        // 更新当前用户关注列表
        user.following = (user.following || []).filter((fid) => fid.toString() !== userId);
        // 保存当前用户
        await user.save();

        // 获取被关注用户
        const toUser = await User.findById(userId);
        // 如果被关注用户存在，则更新被关注用户关注列表
        if (toUser) {
            toUser.followers = (toUser.followers || []).filter((fid) => fid.toString() !== req.user._id.toString());
            // 保存被关注用户
            await toUser.save();
        }

        res.status(200).json({
            success: true,
            data: user,
            message: 'User unfollowed successfully',
        });
    } catch (error) {
        next(error);
    }
}


// 发送连接请求
export const sendConnectionRequest = async (req, res, next) => {

    try {
        // 获取用户ID
        const { userId } = req.body;
        // 如果用户ID为空，则返回用户ID为空错误
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required',
                statusCode: 400,
            });
        }

        // 如果用户ID等于当前用户ID，则返回不能发送连接请求给自己错误
        if (userId === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                error: 'Cannot send connection request to yourself',
                statusCode: 400,
            });
        }

        // 获取被请求用户
        const toUser = await User.findById(userId);
        // 如果被请求用户不存在，则返回被请求用户不存在错误
        if (!toUser) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                statusCode: 404,
            });
        }

        // 查询是否存在连接请求
        const existingConnection = await Connection.findOne({
            $or: [
                { from_user_id: req.user._id, to_user_id: userId }, // 当前用户请求被请求用户
                { from_user_id: userId, to_user_id: req.user._id }, // 被请求用户请求当前用户
            ],
        });
        // 如果存在连接请求，则返回连接请求已存在错误
        if (existingConnection) {
            // 如果连接请求状态为已接受，则返回已连接错误
            return res.status(400).json({
                success: false,
                error: existingConnection.status === 'accepted' ? 'You are already connected' : 'Connection request already sent',
                statusCode: 400,
            });
        }

        // 查询最近24小时内发送的连接请求数量
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        // countDocuments 是 MongoDB 的查询优化技巧，用于查询数量，提高效率
        // $gte: last24Hours 表示创建时间大于等于24小时前
        const recentRequestsCount = await Connection.countDocuments({
            from_user_id: req.user._id,
            createdAt: { $gte: last24Hours },
        });

        // 如果最近24小时内发送的连接请求数量大于等于20，则返回超过限制错误
        if (recentRequestsCount >= 20) {
            return res.status(400).json({
                success: false,
                error: 'You have reached the limit of 20 connection requests in 24 hours',
                statusCode: 400,
            });
        }

        // 创建连接请求
        await Connection.create({
            from_user_id: req.user._id,
            to_user_id: userId,
        });

        res.status(201).json({
            success: true,
            message: 'Connection request sent successfully',
        });
    } catch (error) {
        next(error);
    }
}


// 获取用户连接
export const getUserConnections = async (req, res, next) => {

    try {
        // 获取用户ID
        const userId = req.user._id;
        // 获取用户

        const user = await User.findById(userId).populate('connections followers following');
        // 如果用户不存在，则返回用户不存在错误
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                statusCode: 404,
            });
        }

        // 获取用户连接
        const connections = user.connections || [];
        // 获取用户粉丝
        const followers = user.followers || [];
        // 获取用户关注
        const following = user.following || [];

        // 获取用户待接受连接请求
        const pendingConnectionDocs = await Connection.find({
            to_user_id: userId,
            status: 'pending',
        }).populate('from_user_id');

        // 获取用户发送的待接受连接请求
        const sentPendingConnectionDocs = await Connection.find({
            from_user_id: userId,
            status: 'pending',
        }).populate('to_user_id');

        // 获取用户待接受连接请求
        const pendingConnections = pendingConnectionDocs
            .map((connection) => connection.from_user_id)
            .filter(Boolean);

        // 获取用户发送的待接受连接请求
        const sentPendingConnections = sentPendingConnectionDocs
            .map((connection) => connection.to_user_id)
            .filter(Boolean);

        // 返回用户连接数据
        res.status(200).json({
            success: true,
            data: {
                connections,
                followers,
                following,
                pendingConnections,
                sentPendingConnections,
            },
        });

    } catch (error) {
        next(error);
    }
}


// 接受连接请求
export const acceptConnectionRequest = async (req, res, next) => {

    try {
        // 获取用户ID
        const { userId } = req.body;
        // 查询连接请求
        const connection = await Connection.findOne({
            from_user_id: userId,
            to_user_id: req.user._id,
            status: 'pending',
        });

        // 如果连接请求不存在，则返回连接请求不存在错误
        if(!connection) {
            return res.status(404).json({
                success: false,
                error: 'Connection not found',
                statusCode: 404,
            });
        }

        // 获取被请求用户
        const user = await User.findById(userId);
        // 获取当前用户
        const toUser = await User.findById(req.user._id);

        if (!user || !toUser) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                statusCode: 404,
            });
        }

        // 更新用户连接列表
        user.connections = user.connections || [];
        // 更新被请求用户连接列表
        toUser.connections = toUser.connections || [];
        // 如果用户连接列表不包含当前用户ID，则添加当前用户ID到用户连接列表
        if (!user.connections.some((id) => id.toString() === req.user._id.toString())) {
            user.connections.push(req.user._id);
        }

        // 如果被请求用户连接列表不包含用户ID，则添加用户ID到被请求用户连接列表
        if (!toUser.connections.some((id) => id.toString() === userId)) {
            toUser.connections.push(userId);
        }

        // 保存用户
        await user.save();
        // 保存被请求用户
        await toUser.save();

        // 更新连接请求状态
        connection.status = 'accepted';
        // 保存连接请求
        await connection.save();

        res.status(200).json({
            success: true,
            message: 'Connection request accepted successfully',
        });
    } catch (error) {
        next(error);
    }
}


// 获取用户资料
export const getUserProfiles = async (req, res, next) => {

    try {
        // 获取用户ID
        const rawProfileId = req.params.profileId || req.query.profileId || req.body?.profileId;
        // 如果用户ID为空，则返回用户ID为空错误
        const profileId = isValidObjectId(rawProfileId) ? rawProfileId : req.user?._id;
        // 获取当前用户
        const currentUser = await User.findById(req.user._id).select('followers following');
        // 获取用户资料
        const profile = await User.findById(profileId).select('-password');
        // 如果用户资料不存在，则返回用户资料不存在错误
        if(!profile || !currentUser) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found',
                statusCode: 404,
            });
        }

        // 判断是否是自己的个人主页
        const isOwnProfile = profileId.toString() === req.user._id.toString();
        // 获取共同关注用户ID
        const mutualFollowIds = getMutualFollowIds(currentUser).map((id) => id.toString());
        // 判断是否可以查看帖子
        const canViewPosts = isOwnProfile || mutualFollowIds.includes(profileId.toString());

        // 获取帖子
        const posts = canViewPosts
            ? await Post.find({ user: profileId }).sort({ createdAt: -1 })
            : [];

        // 填充帖子用户
        await Promise.all(posts.map(async (post) => {
            // 清洗帖子用户
            sanitizePostUsers(post);
            // 填充帖子用户
            await post.populate('user');
            // 填充帖子评论用户
            await post.populate('comments.user');
            // 填充帖子评论回复用户
            await post.populate('comments.replies.user');
        }));

        res.status(200).json({
            success: true,
            data: {
                profile,
                posts,
            },
        });
    } catch (error) {
        next(error);
    }
}