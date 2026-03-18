import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';


// 调用后端 API 获取所有文档
const getDocuments = async () => {
    try {
        // 调用 axiosInstance 的 get 方法，获取所有文档
        const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS);
        // 返回响应数据
        return response?.data.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to get documents'};
    }
};

// 调用后端 API 获取指定文档
const getDocumentById = async (id) => {
    try {
        // 调用 axiosInstance 的 get 方法，获取指定文档
        const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(id));
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to get document by id'};
    }
};


// 调用后端 API 上传文档
const uploadDocument = async (formData) => {
    try {
        // 调用 axiosInstance 的 post 方法，上传文档
        const response = await axiosInstance.post(API_PATHS.DOCUMENTS.UPLOAD, formData, {
            headers: {
                // 设置请求头，告诉服务器发送的是 multipart/form-data 类型的数据
                'Content-Type': 'multipart/form-data',
            },
        });
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to upload document'};
    }
};


// 调用后端 API 删除文档
const deleteDocument = async (id) => {
    try {
        // 调用 axiosInstance 的 delete 方法，删除文档
        const response = await axiosInstance.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(id));
        // 返回响应数据
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: 'Failed to delete document'};
    }
};

// 导出 documentService
const documentService = {
    getDocuments,
    getDocumentById,
    uploadDocument,
    deleteDocument,
};

export default documentService;