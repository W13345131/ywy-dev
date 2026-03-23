import fs from 'fs';
import imagekit from '../../config/imageKit.js';
import Message from '../../models/Media/Message.js';


const connections = {};

export const sseController = (req, res, next) => {

    const userId = req.user._id.toString();

    console.log('New client connected:', userId);

    //
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    connections[userId] = res;

    res.write('log: Connected to SSE stream\n\n');

    req.on('close', () => {

        delete connections[userId];
        console.log('Client disconnected');
    });
}


// 发送消息
export const sendMessage = async (req, res, next) => {
    
    try {

        const userId = req.user._id.toString();

        const { to_user_id, text } = req.body;

        const image = req.file;

        if (!to_user_id) {
            return res.status(400).json({
                success: false,
                message: 'Recipient is required',
            });
        }

        if (!text?.trim() && !image) {
            return res.status(400).json({
                success: false,
                message: 'Message text or image is required',
            });
        }

        let media_url = '';

        let message_type = image ? 'image' : 'text';

        if(message_type === 'image') {
            const fileBuffer = fs.readFileSync(image.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: image.originalname,
                folder: 'messages',
            });
            media_url = response.url;
        }

        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            message_type,
            text: text?.trim() || '',
            media_url,
        });

        const messageWithUserData = await Message.findById(message._id).populate('from_user_id to_user_id');

        res.status(201).json({
            success: true,
            data: messageWithUserData,
        });

        if(connections[to_user_id]) {
            connections[to_user_id].write(`data: ${JSON.stringify({
                message: messageWithUserData,
            })}\n\n`);
        }
       
    } catch (error) {
        next(error);
    }
}


// 获取消息
export const getMessages = async (req, res, next) => {
    
    try {
        const userId = req.user._id.toString();
        const to_user_id = req.params.userId;

        const messages = await Message.find({
            $or: [
                { from_user_id: userId, to_user_id },
                { from_user_id: to_user_id, to_user_id: userId },
            ],
        }).sort({ createdAt: 1 });

        await Message.updateMany({
            from_user_id: to_user_id,
            to_user_id: userId,
        }, {
            seen: true,
        });

        res.status(200).json({
            success: true,
            data: messages,
        });

    } catch (error) {
        next(error);
    }
}


// 获取最近消息
export const getRecentMessages = async (req, res, next) => {

    try {
        const userId = req.user._id.toString();
        const messages = await Message.find({
            $or: [
                { to_user_id: userId },
                { from_user_id: userId },
            ],
        }).populate('from_user_id to_user_id').sort({ createdAt: -1 });

        const conversationMap = new Map();

        messages.forEach((message) => {
            const isIncoming = message.to_user_id?._id?.toString() === userId;
            const partner = isIncoming ? message.from_user_id : message.to_user_id;
            const partnerId = partner?._id?.toString();

            if (!partnerId || partnerId === userId) return;

            if (!conversationMap.has(partnerId)) {
                conversationMap.set(partnerId, {
                    _id: message._id,
                    chatUser: partner,
                    lastMessage: message.text || (message.message_type === 'image' ? 'Image' : ''),
                    message_type: message.message_type,
                    media_url: message.media_url,
                    createdAt: message.createdAt,
                    seen: message.seen,
                    unreadCount: 0,
                });
            }

            if (isIncoming && !message.seen) {
                const existing = conversationMap.get(partnerId);
                existing.unreadCount += 1;
            }
        });

        res.status(200).json({
            success: true,
            data: Array.from(conversationMap.values()),
        });
    } catch (error) {
        next(error);
    }
}