import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';


// 调用后端 API 获取指定文档的测验
const getQuizzesForDocument = async (documentId) => {
    try {
        // 调用 axiosInstance 的 get 方法，获取指定文档的测验
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC(documentId));
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to get quizzes for document'};
    }
};


// 调用后端 API 获取指定测验
const getQuizById = async (id) => {
    try {
        // 调用 axiosInstance 的 get 方法，获取指定测验
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_BY_ID(id));
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to get quiz by id'};
    }
};


// 调用后端 API 提交测验
const submitQuiz = async (id, answers) => {
    try {
        // 调用 axiosInstance 的 post 方法，提交测验
        const response = await axiosInstance.post(API_PATHS.QUIZZES.SUBMIT_QUIZ(id), { answers });
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to submit quiz'};
    }
};


// 调用后端 API 获取测验结果
const getQuizResults = async (quizId) => {
    try {
        // 调用 axiosInstance 的 get 方法，获取测验结果
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId));
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to get quiz results'};
    }
};



// 调用后端 API 删除测验
const deleteQuiz = async (id) => {
    try {
        // 调用 axiosInstance 的 delete 方法，删除测验
        const response = await axiosInstance.delete(API_PATHS.QUIZZES.DELETE_QUIZ(id));
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to delete quiz'};
    }
};

// 导出 quizService
const quizService = {
    getQuizzesForDocument,
    getQuizById,
    submitQuiz,
    getQuizResults,
    deleteQuiz,
};

export default quizService;