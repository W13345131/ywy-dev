import fs from 'fs';
import imagekit from '../../config/imageKit.js';
import Message from '../../models/Media/Message.js';


// 连接池
const connections = {};

// SSE 控制器
// 让服务器可以持续“推送数据”给前端
export const sseController = (req, res, next) => {

    // 获取用户ID
    const userId = req.user._id.toString();

    console.log('New client connected:', userId);

    // 设置响应头,这是 SSE 流，不是普通响应
    res.setHeader('Content-Type', 'text/event-stream');
    // 防止缓存（必须实时）
    res.setHeader('Cache-Control', 'no-cache');
    // 保持连接不断开
    res.setHeader('Connection', 'keep-alive');
    // 允许跨域请求
    res.setHeader('Access-Control-Allow-Origin', '*');

    // 把每个用户的 response 保存起来
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
        // 获取用户ID
        const userId = req.user._id.toString();
        // 获取接收者ID和文本
        const { to_user_id, text } = req.body;

        // 获取图片
        const image = req.file;

        // 如果接收者ID不存在，则返回错误
        if (!to_user_id) {
            return res.status(400).json({
                success: false,
                message: 'Recipient is required',
            });
        }

        // 如果文本和图片都不存在，则返回错误
        if (!text?.trim() && !image) {
            return res.status(400).json({
                success: false,
                message: 'Message text or image is required',
            });
        }

        // 初始化媒体URL
        let media_url = '';

        // 获取消息类型
        let message_type = image ? 'image' : 'text';

        // 如果消息类型为图片，则上传图片
        if(message_type === 'image') {
            // 读取图片文件
            const fileBuffer = fs.readFileSync(image.path);
            // 上传图片
            // 上传图片到 ImageKit
            const response = await imagekit.upload({
                // 图片文件
                file: fileBuffer,
                // 图片文件名
                fileName: image.originalname,
                // 图片文件夹
                folder: 'messages',
            });
            // 获取图片URL
            media_url = response.url;
        }

        // 创建消息
        const message = await Message.create({
            // 发送者用户ID
            from_user_id: userId,
            // 接收者用户ID
            to_user_id,
            // 消息类型
            message_type,
            // 文本
            text: text?.trim() || '',
            // 媒体URL
            media_url,
        });

        // 获取消息用户数据,populate 是 MongoDB 的查询优化技巧，用于预加载关联的数据
        const messageWithUserData = await Message.findById(message._id).populate('from_user_id to_user_id');

        // 返回消息数据
        res.status(201).json({
            success: true,
            data: messageWithUserData,
        });

        // 如果接收者用户ID存在，则发送消息给接收者
        if(connections[to_user_id]) {
            // 发送消息给接收者
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
        // 获取用户ID
        const userId = req.user._id.toString();
        // 获取接收者ID
        const to_user_id = req.params.userId;

        // 获取消息
        const messages = await Message.find({
            // $or 是 MongoDB 的查询优化技巧，用于查询多个条件
            // 满足以下任一条件
            $or: [
                // 发送者用户ID为当前用户，接收者用户ID为接收者ID
                { from_user_id: userId, to_user_id },
                // 发送者用户ID为接收者ID，接收者用户ID为当前用户
                { from_user_id: to_user_id, to_user_id: userId },
            ],
            // 按照创建时间排序
        }).sort({ createdAt: 1 });

        // 更新消息为已读
        // updateMany 是 MongoDB 的查询优化技巧，用于更新多个数据，提高效率
        await Message.updateMany({
            // 发送者用户ID为接收者ID
            from_user_id: to_user_id,
            // 接收者用户ID为当前用户
            to_user_id: userId,
        }, {
            // 更新为已读
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
        // 获取用户ID
        const userId = req.user._id.toString();
        // 获取消息
        const messages = await Message.find({
            // $or 是 MongoDB 的查询优化技巧，用于查询多个条件
            // 满足以下任一条件
            $or: [
                // 接收者用户ID为当前用户
                { to_user_id: userId },
                { from_user_id: userId },
            ],
        }).populate('from_user_id to_user_id').sort({ createdAt: -1 });

        // 创建一个 Map 对象，用于存储会话
        const conversationMap = new Map();

        messages.forEach((message) => {
            // 判断消息是否是接收者用户ID为当前用户，如果是，则 isIncoming 为 true，否则为 false
            const isIncoming = message.to_user_id?._id?.toString() === userId;
            // 如果 isIncoming 为 true，则 partner 为 message.from_user_id，否则为 message.to_user_id
            const partner = isIncoming ? message.from_user_id : message.to_user_id;
            // 获取合作伙伴ID
            const partnerId = partner?._id?.toString();

            // 如果合作伙伴ID不存在，或者合作伙伴ID为当前用户，则返回
            if (!partnerId || partnerId === userId) return;

            // 如果 conversationMap 中不存在合作伙伴ID，则创建一个新会话
            // has 是 JavaScript 的 Map 对象的 API，用于判断 Map 对象中是否存在某个键
            if (!conversationMap.has(partnerId)) {
                // set 是 JavaScript 的 Map 对象的 API，用于设置 Map 对象中的键值对
                conversationMap.set(partnerId, {
                    // _id 为消息ID
                    _id: message._id,
                    // chatUser 为合作伙伴
                    chatUser: partner,
                    // lastMessage 为最后一条消息
                    lastMessage: message.text || (message.message_type === 'image' ? 'Image' : ''),
                    // message_type 为消息类型
                    message_type: message.message_type,
                    // media_url 为媒体URL
                    media_url: message.media_url,
                    // createdAt 为创建时间
                    createdAt: message.createdAt,
                    // seen 为是否已读
                    seen: message.seen,
                    // unreadCount 为未读消息数量
                    unreadCount: 0,
                });
            }

            // 如果消息是接收者用户ID为当前用户，并且未读，则增加未读消息数量
            if (isIncoming && !message.seen) {
                // get 是 JavaScript 的 Map 对象的 API，用于获取 Map 对象中的键值对
                const existing = conversationMap.get(partnerId);
                // unreadCount 为未读消息数量
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