import User from '../../models/User.js';
import fs from 'fs';
import imagekit from '../../config/imageKit.js';
import Connection from '../../models/Media/Connection.js';
import Post from '../../models/Media/Post.js';


// 
export const getUserData = async (req, res, next) => {

    try {
        const user = await User.findById(req.user._id).select('-password');

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

export const updateUserData = async (req, res, next) => {

    try {

        const { username, bio, location } = req.body;

        const updatedData = {};
        if (username !== undefined) updatedData.username = username;
        if (bio !== undefined) updatedData.bio = bio;
        if (location !== undefined) updatedData.location = location;

        // 检查用户名是否已被占用
        if (username) {
            const existingUser = await User.findOne({ username, _id: { $ne: req.user._id } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: 'Username already taken',
                    statusCode: 400,
                });
            }
        }

        const profileImageFile = req.files?.profileImageUrl?.[0];
        const coverImageFile = req.files?.coverImageUrl?.[0];

        if(profileImageFile) {
            const buffer = fs.readFileSync(profileImageFile.path);
            const response = await imagekit.upload({
                file: buffer,
                fileName: profileImageFile.originalname,
            });
            const url = imagekit.url({
                path: response.filePath,
                transformation: [{ quality: 'auto' }, { format: 'webp' }, { width: 1280 }],
            });
            updatedData.profileImageUrl = url;
        }

        if(coverImageFile) {
            const buffer = fs.readFileSync(coverImageFile.path);
            const response = await imagekit.upload({
                file: buffer,
                fileName: coverImageFile.originalname,
            });
            const url = imagekit.url({
                path: response.filePath,
                transformation: [{ quality: 'auto' }, { format: 'webp' }, { width: 1280 }],
            });
            updatedData.coverImageUrl = url;
        }

        const user = await User.findByIdAndUpdate(req.user._id, updatedData, { new: true });

        res.status(200).json({
            success: true,
            data: user,
            message: 'User data updated successfully',
        });
    } catch (error) {
        next(error);
    }
}

export const discoverUsers = async (req, res, next) => {

    try {
        const { input } = req.query;
        const searchTerm = input || '';

        const allUsers = await User.find(
            searchTerm
                ? {
                    $or: [
                        { username: new RegExp(searchTerm, 'i') },
                        { bio: new RegExp(searchTerm, 'i') },
                        { location: new RegExp(searchTerm, 'i') },
                    ]
                }
                : {}
        ).select('-password');

        const filteredUsers = allUsers.filter((user) => user._id.toString() !== req.user._id.toString());

        res.status(200).json({
            success: true,
            data: filteredUsers,
            message: 'Users found successfully',
        });
    } catch (error) {
        next(error);
    }

}



export const followUser = async (req, res, next) => {

    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required',
                statusCode: 400,
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                statusCode: 404,
            });
        }

        if((user.following || []).some((fid) => fid.toString() === userId)) {
            return res.status(400).json({
                success: false,
                error: 'You are already following this user',
                statusCode: 400,
            });
        }

        user.following = user.following || [];
        user.following.push(userId);
        await user.save();

        const toUser = await User.findById(userId);
        if (toUser) {
            toUser.followers = toUser.followers || [];
            toUser.followers.push(req.user._id);
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

export const unfollowUser = async (req, res, next) => {

    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required',
                statusCode: 400,
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                statusCode: 404,
            });
        }

        user.following = (user.following || []).filter((fid) => fid.toString() !== userId);
        await user.save();

        const toUser = await User.findById(userId);
        if (toUser) {
            toUser.followers = (toUser.followers || []).filter((fid) => fid.toString() !== req.user._id.toString());
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

export const sendConnectionRequest = async (req, res, next) => {

    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'userId is required',
                statusCode: 400,
            });
        }

        if (userId === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                error: 'Cannot send connection request to yourself',
                statusCode: 400,
            });
        }

        const toUser = await User.findById(userId);
        if (!toUser) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                statusCode: 404,
            });
        }

        const existingConnection = await Connection.findOne({
            from_user_id: req.user._id,
            to_user_id: userId,
        });

        if (existingConnection) {
            return res.status(400).json({
                success: false,
                error: 'Connection request already sent',
                statusCode: 400,
            });
        }

        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentRequestsCount = await Connection.countDocuments({
            from_user_id: req.user._id,
            createdAt: { $gte: last24Hours },
        });

        if (recentRequestsCount >= 20) {
            return res.status(400).json({
                success: false,
                error: 'You have reached the limit of 20 connection requests in 24 hours',
                statusCode: 400,
            });
        }

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

export const getUserConnections = async (req, res, next) => {

    try {
        const { userId } = req.body;

        const user = await User.findById(userId).populate('connections followers following');

        const connections = user.connections;
        const followers = user.followers;
        const following = user.following;

        const pendingConnections = await Connection.find({
            to_user_id: userId,
            status: 'pending',
        }.populate('from_user_id')).map((connection) => connection.from_user_id);

        res.status(200).json({
            success: true,
            data: {
                connections,
                followers,
                following,
            },
        });

    } catch (error) {
        next(error);
    }
}


export const acceptConnectionRequest = async (req, res, next) => {

    try {
        const { userId } = req.body;

        const connection = await Connection.findOne({
            from_user_id: req.user._id,
            to_user_id: userId,
        });

        if(!connection) {
            return res.status(404).json({
                success: false,
                error: 'Connection not found',
                statusCode: 404,
            });
        }

        const user = await User.findById(userId);

        user.connections.push(req.user._id);
        await user.save();

        const toUser = await User.findById(req.user._id);
        toUser.connections.push(userId);
        await toUser.save();

        connection.status = 'accepted';
        await connection.save();

        res.status(200).json({
            success: true,
            message: 'Connection request accepted successfully',
        });
    } catch (error) {
        next(error);
    }
}


export const getUserProfiles = async (req, res, next) => {

    try {
        const { profileId } = req.body;

        const profile = await User.findById(profileId);

        if(!profile) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found',
                statusCode: 404,
            });
        }

        const posts = await Post.find({ user: profileId }).populate('user');

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