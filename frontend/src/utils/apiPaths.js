export const BASE_URL = 'http://localhost:5555';

export const AUTH_API_PATHS = {
    AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        GET_PROFILE: '/api/auth/profile',
        UPDATE_PROFILE: '/api/auth/profile',
        CHANGE_PASSWORD: '/api/auth/change-password',
    },

    // id指数据库中某条数据的唯一标识
    // 使用箭头函数根据 id 动态生成 API URL
    DOCUMENTS: {
        UPLOAD: '/api/documents/upload',
        GET_DOCUMENTS: '/api/documents',
        GET_DOCUMENT_BY_ID: (id) => `/api/documents/${id}`,
        UPDATE_DOCUMENT: (id) => `/api/documents/${id}`,
        DELETE_DOCUMENT: (id) => `/api/documents/${id}`,
    },

    AI: {
        GENERATE_FLASHCARDS: '/api/ai/generate-flashcards',
        GENERATE_QUIZ: '/api/ai/generate-quiz',
        GENERATE_SUMMARY: '/api/ai/generate-summary',
        CHAT: '/api/ai/chat',
        EXPLAIN_CONCEPT: '/api/ai/explain-concept',
        GET_CHAT_HISTORY: (documentId) => `/api/ai/chat-history/${documentId}`,
    },

    FLASHCARDS: {
        GET_ALL_FLASHCARD_SETS: '/api/flashcards',
        GET_FLASHCARDS_FOR_DOC: (documentId) => `/api/flashcards/${documentId}`,
        REVIEW_FLASHCARD: (cardId) => `/api/flashcards/${cardId}/review`,
        TOGGLE_STAR: (cardId) => `/api/flashcards/${cardId}/star`,
        DELETE_FLASHCARD_SET: (id) => `/api/flashcards/${id}`,
    },

    QUIZZES: {
        GET_QUIZZES_FOR_DOC: (documentId) => `/api/quizzes/${documentId}`,
        GET_QUIZ_BY_ID: (id) => `/api/quizzes/quiz/${id}`,
        SUBMIT_QUIZ: (id) => `/api/quizzes/${id}/submit`,
        GET_QUIZ_RESULTS: (id) => `/api/quizzes/${id}/results`,
        UPDATE_QUIZ: (id) => `/api/quizzes/${id}/results`,
        DELETE_QUIZ: (id) => `/api/quizzes/${id}`,
    },

    PROGRESS: {
        GET_DASHBOARD: '/api/progress/dashboard',
    },

    INCOME: {
        ADD_INCOME: '/api/expense-tracker/income/add',
        GET_ALL_INCOMES: '/api/expense-tracker/income/getall',
        DELETE_INCOME: (id) => `/api/expense-tracker/income/delete/${id}`,
        DOWNLOAD_INCOME_EXCEL: '/api/expense-tracker/income/download',
    },

    EXPENSE: {
        ADD_EXPENSE: '/api/expense-tracker/expense/add',
        GET_ALL_EXPENSES: '/api/expense-tracker/expense/getall',
        DELETE_EXPENSE: (id) => `/api/expense-tracker/expense/delete/${id}`,
        DOWNLOAD_EXPENSE_EXCEL: '/api/expense-tracker/expense/download',
    },

    EXPENSE_DASHBOARD: {
        GET_EXPENSE_DASHBOARD: '/api/expense-tracker/expense-dashboard',
    },

    TASK_MANAGER: {
        GET_USERS: '/api/task-manager/users',
        GET_DASHBOARD_DATA: '/api/task-manager/tasks/dashboard-data',
        GET_USER_DASHBOARD_DATA: '/api/task-manager/tasks/user-dashboard-data',
        GET_ALL_TASKS: '/api/task-manager/tasks',
        GET_TASK_BY_ID: (taskId) => `/api/task-manager/tasks/${taskId}`,
        CREATE_TASK: '/api/task-manager/tasks',
        UPDATE_TASK: (taskId) => `/api/task-manager/tasks/${taskId}`,
        DELETE_TASK: (taskId) => `/api/task-manager/tasks/${taskId}`,
        UPDATE_TASK_STATUS: (taskId) => `/api/task-manager/tasks/${taskId}/status`,
        UPDATE_TASK_TODO_CHECKLIST: (taskId) => `/api/task-manager/tasks/${taskId}/todo`,
    },

    REPORT: {
        EXPORT_TASK: '/api/task-manager/reports/export/tasks',
        EXPORT_USER: '/api/task-manager/reports/export/users'
    },

    IMAGE: {
        UPLOAD_IMAGE: '/api/auth/upload-image'
    },

    MEDIA: {
        GET_USER_DATA: '/api/media/users/data',
        UPDATE_USER: '/api/media/users/update',
        GET_USER_PROFILE: (profileId) => `/api/media/users/profiles/${profileId}`,
        DISCOVER_USERS: '/api/media/users/discover',
        FOLLOW_USER: '/api/media/users/follow',
        CONNECT_USER: '/api/media/users/connect',
        ADD_POST: '/api/media/posts/add',
        GET_POSTS: '/api/media/posts/get',
        LIKE_POST: '/api/media/posts/like',
        GET_STORIES: '/api/media/stories/get',
        ADD_STORY: '/api/media/stories/add',
        GET_POST_COMMENTS: (postId) => `/api/media/posts/${postId}/comments`,
        ADD_POST_COMMENT: (postId) => `/api/media/posts/${postId}/comments`,
        ADD_COMMENT_REPLY: (postId, commentId) => `/api/media/posts/${postId}/comments/${commentId}/replies`,
        GET_RECENT_MESSAGES: '/api/media/messages/recent',
        GET_MESSAGES: (userId) => `/api/media/messages/conversation/${userId}`,
        SEND_MESSAGE: '/api/media/messages/send',
        GET_CONNECTIONS: '/api/media/users/connections',
        ACCEPT_CONNECTION: '/api/media/users/accept',
        UNFOLLOW_USER: '/api/media/users/unfollow',
    },

}

export const API_PATHS = AUTH_API_PATHS