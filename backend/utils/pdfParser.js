//这是 Node.js 的 文件系统模块 Promise 版本。
// 作用：读取 / 写入 / 删除 文件。
import fs from 'fs/promises'
//这是一个 PDF 解析库。
// 作用：从 PDF 文件中提取文本。
import { PDFParse } from 'pdf-parse'


// filePath: PDF 文件路径
export const extractTextFromPDF = async (filePath) => {
    try {
        // 把 PDF 文件读到内存里, 返回一个 Buffer 对象(二进制数据)
        const dataBuffer = await fs.readFile(filePath)

        // 创建一个 PDF 解析对象
        const parser = new PDFParse({ data: dataBuffer })
        // 解析 PDF 文件，返回一个包含文本、页数、元数据的对象
        // PDF → 解析 → 提取文本
        const data = await parser.getText()
        // 销毁解析对象，释放内存
        await parser.destroy()

        return {
            // PDF 中所有提取的文本
            text: data.text,
            // 页数
            // 意思是按优先级取值：
            // 优先用 data.total
            // 如果 data.total 是 null/undefined，就用 data.numpages
            // 如果 data.numpages 也是 null/undefined，就用 0
            numPages: data.total ?? data.numpages ?? 0,
            // 元数据
            // 意思是按优先级取值：
            // 优先用 data.info
            // 如果 data.info 是 null/undefined，就用 {}
            info: data.info ?? {},
        }
    } catch (error) {
        console.error('PDF parsing error:', error)
        throw new Error("Failed to extract text from PDF");
    }
}
