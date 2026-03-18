import Flashcard from '../models/Flashcard.js'


export const getFlashcards = async (req, res, next) => {
    try {

        // 根据用户 ID 和文档 ID 查找 flashcards
        const flashcards = await Flashcard.find({
            userId: req.user._id,
            documentId: req.params.documentId,
        })
          // 关联文档，返回文档的标题和文件名
          .populate('documentId', 'title fileName')
          // 按创建时间排序，-1 表示倒序，最新创建的排在前面
          .sort({ createdAt: -1 });

        // 返回成功响应
        res.status(200).json({
            success: true,
            count: flashcards.length,
            data: flashcards,
        })
    } catch (error) {
        next(error);
    }
}



export const getAllFlashcardSets = async (req, res, next) => {
    try {
        // 查询 MongoDB 中符合条件的所有 flashcardSets
        const flashcardSets = await Flashcard.find({ userId: req.user._id })
          // 关联文档，返回文档的标题
          .populate('documentId', 'title')
          // 按创建时间排序，-1 表示倒序，最新创建的排在前面
          .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: flashcardSets.length,
            // 返回flashcardSets数据列表
            data: flashcardSets,
        })
    } catch (error) {
        next(error);
    }
}


// 当用户复习一张 flashcard 时，更新这张卡片的复习时间和复习次数
export const reviewFlashcard = async (req, res, next) => {
    try {
        // 根据用户 ID 和卡片 ID 查找 flashcardSet
        const flashcardSet = await Flashcard.findOne({
            'cards._id': req.params.cardId,
            userId: req.user._id,
        });

        // 如果 flashcardSet 不存在，则返回错误
        if(!flashcardSet) {
            return res.status(404).json({
                success: false,
                error: 'Flashcard set not found',
                statusCode: 404,
            })
        }

        // 比较时必须统一类型，所以转换成字符串
        // 找到 cards 数组里 _id 等于 cardId 的那一张卡片
        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);


        // 如果没有找到对应的 flashcard，就返回 404 错误。
        if(cardIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Card not found',
                statusCode: 404,
            })
        }
       
        // 记录用户最后复习时间
        flashcardSet.cards[cardIndex].lastReviewed = Date.now();
        // 复习次数加 1
        flashcardSet.cards[cardIndex].reviewCount += 1;

        // 把修改后的数据保存回 MongoDB
        await flashcardSet.save();

        // 返回成功响应
        res.status(200).json({
            success: true,
            data: flashcardSet,
            message: 'Flashcard reviewed successfully',
        })
    } catch (error) {
        next(error);
    }
}

// 当用户收藏一张 flashcard 时，更新这张卡片的收藏状态
export const toggleStarFlashcard = async (req, res, next) => {
    try {
        // 根据用户 ID 和卡片 ID 查找 flashcardSet
        const flashcardSet = await Flashcard.findOne({
            'cards._id': req.params.cardId,
            userId: req.user._id,
        });

        // 如果 flashcardSet 不存在，则返回错误
        if(!flashcardSet) {
            return res.status(404).json({
                success: false,
                error: 'Flashcard set not found',
                statusCode: 404,
            })
        }

        // 比较时必须统一类型，所以转换成字符串
        // 找到 cards 数组里 _id 等于 cardId 的那一张卡片
        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);

        // 如果没有找到对应的 flashcard，就返回 404 错误。s
        if(cardIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Card not found',
                statusCode: 404,
            })
        }

        // 更新卡片的收藏状态
        flashcardSet.cards[cardIndex].isStarred = !flashcardSet.cards[cardIndex].isStarred;
        // 把修改后的数据保存回 MongoDB
        await flashcardSet.save();

        // 返回成功响应
        res.status(200).json({
            success: true,
            data: flashcardSet,
            message: `Flashcard ${flashcardSet.cards[cardIndex].isStarred ? 'starred' : 'unstarred'}`,
        })
    } catch (error) {
        next(error);
    }
}


// 当用户删除一个 flashcard 集合时，删除整个集合
export const deleteFlashcardSet = async (req, res, next) => {
    try {
        // 根据用户 ID 和集合 ID 查找 flashcardSet
        const flashcardSet = await Flashcard.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        
        // 如果 flashcardSet 不存在，则返回错误
        if(!flashcardSet) {
            return res.status(404).json({
                success: false,
                error: 'Flashcard set not found',
                statusCode: 404,
            })
        }
        
        // 删除 flashcardSet
        await flashcardSet.deleteOne();

        // 返回成功响应
        res.status(200).json({
            success: true,
            message: 'Flashcard set deleted successfully',
        })
    } catch (error) {
        next(error);
    }
}