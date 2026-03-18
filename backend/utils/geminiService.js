import dotenv from 'dotenv'
import { GoogleGenAI } from '@google/genai'

// 加载环境变量
dotenv.config()

// 如果 GEMINI_API_KEY 没有设置，则退出进程
if (!process.env.GEMINI_API_KEY) {
    console.error('FATAL: GEMINI_API_KEY is not set');
    // 退出进程，退出码为1，表示进程异常退出
    process.exit(1);
}

// 创建 GoogleGenAI 实例
// apiKey: GEMINI_API_KEY 是环境变量，从 .env 文件中读取
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


//async：因为里面要请求模型 API，需要 await
// text：原始资料文本
// count：想要多少张卡片，默认 10
export const generateFlashcards = async (text, count = 10) => {

    // 它是在用 模板字符串（template literal） 拼出一段要发给大模型的指令（prompt），
    // 让模型根据 text 生成 count 张 flashcard，并且要求输出格式固定，方便你后面用程序解析。

    // 使用反引号 `, 可以写多行字符串。
    // 还能用 ${...} 把变量插进去。

    // 这段是在给模型一个“模板”，要求每张卡必须包含三行：
    // Q: 开头：问题
    // A: 开头：答案
    // D: 开头：难度（限制在 easy/medium/hard）
    // 这一步非常关键，因为你后面解析就是靠 line.startsWith('Q:') 等规则来判断每行内容

    // 每张卡片之间用 --- 分隔

    // 把原文 text 放进 prompt（提供素材），让模型根据它生成 count 张卡片

    // 如果 text 长度超过 15000，则截取前 15000 个字符

    const prompt = `Generate exactly ${count} educational flashcards from the following text.
    Format each flashcard as:
    Q: [Clear, specific question]
    A: [Concise, accurate answer]
    D: [Difficulty level: easy, medium, or hard]

    Separate each flashcard with "---"
    Text:
    ${text.substring(0, 15000)}`;

    try {
        // 这是你当前使用的 Gemini SDK（或封装库）里的一个方法，作用是：向指定的 Gemini 模型发起一次“内容生成”请求，并返回模型生成的结果。
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            // 把 prompt 当作输入内容，发给模型
            contents: prompt,
        });

        // 拿到模型生成的文本
        const generatedText = response.text;
        // 准备一个数组存结果
        const flashcards = [];
        // 按分隔符拆分卡片
        // 把 generatedText 按 --- 分隔，得到一个数组
        // .filter(c => c.trim())
        // 作用：去掉空字符串或只包含空白字符的块。
        const cards = generatedText.split('---').filter(c => c.trim());

        // 把模型生成的文本，解析成结构化的 flashcard 对象数组
        // cards 是你之前通过 split('---') 得到的数组
        // 每个 card 是一整张卡片的文本
        for (const card of cards) {
            // trim() 去掉首尾空白
            // split('\n') 按换行符拆成数组
            const lines = card.trim().split('\n');
            // 默认值：
            // question → 空字符串
            // answer → 空字符串
            // difficulty → 默认 medium
            let question = '', answer = '', difficulty = 'medium';

            for (const line of lines) {
                // 如果 line 以 Q: 开头
                if (line.startsWith('Q:')) {
                    // 去掉 Q: 和后面的空格，得到问题
                    question = line.substring(2).trim();
                } else if (line.startsWith('A:')) {
                    answer = line.substring(2).trim();
                // 如果 line 以 D: 开头
                } else if (line.startsWith('D:')) {
                    // 去掉 D: 和后面的空格，得到难度
                    const diff = line.substring(2).trim().toLowerCase();
                    // 如果难度是 easy、medium 或 hard，则赋值给 difficulty
                    if (['easy', 'medium', 'hard'].includes(diff)) {
                        difficulty = diff;
                    }
                }
            }

            // 只有当 question 和 answer 都“存在”时，才把这张卡片加入数组
            if (question && answer) {
                flashcards.push({ question, answer, difficulty });
            }
        }

        // 返回前 count 张卡片
        return flashcards.slice(0, count);
    } catch (error) {
        // 如果出错，打印错误信息，并抛出错误
        console.error('Gemini API error:', error);
        // 抛出错误，让上层代码知道这里出问题了
        throw new Error('Failed to generate flashcards');
    }
}


export const generateQuiz = async (text, numQuestions = 5) => {
    const prompt = `Generate exactly ${numQuestions} educational quiz questions from the following text.
    Format each question as:
    Q: [Question]
    O1: [Option 1]
    O2: [Option 2]
    O3: [Option 3]
    O4: [Option 4]
    C: [Correct option - exactly as written above]
    E: [Brief Explanation]
    D: [Difficulty level: easy, medium, or hard]

    Separate each question with "---"
    Text:
    ${text.substring(0, 15000)}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            // 把 prompt 当作输入内容，发给模型
            contents: prompt,
        });

        // 拿到模型生成的文本
        const generatedText = response.text;
        // 准备一个数组存结果
        const questions = [];
        // 按分隔符拆分问题
        const questionBlocks = generatedText.split('---').filter(q => q.trim());

        // 把模型生成的文本，解析成结构化的 quiz 对象数组
        // questionBlocks 是你之前通过 split('---') 得到的数组
        // 每个 questionBlock 是一整道题的文本
        for (const block of questionBlocks) {
            // 按换行符拆成数组
            const lines = block.trim().split('\n');
            // 默认值：
            // question → 空字符串
            // options → 空数组
            // correctAnswer → 空字符串
            // explanation → 空字符串
            // difficulty → 默认 medium
            let question = '', options = [], correctAnswer = '', explanation = '', difficulty = 'medium';

            for (const line of lines) {
                // 去掉首尾空白
                const trimmed = line.trim();
                // 如果 line 以 Q: 开头
                if (trimmed.startsWith('Q:')) {
                    // 去掉 Q: 和后面的空格，得到问题
                    question = trimmed.substring(2).trim();
                // 如果 line 以 O: 开头
                } else if (trimmed.match(/^O\d:/)) {
                    // 去掉 O: 和后面的空格，得到选项
                    options.push(trimmed.substring(3).trim());
                } else if (trimmed.startsWith('C:')) {
                    // 去掉 C: 和后面的空格，得到正确答案
                    correctAnswer = trimmed.substring(2).trim();
                } else if (trimmed.startsWith('E:')) {
                    // 去掉 E: 和后面的空格，得到解释
                    explanation = trimmed.substring(2).trim();
                } else if (trimmed.startsWith('D:')) {
                    // 去掉 D: 和后面的空格，得到难度
                    const diff = trimmed.substring(2).trim().toLowerCase();
                    // 如果难度是 easy、medium 或 hard，则赋值给 difficulty
                    if (['easy', 'medium', 'hard'].includes(diff)) {
                        difficulty = diff;
                    }
                }
            }

            // 只有当 question、options、correctAnswer 都“存在”时，才把这道题加入数组
            if (question && options.length === 4 && correctAnswer) {
                questions.push({ question, options, correctAnswer, explanation, difficulty });
            }
        }

        // 返回前 numQuestions 道题
        return questions.slice(0, numQuestions);
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to generate quiz');
    }
}


export const generateSummary = async (text) => {
    const prompt = `Generate a concise summary of the following text, highlighting the main points and key ideas.

    Text:
    ${text.substring(0, 20000)}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });

        // 拿到模型生成的文本
        return response.text;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to generate summary');
    }
}

// 这段 chatWithContext 函数实现的是 基于上下文的 AI 问答（RAG 的简化版）。
// 根据 用户问题 + 文档片段(chunks)，调用 AI 生成一个基于文档内容的回答。
export const chatWithContext = async (question, chunks) => {

    // chunks = [{ content: "Artificial Intelligence is..." },
    // { content: "Machine learning is a subset..." }]
    // 这些是 从 PDF / 文档切分出来的文本块。
    // 这样 AI 不需要读完整文档，只看相关片段。

    // c = chunk 对象; i = index
    // join() 方法将数组中的所有元素连接成一个字符串，并返回这个字符串。
    const context = chunks.map((c, i) => `[Chunk ${i+1}]\n ${c.content}`).join('\n\n');

    // 这个 prompt 是在告诉 AI：只根据这些 chunk 回答问题。
    const prompt = `Answer the following question based on the provided text chunks.

    Context:
    ${context}

    Question:
    ${question}

    Answer:
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });

        // 拿到模型生成的文本
        return response.text;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to chat with context');
    }
}


// 这段 explainConcept 函数实现的是 解释概念（RAG 的简化版）。
// 根据 概念（concept） 和 上下文（context），让 AI 生成一个清晰简洁的解释。
export const explainConcept = async (concept, context) => {
    // 这句话告诉 AI：请用清晰简洁的方式解释概念，并参考提供的上下文。
    const prompt = `Explain the following concept in a clear and concise manner, using the provided context to support your explanation.

    Concept: ${concept}

    Context:
    ${context.slice(0, 10000)}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to explain concept');
    }
}
