import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';


// 调用后端 API 获取所有学习卡片
const getAllFlashcards = async () => {
    try {
        // 调用 axiosInstance 的 get 方法，获取所有学习卡片
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FLASHCARD_SETS);
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to get all flashcards'};
    }
};

// 调用后端 API 获取指定文档的学习卡片
const getFlashcardsForDocument = async (documentId) => {
    try {
        // 调用 axiosInstance 的 get 方法，获取指定文档的学习卡片
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(documentId));
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to get flashcards for document'};
    }
};

// 调用后端 API 复习学习卡片
const reviewFlashcard = async (cardId, cardIndex) => {
    try {
        // 调用 axiosInstance 的 post 方法，复习学习卡片
        const response = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId), { cardIndex });
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to review flashcard'};
    }
};

// 调用后端 API 切换学习卡片星级
const toggleStar = async (cardId) => {
    try {
        // 调用 axiosInstance 的 put 方法，切换学习卡片星级
        const response = await axiosInstance.put(API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId));
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to toggle star flashcard'};
    }
};

// 调用后端 API 删除学习卡片
const deleteFlashcardSet = async (id) => {
    try {
        // 调用 axiosInstance 的 delete 方法，删除学习卡片
        const response = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id));
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to delete flashcard set'};
    }
};

// 调用后端 API 生成学习卡片
const generateFlashcards = async (documentId) => {
    try {
        // 调用 axiosInstance 的 post 方法，生成学习卡片
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, { documentId });
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to generate flashcards' };
    }
};

// 导出 flashcardService
const flashcardService = {
    getAllFlashcards,
    getFlashcardSets: getAllFlashcards,
    getFlashcardsForDocument,
    reviewFlashcard,
    toggleStar,
    generateFlashcards,
    deleteFlashcardSet,
};

export default flashcardService;