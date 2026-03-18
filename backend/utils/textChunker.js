// 把一整篇文档切成多个 chunk（小文本块），方便 AI 处理。
// text：文档全文
// chunkSize：每个 chunk 最大词数
// overlap：chunk 之间重叠词数
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    // 如果 text 是空字符串或只包含空白字符，则返回空数组
    if(!text || text.trim().length === 0) {
        return [];
    }

    // 文本预处理
    const cleanedText = text
      // 统一换行符
      .replace(/\r\n/g, '\n')
      // 多空格压缩
      .replace(/\s+/g, ' ')
      // 清理换行周围空格
      .replace(/\n /g, '\n')
      .replace(/ \n/g, '\n')
      // 去掉文本首尾空格
      .trim();

    // 按段落拆分,按空行分段
    const paragraphs = cleanedText.split(/\n+/).filter(p => p.trim().length > 0);

    // chunks：最终 chunk 列表
    // currentChunk	当前 chunk 的段落
    // currentWordCount	当前 chunk 词数
    // chunkIndex	chunk 编号
    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;
    let chunkIndex = 0;

    // 逐段处理文本
    for (const paragraph of paragraphs) {
        // 统计段落词数
        // AI is powerful
        // 变成数组：['AI', 'is', 'powerful']
        const paragraphWords = paragraph.trim().split(/\s+/);
        // 词数：3
        const paragraphWordCount = paragraphWords.length;

        // 如果段落词数超过 chunkSize，则需要切分
        if (paragraphWordCount > chunkSize) {
            // 如果当前 chunk 不为空，则需要切分
            if (currentChunk.length > 0) {
                // 把当前 chunk 添加到 chunks 列表中
                chunks.push({
                    // 把段落合并成一个字符串
                    content: currentChunk.join('\n\n'),
                    // chunk 编号
                    chunkIndex: chunkIndex++,
                    // 页码
                    pageNumber: 0,
                });

                // 当前 chunk 已经保存完了，开始拼下一个 chunk
                // 清空当前 chunk
                currentChunk = [];
                // 清空当前 chunk 词数
                currentWordCount = 0;
            }
            
            // 把一个很长的段落按 chunkSize 拆成多个 chunk，并让相邻 chunk 共享 overlap 个词
            // 每次循环移动 (chunkSize - overlap) 个词，从而让相邻 chunk 共享 overlap 个词。

            // 假设：paragraphWords.length = 1200；chunkSize = 500；overlap = 50
            // 0-500 450-950 900-1200
            for (let i = 0; i < paragraphWords.length; i += (chunkSize - overlap)) {
                // 根据 i 截取一个 chunk（slice）：[0, 500] [450, 950] [900, 1200]
                const chunkWords = paragraphWords.slice(i, i + chunkSize);
                // 把 chunkWords 数组拼接成一个字符串，并添加到 chunks 列表中
                chunks.push({
                    // chunk 内容
                    content: chunkWords.join(' '),
                    // chunk 编号
                    chunkIndex: chunkIndex++,
                    // 页码
                    pageNumber: 0,
                });

                // 如果 i + chunkSize 小于 paragraphWords.length，则继续循环
                // 否则，结束循环
                if(i + chunkSize >= paragraphWords.length) break;
            }
            continue;
        }


        // currentWordCount：当前 chunk 里已经累计了多少词
        // paragraphWordCount：当前段落有多少词
        // chunkSize：一个 chunk 最大允许多少词
        // currentChunk.length > 0：当前 chunk 里确实已经有内容（不为空）

        // 如果把“当前段落”加进 currentChunk 后，会超过 chunkSize，并且 currentChunk 里已经有内容，
        // 那就先把 currentChunk 保存成一个 chunk，再开一个新的 chunk。
        if(currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0) {

            chunks.push({
                content: currentChunk.join('\n\n'),
                chunkIndex: chunkIndex++,
                pageNumber: 0,
            });

            // 把 currentChunk 的段落合并成一个大字符串
            const prevChunkText = currentChunk.join(' ');
            // 把上一块按词拆开
            const prevWords = prevChunkText.trim().split(/\s+/);
            // 取最后 overlap 和 prevWords.length 中较小者个词作为重叠文本
            const overlapText = prevWords.slice(-Math.min(overlap, prevWords.length)).join(' ');

            // 开始新的 currentChunk，并把 overlapText 放进去
            // overlapText 是上一块的最后 overlap 个词，paragraph.trim() 是当前段落的文本
            currentChunk = [overlapText, paragraph.trim()];
            // 更新 currentWordCount，把重叠文本和当前段落的词数加起来
            currentWordCount = overlapText.trim().split(/\s+/).length + paragraphWordCount;
        } else {
            // 把当前段落加进 currentChunk
            currentChunk.push(paragraph.trim());
            // 更新 currentWordCount，把当前段落的词数加起来
            currentWordCount += paragraphWordCount;
        }
    }

    // 如果 currentChunk 里还有内容，则需要保存成一个 chunk
    if (currentChunk.length > 0) {
        chunks.push({
            content: currentChunk.join('\n\n'),
            chunkIndex: chunkIndex++,
            pageNumber: 0,
        });
    }

    // chunks.length === 0 意思是：经过前面的“按段落切分 + 合并”流程，最终竟然一个 chunk 都没生成出来。
    // 如果文本不为空，但前面没切出任何 chunk，就用兜底方案按词切。
    if (chunks.length === 0 && cleanedText.length > 0) {
        // 把整篇 cleanedText 按空白拆成单词数组
        const allWords = cleanedText.split(/\s+/);
        for (let i = 0; i < allWords.length; i += (chunkSize - overlap)) {
            // 截取一个 chunk 的词
            const chunkWords = allWords.slice(i, i + chunkSize);
            chunks.push({
                content: chunkWords.join(' '),
                chunkIndex: chunkIndex++,
                pageNumber: 0,
            });

            // 如果 i + chunkSize 大于等于 allWords.length，则结束循环
            if(i + chunkSize >= allWords.length) break;
        }
    }

    return chunks;
};


// 给定用户问题 query 和文档切块 chunks，从中挑出最相关的最多 maxChunks 个块返回。

// query：用户输入的问题/查询
// chunks：chunkText 生成的数组（每项有 content、chunkIndex 等）
// maxChunks = 3：最多返回 3 个相关 chunk（默认 3）
export const findRelevantChunks = (query, chunks, maxChunks = 3) => {

    // 入口校验：没数据就直接返回
    if(!chunks || chunks.length === 0 || !query) {
        return [];
    }

    // 停用词（stop words）是 出现频率很高但信息量很低 的词，比如：
    // the, and, are, is, this, that, have, been...
    // 它们基本不帮助判断“相关性”
    // 如果你不去掉，查询 “what is AI” 里可能 what/is 会到处匹配，导致每个 chunk 都“看起来很相关”。
    const STOP_WORDS = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'has', 'her', 'was', 'one', 'our', 'out', 'had', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'she', 'two', 'use', 'way', 'who', 'did', 'with', 'this', 'that', 'from', 'have', 'been', 'they', 'will', 'more', 'when', 'what', 'your', 'said', 'each', 'which', 'their', 'time', 'than', 'then', 'some', 'into', 'just', 'very', 'also', 'back', 'after', 'about', 'there', 'could', 'would', 'these', 'other', 'where', 'being']);

    // queryWords：把 query 处理成“有效关键词”
    const queryWords = query
        // 转小写
        .toLowerCase()
        // 按空白拆成单词数组
        .split(/\s+/)
        // 只保留长度大于等于 2 的词。
        // 过滤掉停用词
        .filter(w => w.length >= 2 && !STOP_WORDS.has(w));


    // 当用户的 query 经过处理后 没有有效关键词 时，系统就直接返回前几个 chunk，而不是做相关性计算。
    if (queryWords.length === 0) {

        // 如果 query 没有有效关键词，就直接返回文档前几个 chunk 作为上下文。
        // 这样 AI 仍然可以回答问题，而不会返回空结果。
        return chunks.slice(0, maxChunks).map(chunk => ({
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id,
        }));
    }


    // 计算每个 chunk 与用户 query 的相关程度（score）。
    // chunk	当前文档块
    // index	chunk 在数组里的位置
    const scoredChunks = chunks.map((chunk, index) => {
        // 把 chunk 内容转小写
        const context = chunk.content.toLowerCase();
        // 统计词数
        const contextWords = context.split(/\s+/).length;
        let score = 0;

        // 遍历 queryWords，计算每个词在 chunk 中的匹配程度
        for (const word of queryWords) {
            // 精确匹配，匹配完整单词
            const exactMatches = (context.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
            // 每个完全匹配加3分
            score += exactMatches * 3;

            // 部分匹配，匹配单词前缀或后缀
            const partialMatches = (context.match(new RegExp(`\\b${word}`, 'g')) || []).length;
            // 每个部分匹配加1.5分，部分匹配里会包含完全匹配
            score += Math.max(0, partialMatches - exactMatches) * 1.5;
        }

        // 计算匹配了多少个 query 关键词
        const uniqueWordsFound = queryWords.filter(word => context.includes(word)).length;
        // 如果 chunk 同时包含多个 query 关键词，就给额外奖励。
        if (uniqueWordsFound > 1) {
            score += uniqueWordsFound * 2;
        }
        
        // 归一化分数
        const normalizedScore = score / Math.sqrt(contextWords);

        // 文档前面的 chunk 稍微更重要
        const positionBonus = 1 - (index / chunks.length) * 0.1;

        // content	chunk 文本
        // chunkIndex	chunk编号
        // pageNumber	页码
        // _id	数据库ID
        // score	最终评分
        // rawScore	原始分数
        // matchCount	匹配关键词数量
        return {
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id,
            score: normalizedScore * positionBonus,
            rawScore: score,
            matchCount: uniqueWordsFound,
        }
    });

    // 目标是从所有 scoredChunks 中 选出最相关的几个 chunk 返回给 AI。
    return scoredChunks
      // 过滤掉无关 chunk
      .filter(chunk => chunk.score > 0)
      // 按分数排序
      .sort((a, b) => {
        // 第一优先级：score
        if (a.score != b.score) {
            return b.score - a.score;
        }
        // 第二优先级：matchCount
        if (a.matchCount != b.matchCount) {
            return b.matchCount - a.matchCount;
        }
        // 第三优先级：chunkIndex
        return a.chunkIndex - b.chunkIndex;
      })
      // 取数组前 maxChunks 个元素。
      .slice(0, maxChunks);
};