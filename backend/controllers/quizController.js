import Quiz from '../models/Quiz.js'


// 获取某个 document 的所有 quizzes
export const getQuizzes = async (req, res, next) => {
    try {

    // 根据用户 ID 和文档 ID 查找 quizzes
    const quizzes = await Quiz.find({
        userId: req.user._id,
        documentId: req.params.documentId,
      })
      // 关联 document，选择 title、fileName 字段
      .populate('documentId', 'title fileName')
      // 按创建时间排序，-1 表示倒序，最新创建的排在前面
      .sort({ createdAt: -1 });

      // 返回成功响应
      res.status(200).json({
        success: true,
        count: quizzes.length,
        data: quizzes,
      })
    } catch (error) {
      next(error);
    }
}


// 获取某个 quiz 的详情
export const getQuizById = async (req, res, next) => {
    try {
        // 根据 quiz ID 和用户 ID 查找 quiz
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        // 如果 quiz 不存在，则返回错误
        if(!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 404,
            })
        }

        // 返回成功响应
        res.status(200).json({
            success: true,
            data: quiz,
        })
    } catch (error) {
        next(error);
    }
}

// 提交 quiz
export const submitQuiz = async (req, res, next) => {
    try {

        // 解构赋值，answers 是用户提交的答案
        const { answers } = req.body;

        // 如果 answers 不是数组，则返回错误
        if(!Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                error: 'Answers must be an array',
                statusCode: 400,
            })
        }
        
        // 根据 quiz ID 和用户 ID 查找 quiz
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        // 如果 quiz 不存在，则返回错误
        if(!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 404,
            })
        }

        // 如果 quiz 已经完成，则返回错误
        if (quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: 'Quiz already completed',
                statusCode: 400,
            })
        }

        // 统计正确答案数量
        let correctCount = 0;
        // 用户答案数组
        const userAnswers = [];

        // 遍历用户提交的答案
        answers.forEach(answer => {
            // 解构赋值，questionIndex 是问题索引，selectedAnswer 是用户选择的答案
            const { questionIndex, selectedAnswer } = answer;
            // 根据问题索引查找问题
            const question = quiz.questions[questionIndex];
            // 判断用户选择的答案是否正确
            const isCorrect = question && String(selectedAnswer).trim() === String(question.correctAnswer).trim();

            // 如果用户选择的答案正确，则增加正确答案数量
            if (isCorrect) {
                correctCount++;
            }

            // 将用户答案添加到用户答案数组中
            userAnswers.push({
                questionId: questionIndex,
                selectedAnswer,
                // 保证 isCorrect 是布尔值
                isCorrect: !!isCorrect,
                answeredAt: new Date(),
            });
        });
        
        // 计算得分：正确答案数量 / 总问题数 * 100，四舍五入
        const score = Math.round((correctCount / quiz.totalQuestions) * 100);

        // 将用户答案添加到 quiz 中
        quiz.userAnswers = userAnswers;
        // 将得分添加到 quiz 中
        quiz.score = score;
        // 将完成时间添加到 quiz 中
        quiz.completedAt = new Date();
        // 保存 quiz
        await quiz.save();

        // 返回成功响应
        res.status(200).json({
            success: true,
            data: {
                quizId: quiz._id,
                score,
                correctCount,
                totalQuestions: quiz.totalQuestions,
                percentage: score,
                userAnswers
            },
            message: 'Quiz submitted successfully',
        })
    } catch (error) {
        next(error);
    }
}


// 获取 quiz 的结果
export const getQuizResults = async (req, res, next) => {
    try {

        // 根据 quiz ID 和用户 ID 查找 quiz
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate('documentId', 'title');

        // 如果 quiz 不存在，则返回错误
        if(!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 404,
            })
        }

        // 如果 quiz 未完成，则返回错误
        if(!quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: 'Quiz not completed',
                statusCode: 400,
            })
        }
        

        // 生成 Quiz 的详细结果（detailedResults），通常用于 结果页面 / 查看答题情况
        // 把 quiz.questions 和 userAnswers 合并; 生成每题的详细结果
        const detailedResults = quiz.questions.map((question, index) => {

            // 找到当前题目的用户答案
            const userAnswer = quiz.userAnswers.find(answer => answer.questionId === index);

            // 返回每题的详细结果
            return {
                // 问题索引
                questionIndex: index,
                // 问题
                question: question.question,
                // 选项
                options: question.options,
                // 正确答案
                correctAnswer: question.correctAnswer,
                // 用户选择的答案
                selectedAnswer: userAnswer?.selectedAnswer || null,
                // 是否正确
                isCorrect: userAnswer?.isCorrect || false,
                // 解释
                explanation: question.explanation,
            }
        });

        // 返回成功响应
        res.status(200).json({
            success: true,
            data: {
                // quiz 基本信息
                quiz: {
                    // quiz ID
                    id: quiz._id,
                    // quiz 标题
                    title: quiz.title,
                    // quiz 文档 ID
                    document: quiz.documentId,
                    // 得分
                    score: quiz.score,
                    // 总问题数
                    totalQuestions: quiz.totalQuestions,
                    // 完成时间
                    completedAt: quiz.completedAt,   
                },
                // 详细结果
                results: detailedResults,
            },
        })
    } catch (error) {
        next(error);
    }
}


// 删除 quiz
export const deleteQuiz = async (req, res, next) => {
    try {
        // 根据 quiz ID 和用户 ID 查找 quiz
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        // 如果 quiz 不存在，则返回错误
        if(!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 404,
            })
        }

        // 删除 quiz
        await quiz.deleteOne();

        // 返回成功响应
        res.status(200).json({
            success: true,
            message: 'Quiz deleted successfully',
        })
    } catch (error) {
        next(error);
    }
}
