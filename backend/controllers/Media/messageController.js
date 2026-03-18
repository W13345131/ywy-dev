import fs from 'fs';
import imagekit from '../../config/imageKit.js';
import Message from '../../models/Media/Message.js';


const connections = {};

export const sseController = (req, res, next) => {

    const userId = req.user._id;

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

        const userId = req.user._id;

        const { to_user_id, text } = req.body;

        const image = req.file;

        let media_url = '';

        let message_type = image ? 'image' : 'text';

        if(message_type === 'image') {
            const fileBuffer = fs.readFileSync(image.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: image.originalname,
            });
            media_url = response.url({
                path: response.filePath,
                transformation: [{
                    quality: 'auto',
                    format: 'webp',
                    width: 1280,
                }]
            })
        }

        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            message_type,
            text,
            media_url,
        });

        res.status(201).json({
            success: true,
            message,
        });

        const messageWithUserData = await Message.findById(message._id).populate('from_user_id');

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
        const userId = req.user._id;
        const { to_user_id } = req.body;

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
        const userId = req.user._id;
        const messages = await Message.find({to_user_id: userId}).populate('from_user_id to_user_id').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: messages.filter(message => message.from_user_id._id !== userId),
        });
    } catch (error) {
        next(error);
    }
}