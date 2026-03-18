import Document from '../models/Document.js'
import Flashcard from '../models/Flashcard.js'
import Quiz from '../models/Quiz.js'
import ChatHistory from '../models/ChatHistory.js'
// *表示导入全部导出内容
import * as geminiService from '../utils/geminiService.js'
// 导入 findRelevantChunks 函数
import { findRelevantChunks } from '../utils/textChunker.js'


// 根据用户上传的 document 内容 → 调用 AI → 生成 flashcards → 存入数据库 → 返回结果
export const generateFlashcards = async (req, res, next) => {

    try {
        // 解构赋值，documentId 是用户上传的 document 的 id，count 是生成 flashcards 的数量，默认 10
        const { documentId, count = 10 } = req.body;

        // 如果 documentId 不存在，则返回错误
        if(!documentId) {
            return res.status(400).json({ success: false, error: 'Document ID is required', statusCode: 400 });
        }

        // _id是MongoDB自动生成的唯一ID，userId是用户ID，status是文档状态，ready表示文档已准备好
        const document = await Document.findOne({ _id: documentId, userId: req.user._id, status: 'ready' });

        // 如果 document 不存在，则返回错误
        if(!document) {
            return res.status(404).json({ success: false, error: 'Document not found', statusCode: 404 });
        }

        // 调用 Gemini AI 服务，根据文档内容生成 Flashcards
        const cards = await geminiService.generateFlashcards(
            // 数据库里的 PDF 文本内容
            document.extractedText,
            // 生成 flashcards 的数量
            parseInt(count)
        );
        
        // 把 AI 生成的 flashcards 保存到 MongoDB 数据库
        const flashcardSet = await Flashcard.create({
            // 用户 ID
            userId: req.user._id,
            // 文档 ID
            documentId: document._id,
            // 卡片数组
            cards: cards.map(card => ({
                // 问题
                question: card.question,
                // 答案
                answer: card.answer,
                // 难度
                difficulty: card.difficulty,
                // 复习次数
                reviewCount: 0,
                // 是否收藏
                isStarred: false
            })),
        });

        res.status(201).json({
            success: true,
            // data 是 API 返回的响应数据字段，把服务器生成的 flashcard 数据返回给前端
            data: flashcardSet,
            message: 'Flashcard set generated successfully'
        });
    } catch (error) {
        // 错误处理
        next(error);
    }
}

// 根据用户上传的 document 内容 → 调用 AI → 生成 quiz → 存入数据库 → 返回结果
export const generateQuiz = async (req, res, next) => {
    try {
        // 解构赋值，documentId 是用户上传的 document 的 id，numQuestions 是生成 quiz 的数量，默认 5，title 是 quiz 的标题
        const { documentId, numQuestions = 5, title } = req.body;

        // 如果 documentId 不存在，则返回错误
        if(!documentId) {
            return res.status(400).json({ 
              success: false, 
              error: 'Document ID is required', 
              statusCode: 400 });
        }

        // 根据 documentId 查找 document
        const document = await Document.findOne({ 
            _id: documentId, 
            userId: req.user._id, 
            status: 'ready' 
        });

        // 如果 document 不存在，则返回错误
        if(!document) {
            return res.status(404).json({ 
              success: false, 
              error: 'Document not found', 
              statusCode: 404 
            });
        }

        // 调用 Gemini AI 服务，根据文档内容生成 Quiz
        const questions = await geminiService.generateQuiz(
            // 数据库里的 PDF 文本内容
            document.extractedText,
            // 生成 quiz 的数量
            parseInt(numQuestions)
        );


        const quiz = await Quiz.create({
            // 用户 ID
            userId: req.user._id,
            // 文档 ID
            documentId: document._id,
            // 标题
            title: title || `${document.title} - Quiz`,
            // 问题数组
            questions: questions,
            // 总问题数
            totalQuestions: questions.length,
            // 用户答案数组
            userAnswers: [],
            // 得分
            score: 0,
        });

        // 返回成功响应
        res.status(201).json({ 
            // 成功标志
            success: true, 
            // data 是 API 返回的响应数据字段，把服务器生成的 quiz 数据返回给前端
            data: quiz, 
            message: 'Quiz generated successfully' 
        });
    } catch (error) {
        next(error);
    }
}


// 根据用户上传的 document 内容 → 调用 AI → 生成 summary → 存入数据库 → 返回结果
export const generateSummary = async (req, res, next) => {
    try {
        // 解构赋值，documentId 是用户上传的 document 的 id
        const { documentId } = req.body;
        
        // 如果 documentId 不存在，则返回错误

        if(!documentId) {
            return res.status(400).json({ success: false, error: 'Document ID is required', statusCode: 400 });
        }
        
        // 根据 documentId 查找 document
        const document = await Document.findOne({ 
            // 文档 ID
            _id: documentId, 
            // 用户 ID
            userId: req.user._id, 
            // 文档状态
            status: 'ready' 
        });

        // 如果 document 不存在，则返回错误
        if(!document) {
            return res.status(404).json({ success: false, error: 'Document not found', statusCode: 404 });
        }

        // 调用 Gemini AI 服务，根据文档内容生成 Summary
        const summary = await geminiService.generateSummary(
            // 数据库里的 PDF 文本内容
            document.extractedText
        );

        // 返回成功响应
        res.status(200).json({
            // 成功标志
            success: true,
            data: {
                // 文档 ID
                documentId: document._id,
                // 文档标题
                title: document.title,
                // 摘要
                summary: summary,
            },
            message: 'Summary generated successfully'
        });
    } catch (error) {
        // 错误处理
        next(error);
    }
}

// 根据用户上传的 document 内容 → 调用 AI → 生成 chat → 存入数据库 → 返回结果
export const chat = async (req, res, next) => {
    try {
        // 解构赋值，documentId 是用户上传的 document 的 id，question 是用户的问题
        const { documentId, question } = req.body;

        // 如果 documentId 或 question 不存在，则返回错误
        if(!documentId || !question) {
            return res.status(400).json({ success: false, error: 'Document ID is required', statusCode: 400 });
        }

        // 根据 documentId 查找 document
        const document = await Document.findOne({ 
            // 文档 ID
            _id: documentId, 
            // 用户 ID
            userId: req.user._id, 
            // 文档状态
            status: 'ready' 
        });

        // 如果 document 不存在，则返回错误
        if(!document) {
            return res.status(404).json({ success: false, error: 'Document not found', statusCode: 404 });
        }

        // 从文档的文本块（chunks）中找到与用户问题最相关的内容，并提取这些块的索引
        // question	用户的问题
        // document.chunks	文档被切分后的文本块
        // 3  最多返回3个最相关的块

        // findRelevantChunks(query, chunks, maxChunks)
        const relevantChunks = findRelevantChunks(question, document.chunks, 3);
        // 提取这些块的索引
        const chunkIndices = relevantChunks.map(chunk => chunk.chunkIndex);

        // 获取当前用户在某个文档下的聊天记录，如果不存在就创建一条新的聊天记录。
        let chatHistory = await ChatHistory.findOne({ userId: req.user._id, documentId: document._id });
        if (!chatHistory) {
            chatHistory = await ChatHistory.create({ userId: req.user._id, documentId: document._id, messages: [] });
        }

        // 调用 Gemini AI 服务，根据用户问题和相关内容生成回答
        const answer =await geminiService.chatWithContext(question, relevantChunks);
        // 将用户问题和回答添加到聊天记录中
        chatHistory.messages.push(
        {
            role: 'user',
            content: question,
            timestamp: new Date(),
            relevantChunks: []
        },
        {
            role: 'assistant',
            content: answer,
            timestamp: new Date(),
            relevantChunks: chunkIndices
        }
    );

    // 保存聊天记录
    await chatHistory.save();

    // 返回成功响应
    res.status(200).json({
        // 成功标志
        success: true,
        data: {
            // 用户问题
            question,
            // 回答
            answer,
            // 相关块索引
            relevantChunks: chunkIndices,
            // 聊天记录 ID
            chatHistoryId: chatHistory._id
        },
        message: 'Chat completed successfully'
    });
    } catch (error) {
        next(error);
    }
}

// 根据用户上传的 document 内容 → 调用 AI → 生成 concept → 存入数据库 → 返回结果
export const explainConcept = async (req, res, next) => {
    try {

        // 解构赋值，documentId 是用户上传的 document 的 id，concept 是用户的问题
        const { documentId, concept } = req.body;

        // 如果 documentId 或 concept 不存在，则返回错误
        if(!documentId || !concept) {
            return res.status(400).json({ success: false, error: 'Document ID and concept are required', statusCode: 400 });
        }
        
        // 根据 documentId 查找 document
        const document = await Document.findOne({ 
            // 文档 ID
            _id: documentId, 
            // 用户 ID
            userId: req.user._id, 
            // 文档状态
            status: 'ready' 
        });

        // 如果 document 不存在，则返回错误
        if(!document) {
            return res.status(404).json({ success: false, error: 'Document not found', statusCode: 404 });
        }

        // 从文档中找到与某个概念（concept）最相关的文本块，并把这些文本拼接成 AI 可以理解的上下文（context）
        const relevantChunks = findRelevantChunks(concept, document.chunks, 3);
        // 遍历数组并返回一个新的数组，数组里的每一个元素都是文本块的内容
        const context = relevantChunks.map(chunk => chunk.content).join('\n\n');

        // 调用 Gemini AI 服务，根据概念和上下文生成解释
        const explanation = await geminiService.explainConcept(concept, context);
        // 返回成功响应
        res.status(200).json({
            success: true,
            data: {
                // 概念
                concept,
                // 解释
                explanation,
                relevantChunks: relevantChunks.map(chunk => chunk.chunkIndex)
            },
            message: 'Concept explained successfully'
        });
    } catch (error) {
        next(error);
    }
}

// 获取用户在某个文档下的聊天记录
export const getChatHistory = async (req, res, next) => {
    try {
        // 解构赋值，documentId 是用户上传的 document 的 id
        const { documentId } = req.params;
        
        // 如果 documentId 不存在，则返回错误

        if(!documentId) {
            return res.status(400).json({ success: false, error: 'Document ID is required', statusCode: 400 });
        }
        
        // 根据 documentId 查找聊天记录
        const chatHistory = await ChatHistory.findOne({ userId: req.user._id, documentId }).select('messages');

        // 如果聊天记录不存在，则返回空数组
        const messages = chatHistory?.messages ?? [];

        // 返回成功响应
        res.status(200).json({
            success: true,
            data: messages,
            message: 'Chat history fetched successfully'
        });
    } catch (error) {
        next(error);
    }
}