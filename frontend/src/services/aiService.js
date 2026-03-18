import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';


// 调用后端 API 生成 AI Flashcards（学习卡片）
const generateFlashcards = async (documentId, options) => {
    try {
        // 调用 axiosInstance 的 post 方法，生成 AI Flashcards
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, { documentId, ...options });
        // 返回响应数据
        return response.data;
    } catch (error) {
        // 抛出错误
        throw error.response?.data || {message: 'Failed to generate flashcards'};
    }
};

// 调用后端 API 生成 AI Quiz（测验）
const generateQuiz = async (documentId, options) => {
    try {
        // 调用 axiosInstance 的 post 方法，生成 AI Quiz
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, { documentId, ...options });
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to generate quiz'};
    }
};


// 调用后端 API 生成 AI Summary（总结）
const generateSummary = async (documentId) => {
    try {
        // 调用 axiosInstance 的 post 方法，生成 AI Summary
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, { documentId });
        // 返回响应数据
        return response?.data.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to generate summary'};
    }
};


// 调用后端 API 和文档聊天
const chat = async (documentId, message) => {
    try {
        // 调用 axiosInstance 的 post 方法，和文档聊天
        const response = await axiosInstance.post(API_PATHS.AI.CHAT, { documentId, question: message });
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'Chat request failed'};
    }
};


// 调用后端 API 解释概念
const explainConcept = async (documentId, concept) => {
    try {
        // 调用 axiosInstance 的 post 方法，解释概念
        const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, { documentId, concept });
        // 返回响应数据
        return response?.data.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to explain concept'};
    }
};


// 调用后端 API 获取聊天记录
const getChatHistory = async (documentId) => {
    try {
        // 调用 axiosInstance 的 get 方法，获取聊天记录
        const response = await axiosInstance.get(API_PATHS.AI.GET_CHAT_HISTORY(documentId));
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to get chat history'};
    }
};

// 导出 AI 服务
const aiService = {
    // 生成 AI Flashcards
    generateFlashcards,
    // 生成 AI Quiz
    generateQuiz,
    // 生成 AI Summary
    generateSummary,
    // 和文档聊天
    chat,
    // 解释概念
    explainConcept,
    // 获取聊天记录
    getChatHistory,
};

export default aiService;