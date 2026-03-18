import Document from '../models/Document.js'
import Flashcard from '../models/Flashcard.js'
import Quiz from '../models/Quiz.js'

export const getDashboard = async (req, res, next) => {
    try {
        // 获取用户 ID
        const userId = req.user._id;

        // 统计用户所有文档数量
        const totalDocuments = await Document.countDocuments({ userId });
        // 统计用户所有 flashcard 集合数量
        const totalFlashcardSets = await Flashcard.countDocuments({ userId });
        // 统计用户所有 quiz 数量
        const totalQuizzes = await Quiz.countDocuments({ userId });
        // 统计用户所有 completedAt 不为空的 quiz 数量
        const completedQuizzes = await Quiz.countDocuments({ userId, completedAt: { $ne: null } });

        // 统计 flashcards 总数/已复习/已收藏数量
        const flashcardSets = await Flashcard.find({ userId })
        let totalFlashcards = 0;
        let reviewedFlashcards = 0;
        let starredFlashcards = 0;

        // forEach()遍历数组，但不返回新数组
        flashcardSets.forEach(set => {
            // 统计 flashcards 总数
            totalFlashcards += set.cards.length;
            // 统计已复习 flashcards 数量
            reviewedFlashcards += set.cards.filter(card => card.reviewCount > 0).length;
            // 统计已收藏 flashcards 数量
            starredFlashcards += set.cards.filter(card => card.isStarred).length;
        });

        // 统计用户所有 completedAt 不为空的 quiz 数量
        const quizzes = await Quiz.find({ userId, completedAt: { $ne: null } });
        // 计算用户所有 quiz 的平均分
        // reduce 计算总分，sum 是累加器，quiz 是当前 quiz
        // reduce() 是 数组累加函数
        // 计算平均分：totalScore / quizzes.length
        // Math.round() 四舍五入
        const averageScore = quizzes.length > 0
          ? Math.round(quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / quizzes.length)
          : 0;

        // 查询最近文档
        // sort({ uploadDate: -1 }) 按 uploadDate 字段排序，-1 表示倒序，最新文档排在顶部
        // limit(5) 限制返回5条数据
        // select('title fileName lastAccessed status') 选择 title、fileName、lastAccessed、status 字段
        const recentDocuments = await Document.find({ userId })
          .sort({ uploadDate: -1 })
          .limit(5)
          .select('title fileName lastAccessed status');

        // 查询最近 quiz
        // sort({ createdAt: -1 }) 按 createdAt 字段排序，-1 表示倒序，最新 quiz 排在顶部
        // limit(5) 限制返回5条数据
        // populate('documentId', 'title fileName') 关联 document，选择 title、fileName 字段
        // select('title documentId score completedAt') 选择 title、documentId、score、completedAt 字段
        const recentQuizzes = await Quiz.find({ userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('documentId', 'title fileName')
          .select('title documentId score completedAt');

        // 随机生成学习 streak
        // Math.random() 生成 0 到 1 之间的随机数
        // Math.floor() 向下取整
        // 生成 1 到 7 之间的随机整数
        const studyStreak = Math.floor(Math.random() * 7) + 1;


        // 返回成功响应
        res.status(200).json({
            success: true,
            data: {
                overview: {
                    // totalDocuments	文档总数totalFlashcardSets	
                    // flashcard sets 数量
                    // totalFlashcards	flashcards 总数
                    // reviewedFlashcards	复习过的卡片
                    // starredFlashcards	收藏卡片
                    // totalQuizzes	quiz 总数
                    // completedQuizzes	完成的 quiz
                    // averageScore	平均分
                    // studyStreak	学习连续天数
                    totalDocuments,
                    totalFlashcardSets,
                    totalFlashcards,
                    reviewedFlashcards,
                    starredFlashcards,
                    totalQuizzes,
                    completedQuizzes,
                    averageScore,
                    studyStreak,
                },
                // 返回最近活动：最近文档和最近 quiz
                recentActivity: {
                    documents: recentDocuments,
                    quizzes: recentQuizzes,
                },
            },
        })
    } catch (error) {
        next(error);
    }
}