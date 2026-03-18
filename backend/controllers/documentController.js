import { error } from 'console'
import Document from '../models/Document.js'
import Flashcard from '../models/Flashcard.js'
import Quiz from '../models/Quiz.js'
import { extractTextFromPDF } from '../utils/pdfParser.js'
import { chunkText } from '../utils/textChunker.js'
import fs from 'fs/promises'
import mongoose from 'mongoose'


// 这段代码是 上传文档接口（uploadDocument Controller） 的开头部分，用来检查用户是否真的上传了文件
export const uploadDocument = async (req, res, next) => {
    try {
        // 如果用户没有上传文件，则返回错误
        if(!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded',
                statusCode: 400,
            })
        }

        // 解构赋值，title 是标题
        const {title} = req.body;

        // 如果标题不存在，则删除文件并返回错误
        if(!title) {
            // 删除文件，如果不删除：服务器会堆积很多无效文件
            await fs.unlink(req.file.path);
            return res.status(400).json({
                success: false,
                error: 'Title is required',
                statusCode: 400,
            })
        }

        // 生成文件 URL
        const baseUrl = `http://localhost:${process.env.PORT || 5555}`;
        // 文件 URL
        const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

        // 创建文档
        const document = await Document.create({
            // 用户 ID
            userId: req.user._id,
            // 标题
            title,
            // 文件名
            fileName: req.file.originalname,
            // 文件 URL
            filePath: fileUrl,
            // 文件大小
            fileSize: req.file.size,
            // 状态
            status: 'processing',
        });

        // 处理 PDF 文件
        processPDF(document._id, req.file.path).catch(err => {
            console.error('PDF processing error:', err);
        });

        res.status(201).json({
            success: true,
            data: document,
            message: 'Document uploaded successfully',
        })


    } catch (error) {

        //clean up file on error
        if(req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }

        next(error);
    }
}

// 后台处理 PDF 文档的核心函数。它负责：读取 PDF → 提取文本 → 切分文本 → 更新数据库状态
const processPDF = async (documentId, filePath) => {
    try {
        // extractTextFromPDF: 提取文本
        const {text, numPages, info} = await extractTextFromPDF(filePath);

        // chunkText: 切分文本, 500个词一个chunk, 50个词重叠
        const chunks = chunkText(text, 500, 50);
        
        // 更新数据库
        await Document.findByIdAndUpdate(documentId, {
            // extractedText	PDF全文
            // chunks	切分后的文本块
            // status	处理状态
            extractedText: text,
            chunks: chunks,
            status: 'ready',
        });

        // 打印成功信息
        console.log(`Document ${documentId} processed successfully`);

    } catch (error) {
        // 打印错误信息
        console.error('Error processing document ${documentId}:', error);
        // 更新数据库状态为失败
        await Document.findByIdAndUpdate(documentId, {status: 'failed'});
    }
}



// 获取用户所有文档列表的 API Controller，而且用了 MongoDB Aggregation Pipeline（聚合管道） 
// 来同时统计 flashcards 和 quizzes 的数量
export const getDocuments = async (req, res, next) => {
    try {
        const documents = await Document.aggregate([
            {
                // 只保留 userId 等于当前登录用户 的 document
                // 转换成 ObjectId，匹配更稳定
                $match: { userId: new mongoose.Types.ObjectId(req.user._id) },
            },
            {
                // $lookup：关联 flashcards
                $lookup: {
                    // 要 join 的集合名
                    from: 'flashcards',
                    // 当前集合（documents）里拿来对比的字段
                    localField: '_id',
                    // 目标集合（flashcards）里用于匹配的字段
                    foreignField: 'documentId',
                    // 把匹配结果放到这个新字段里（数组）
                    as: 'flashcardSets',
                },
            },
            {
                // $lookup：关联 quizzes
                // 同理，给每个 document 找出它对应的 quizzes
                $lookup: {
                    from: 'quizzes',
                    localField: '_id',
                    foreignField: 'documentId',
                    as: 'quizzes',
                },
            },
            {
                // $addFields：新增字段（计算数量）
                $addFields: {
                    // 在当前 document 上 新增两个字段
                    // flashcardCount：flashcardSets 数组长度
                    // quizCount：quizzes 数组长度
                    flashcardCount: { $size: '$flashcardSets' },
                    quizCount: { $size: '$quizzes' },
                },
            },
            {
                // $project：选择/隐藏字段（控制返回结果大小）
                $project: { 
                    // 隐藏 extractedText、chunks、flashcardSets、quizzes 字段
                    extractedText: 0,
                    chunks: 0,
                    flashcardSets: 0,
                    quizzes: 0,
                },
            },
            {
                // $sort：排序
                // 按 uploadDate 字段排序，-1 表示倒序，最新文档排在顶部
                $sort: { uploadDate: -1 },
            }
        ]);

        // 返回成功响应
        res.status(200).json({
            // 成功标志
            success: true,
            // 文档数量
            count: documents.length,
            // 文档列表
            data: documents,
        })

    } catch (error) {
        next(error);
    }
}
                        
export const getDocument = async (req, res, next) => {
    try {
        // 根据文档 ID 和用户 ID 查找文档
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id,
        })

        // 如果文档不存在，则返回错误
        if(!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404,
            })
        }

        // 统计文档下的 flashcards 数量
        const flashcardCount = await Flashcard.countDocuments({
            documentId: document._id,
            userId: req.user._id,
        });

        // 统计文档下的 quizzes 数量
        const quizCount = await Quiz.countDocuments({
            documentId: document._id,
            userId: req.user._id,
        });
        
        // 更新文档的最后访问时间
        document.lastAccessed = Date.now();
        // 保存文档
        await document.save();

        // 将文档转换为普通对象
        // document 是 Mongoose Document，里面带很多方法和内部字段，不适合直接随便扩展
        const documentData = document.toObject();

        // 把统计结果塞进返回数据
        documentData.flashcardCount = flashcardCount;
        documentData.quizCount = quizCount;

        res.status(200).json({
            success: true,
            data: documentData,
        })
        
    } catch (error) {
        next(error);
    }
}

// 删除文档的 API Controller
export const deleteDocument = async (req, res, next) => {
    try {
        // 根据文档 ID 和用户 ID 查找文档
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id,
        })

        // 如果文档不存在，则返回错误
        if(!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found',
                statusCode: 404,
            })
        }
        
        // 删除文件
        // .catch(() => {})：如果删除失败，则不抛出错误
        await fs.unlink(document.filePath).catch(() => {});

        // 删除文档
        await document.deleteOne();

        // 返回成功响应
        res.status(200).json({
            success: true,
            message: 'Document deleted successfully',
        })
        
    } catch (error) {
        next(error);
    }
}