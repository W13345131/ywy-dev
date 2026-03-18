import Task from '../../models/Task_manager/Task.js'
import User from '../../models/User.js'
import exceljs from 'exceljs'

// 导出任务excel
export const exportTasksReport = async (req, res, next) => {

    try {

        // 查询所有任务，并关联 assignedTo 字段, 只返回 username 和 email 字段
        const tasks = await Task.find().populate('assignedTo', 'username email')

        // 创建 Excel 工作簿
        const workbook = new exceljs.Workbook()

        // 创建 Excel 工作表
        const worksheet = workbook.addWorksheet('Tasks')

        // 设置工作表列
        worksheet.columns = [
            // width: 25 表示列宽为 25 个字符
            { header: 'Task ID', key: '_id', width: 25 },
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Assigned To', key: 'assignedTo', width: 30 },
            { header: 'Status', key: 'status', width: 20 },
            { header: 'Priority', key: 'priority', width: 15 },
            { header: 'Due Date', key: 'dueDate', width: 20 },
        ]

        // 遍历任务，添加到工作表
        tasks.forEach(task => {
            // 设置 assignedTo 变量，默认值为 "Unassigned"
            let assignedTo = "Unassigned";
            // 如果 assignedTo 是数组，则将 assignedTo 设置为数组中的 username 和 email
            if (Array.isArray(task.assignedTo)) {
                // 遍历 assignedTo 数组，将 username 和 email 拼接起来
                assignedTo = task.assignedTo
                  .map(user => `${user.username} (${user.email})`)
                  .join(", ");
                } else if (task.assignedTo) {
                    // 如果 assignedTo 是对象，则将 assignedTo 设置为对象中的 username 和 email
                    assignedTo = `${task.assignedTo.username} (${task.assignedTo.email})`;
                }

            // addRow 添加一行数据到工作表
            worksheet.addRow({
                // 设置任务 ID
                _id: task._id,
                // 设置任务标题
                title: task.title,
                // 设置任务描述
                description: task.description,
                // 设置 assignedTo
                assignedTo: assignedTo || 'Unassigned',
                // 设置任务状态
                status: task.status,
                // 设置任务优先级
                priority: task.priority,
                // 设置任务截止日期
                // toISOString() 将日期转换为 ISO 格式; ISO 格式为：YYYY-MM-DDTHH:MM:SS.SSSZ
                // split('T') 将日期转换为数组，数组中的第一个元素为日期，第二个元素为时间
                // split('T')[0] 取数组中的第一个元素，即日期
                dueDate: task.dueDate.toISOString().split('T')[0],
            })
        })

        // 将工作簿转换为 buffer，并设置响应头
        const buffer = await workbook.xlsx.writeBuffer()
        // 设置响应头，告诉浏览器这是一个 Excel 文件
        // Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet 表示这是一个 Excel 文件
        // Content-Disposition: attachment; filename=tasks_report.xlsx 表示文件名称为 tasks_report.xlsx
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename=tasks_report.xlsx')
        // 发送 buffer 给客户端
        res.send(buffer)

    } catch (error) {
        next(error)
    }
}

// 导出用户excel
export const exportUsersReport = async (req, res, next) => {

    try {

        // 查询所有用户，并只返回 username、email 和 _id 字段
        // lean() 返回纯 JavaScript 对象，而不是 Mongoose 文档
        const users = await User.find().select('username email _id').lean()

        // 查询所有任务，并关联 assignedTo 字段, 只返回 username、email 和 _id 字段
        const userTasks = await Task.find().populate('assignedTo', 'username email _id')

        // 创建一个对象，用于存储用户任务统计信息
        const userTaskMap = {};

        // 遍历用户，初始化用户任务统计信息
        users.forEach(user => {
            // 为每个用户初始化一个统计对象，用来记录该用户的任务统计信息
            // userTaskMap[user._id] 表示用户 ID 为 user._id 的统计对象,这是 JavaScript 的 动态 key 写法
            userTaskMap[user._id] = {
                name: user.username,
                email: user.email,
                totalTasks: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            }
        })

        // 遍历任务，统计用户任务统计信息（assignedTo 支持数组）
        userTasks.forEach(task => {
            const assignees = Array.isArray(task.assignedTo) ? task.assignedTo : (task.assignedTo ? [task.assignedTo] : []);
            // 遍历 assignees 数组，统计用户任务统计信息
            assignees.forEach(user => {
                // 如果 user 存在，并且 userTaskMap 中存在 user._id，则统计用户任务统计信息
                if (user?._id && userTaskMap[user._id]) {
                    // 统计用户总任务数量
                    userTaskMap[user._id].totalTasks += 1;
                    // 统计用户 Pending 任务数量
                    if (task.status === 'Pending') userTaskMap[user._id].pendingTasks += 1;
                    // 统计用户 In Progress 任务数量
                    else if (task.status === 'In Progress') userTaskMap[user._id].inProgressTasks += 1;
                    // 统计用户 Completed 任务数量
                    else if (task.status === 'Completed') userTaskMap[user._id].completedTasks += 1;
                }
            });
        })

        // 创建 Excel 工作簿
        const workbook = new exceljs.Workbook()
        // 创建 Excel 工作表
        const worksheet = workbook.addWorksheet('User Task Report')
        // 设置工作表列
        worksheet.columns = [
            // width: 30 表示列宽为 30 个字符
            { header: 'User Name', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 40 },
            { header: 'Total Assigned Tasks', key: 'totalTasks', width: 20 },
            { header: 'Pending Tasks', key: 'pendingTasks', width: 20 },
            // 统计用户 In Progress 任务数量
            {
                header: 'In Progress Tasks',
                key: 'inProgressTasks',
                width: 20,
            },
            // 统计用户 Completed 任务数量
            {
                header: 'Completed Tasks',
                key: 'completedTasks',
                width: 20,
            }
        ]

        // 遍历用户任务统计信息，添加到工作表
        // Object.values()取出对象的 所有 value，变成数组，然后遍历数组
        Object.values(userTaskMap).forEach(user => {
            // 添加一行数据到工作表
            // user 表示当前遍历到的用户统计对象
            worksheet.addRow(user);
        })

        // 将工作簿转换为 buffer，并设置响应头
        const buffer = await workbook.xlsx.writeBuffer()
        // 设置响应头，告诉浏览器这是一个 Excel 文件
        // Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet 表示这是一个 Excel 文件
        // Content-Disposition: attachment; filename=user_task_report.xlsx 表示文件名称为 user_task_report.xlsx
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename=user_task_report.xlsx')
        // 发送 buffer 给客户端
        res.send(buffer)



    } catch (error) {
        next(error)
    }
}