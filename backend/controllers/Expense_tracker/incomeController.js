import User from '../../models/User.js'
import Income from '../../models/Expense_tracker/Income.js'
import xlsx from 'xlsx'


// 添加收入
export const addIncome = async (req, res, next) => {

    // 获取用户 ID
    const userId = req.user._id

    try {
        // 解构赋值，icon 是图标，source 是来源，amount 是金额，date 是日期
        const { icon, source, amount, date } = req.body

        // 如果来源、金额、日期不存在，则返回错误
        if(!source || !amount || !date) {
            return res.status(400).json({
                success:false,
                error: 'All fields are required',
                statusCode: 400
            })
        }
        
        // 创建收入
        const income = await Income.create({
            userId,
            icon,
            source,
            amount,
            date
        })

        // 保存收入
        await income.save();

        // 返回成功响应
        res.status(201).json({
            success: true,
            data: income,
            message: 'Income added successfully',
        })

    } catch (error) {
        // 错误处理
        next(error)
    }   
}

// 获取所有收入
export const getAllIncomes = async (req, res, next) => {
    const userId = req.user._id

    try {

        // 查询所有收入
        const incomes = await Income.find({ userId })
        // 按日期排序，-1 表示倒序，最新收入排在前面
        .sort({ date: -1 })

        // 返回成功响应
        res.status(200).json({
            success: true,
            data: incomes,
            message: 'Incomes fetched successfully',
        })

    } catch (error) {
        // 错误处理
        next(error)
    }
}

// 删除收入
export const deleteIncome = async (req, res, next) => {
    const userId = req.user._id

    try {

        // 解构赋值，id 是收入 ID
        const { id } = req.params

        // 如果收入 ID 不存在，则返回错误
        if(!id) {
            return res.status(400).json({
                success:false,
                error: 'Income ID is required',
                statusCode: 400
            })
        }
        
        //删除收入
        await Income.findByIdAndDelete(id)

        // 返回成功响应
        res.status(200).json({
            success: true,
            message: 'Income deleted successfully',
        })

    } catch (error) {
        // 错误处理
        next(error)
    }
}

// 下载收入Excel（仅在内存生成，不写入服务器，直接返回给用户下载）
export const downloadIncomeExcel = async (req, res, next) => {
    // 获取用户 ID
    const userId = req.user._id

    try {
        // 查询所有收入
        const incomes = await Income.find({ userId })
            .sort({ date: -1 })

        const data = incomes.map(income => ({
            source: income.source,
            amount: income.amount,
            date: income.date
        }))

        // 创建 Excel 工作簿 (Workbook)
        const wb = xlsx.utils.book_new()
        // 创建 Excel 工作表 (Worksheet)
        const ws = xlsx.utils.json_to_sheet(data)
        // 将工作表加入工作簿
        xlsx.utils.book_append_sheet(wb, ws, 'Incomes')

        // 在内存中生成 buffer，不写入服务器磁盘
        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' })

        // 设置文件名
        const filename = 'incomes_details.xlsx'
        // 设置响应头
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`)
        // 发送 buffer 给客户端
        res.send(buffer)
    } catch (error) {
        next(error)
    }
}