import mongoose from 'mongoose'


// 这是一个 子文档 schema，用于任务中的 Checklist
const todoSchema = new mongoose.Schema({
    // text	        String	待办内容
    // completed	Boolean	是否完成
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
})

const taskSchema = new mongoose.Schema({
    // title   String	任务标题
    title: {
        type: String,
        required: true
    },
    // description	String	任务描述
    description: {
        type: String,
    },
    // priority	String	优先级
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    // status	String	状态
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    // dueDate	Date	截止日期
    dueDate: {
        type: Date,
        required: true
    },
    // assignedTo	ObjectId[]	指派给（支持多人）
    assignedTo: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: [],
    },
    // createdBy	ObjectId	创建者
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    // attachments	String[]	附件
    attachments: {
        type: [String],
    },
    // todoChecklist	Subdocument[]	待办清单
    todoChecklist: {
        type: [todoSchema],
    },
    // progress	Number	进度
    progress: {
        type: Number,
        default: 0
    }
}, {
    // 创建时间,更新时间
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

export default Task