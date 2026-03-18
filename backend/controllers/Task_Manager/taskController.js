import Task from '../../models/Task_manager/Task.js'


// 获取所有任务
export const getTasks = async (req, res, next) => {

    try {
        // 获取查询参数
        const { status } = req.query;

        // 创建过滤条件
        // 创建一个空对象
        let filter = {};

        // 如果 status 存在，则添加到 filter 中
        if(status) {
            filter.status = status;
        }

        // 声明一个新变量
        let tasks;

        // 如果用户是管理员，则查询所有任务
        if(req.user.role === 'admin') {
            // 去数据库里查询符合 filter 条件的任务，并且把任务里的 assignedTo 用户信息一并查出来
            // 最后查到的结果赋值给：tasks
            // 因为filter是空对象，所以会查询所有任务
            // .populate() 把原本存的 ObjectId，自动替换成对应集合里的完整数据
            // 第一个参数：'assignedTo'表示要填充哪个字段
            // 第二个参数：'username email profileImageUrl'表示：只取 User 表中的这几个字段
            tasks = await Task.find(filter).populate(
                'assignedTo',
                'username email profileImageUrl'
            );
        } else {
            // 如果用户是普通成员，则查询自己负责的任务（assignedTo 为数组时用 $in 匹配）
            tasks = await Task.find({ ...filter, assignedTo: { $in: [req.user._id] } }).populate(
                'assignedTo',
                'username email profileImageUrl'
            );
        }

        // 遍历每一个任务（task），计算它的 todoChecklist 中完成的数量，然后给任务对象新增一个字段 completedTodoCount
        // Promise.all() 会：同时执行所有查询,提高性能
        tasks = await Promise.all(tasks.map(async (task) => {

            // 计算 todoChecklist 中完成的数量
            const completedCount = task.todoChecklist.filter(item => item.completed).length;

            // 返回一个新的任务对象，这个对象是原来的任务对象，但是新增了一个字段 completedTodoCount 用于统计 todoChecklist 中完成的数量
            return {
                ...task.toObject(),
                completedTodoCount: completedCount,
            }
        }));


        // 统计所有任务数量
        const allTasks = await Task.countDocuments(
            // 如果用户是 admin，则查询所有任务
            // $in 表示 in the array，表示在数组中
            req.user.role === 'admin' ? {} : { assignedTo: { $in: [req.user._id] } }
        );

        // 统计 Pending 任务数量
        const pendingTasks = await Task.countDocuments({
            // 展开 filter 对象，把 filter 对象中的所有字段都添加到查询条件中
            ...filter,
            status: 'Pending',
            // 如果用户不是 admin，则添加 assignedTo 条件
            // member时，第一个条件为true，结果{ assignedTo: req.user._id }
            // admin时，第一个条件为false，结果{}
            ...(req.user.role !== 'admin' && { assignedTo: { $in: [req.user._id] } }),
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            ...(req.user.role !== 'admin' && { assignedTo: { $in: [req.user._id] } }),
            status: 'In Progress',
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            // 如果用户不是 admin，则添加 assignedTo 条件
            // member时，第一个条件为true，结果{ assignedTo: req.user._id }
            // admin时，第一个条件为false，结果{}
            ...(req.user.role !== 'admin' && { assignedTo: { $in: [req.user._id] } }),
            status: 'Completed',
        });

        res.json({
            tasks,
            // statusSummary 的作用是：返回任务状态的统计信息，让前端可以快速显示任务概览（dashboard统计）
            statusSummary: {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            },
        });

    } catch (error) {
        next(error)
    }
}


// 获取单个任务
export const getTaskById = async (req, res, next) => {
    try {

        // 根据任务 ID 查询任务，并且把任务里的 assignedTo 用户信息一并查出来
        const task = await Task.findById(req.params.id).populate(
            'assignedTo',
            'username email profileImageUrl'
        );

        if(!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found',
                statusCode: 404,
            })
        }

        res.json(task);

    } catch (error) {
        next(error)
    }
}

// 创建任务
export const createTask = async (req, res, next) => {
    try {

        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist
        } = req.body;

        // assignedTo 校验：支持数组或单个 ID，存储为数组
        let assignedToIds = [];
        // 如果 assignedTo 是数组，则把 assignedTo 赋值给 assignedToIds
        if (Array.isArray(assignedTo) && assignedTo.length > 0) {
            assignedToIds = assignedTo;
        } else if (assignedTo) {
            // 如果 assignedTo 是单个 ID，则把 assignedTo 赋值给 assignedToIds
            assignedToIds = [assignedTo];
        }
        if (assignedToIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'At least one assigned user is required',
                message: 'At least one assigned user is required',
                statusCode: 400,
            })
        }

        // 创建任务
        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo: assignedToIds,
            createdBy: req.user._id,
            attachments: attachments || [],
            todoChecklist: todoChecklist || [],
        })

        res.status(201).json({
            success: true,
            data: task,
            message: 'Task created successfully',
        })

    } catch (error) {
        next(error)
    }
}

// 更新任务
export const updateTask = async (req, res, next) => {
    try {

        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found',
                statusCode: 404,
            })
        }
        
        // 更新标题
        task.title = req.body.title || task.title;
        // 更新描述
        task.description = req.body.description || task.description;
        // 更新优先级
        task.priority = req.body.priority || task.priority;
        // 更新截止日期
        task.dueDate = req.body.dueDate || task.dueDate;
        // 更新待办清单
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        // 更新附件
        task.attachments = req.body.attachments || task.attachments;

        // 如果 assignedTo 存在（支持数组或单个 ID）
        if(req.body.assignedTo) {
            // 如果 assignedTo 是数组，则把 assignedTo 赋值给 task.assignedTo
            if(Array.isArray(req.body.assignedTo)) {
                task.assignedTo = req.body.assignedTo;
            } else {
                // 如果 assignedTo 是单个 ID，则把 assignedTo 赋值给 task.assignedTo
                // 把 assignedTo 转换为数组
                task.assignedTo = [req.body.assignedTo];
            }
        }

        // 保存更新后的任务
        const updatedTask = await task.save();

        res.json({
            success: true,
            data: updatedTask,
            message: 'Task updated successfully',
        })

    } catch (error) {
        next(error)
    }
}

// 删除任务
export const deleteTask = async (req, res, next) => {

    try {

        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found',
                statusCode: 404,
            })
        }

        // 删除任务
        await task.deleteOne();

        res.json({
            success: true,
            message: 'Task deleted successfully',
        })


    } catch (error) {
        next(error)
    }
}

// 更新任务状态
export const updateTaskStatus = async (req, res, next) => {

    try {

        const task = await Task.findById(req.params.id);

        // 如果任务不存在，则返回错误
        if(!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found',
                statusCode: 404,
            })
        }

        // 检查当前用户是不是这个任务的负责人（assignedTo 支持数组）
        // 如果 assignedTo 是数组，则把 assignedTo 赋值给 assignedToIds
        // 如果 assignedTo 是单个 ID，则把 assignedTo 赋值给 assignedToIds
        const assignedIds = Array.isArray(task.assignedTo) ? task.assignedTo : (task.assignedTo ? [task.assignedTo] : []);
        const isAssigned = assignedIds.some(id => id && id.toString() === req.user._id.toString());

        if(!isAssigned && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'You are not authorized to update this task',
                statusCode: 403,
            })
        }

        // 更新任务状态
        task.status = req.body.status || task.status;

        // 如果任务状态为 Completed，则更新待办清单
        if(req.body.status === 'Completed') {
            // 遍历待办清单，把所有待办项都标记为已完成
            task.todoChecklist.forEach(item => {
                item.completed = true;
            });
            // 更新任务进度为 100%
            task.progress = 100;
        }

        // 保存更新后的任务
        await task.save();

        res.json({
            success: true,
            data: task,
            message: 'Task status updated successfully',
        })

    } catch (error) {
        next(error)
    }
}

// 更新任务列表
export const assignTaskChecklist = async (req, res, next) => {

    try {

        // 解构赋值，todoChecklist 是待办清单
        const { todoChecklist } = req.body;

        // 根据任务 ID 查询任务
        const task = await Task.findById(req.params.id);

        // 如果任务不存在，则返回错误
        if(!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found',
                statusCode: 404,
            })
        }

        // 检查当前用户是不是这个任务的负责人（assignedTo 支持数组）
        // 如果 assignedTo 是数组，则把 assignedTo 赋值给 assignedToIds
        // 如果 assignedTo 是单个 ID，则把 assignedTo 赋值给 assignedToIds
        const assignedIds = Array.isArray(task.assignedTo) ? task.assignedTo : (task.assignedTo ? [task.assignedTo] : []);
        const isAssigned = assignedIds.some(id => id && id.toString() === req.user._id.toString());

        if(!isAssigned && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'You are not authorized to update this task',
                statusCode: 403,
            })
        }

        // 更新待办清单
        task.todoChecklist = todoChecklist;

        // 计算待办清单中完成的数量
        const completedCount = task.todoChecklist.filter(item => item.completed).length;

        // 计算待办清单中总的数量
        const totalItems = task.todoChecklist.length;

        // 计算任务进度,如果待办清单中没有任务，则进度为0,否则计算进度：完成数量 / 总的数量 * 100,四舍五入
        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        // 如果任务进度为 100%，则更新任务状态为 Completed
        if(task.progress === 100) {
            task.status = 'Completed';
        } else if(task.progress > 0) {
            // 如果任务进度大于 0%，则更新任务状态为 In Progress
            task.status = 'In Progress';
        } else {
            // 如果任务进度小于 0%，则更新任务状态为 Pending
            task.status = 'Pending';
        }

        // 保存更新后的任务
        await task.save();

        // 根据任务 ID 查询任务，并且把任务里的 assignedTo 用户信息一并查出来
        const updatedTask = await Task.findById(req.params.id).populate(
            'assignedTo',
            'username email profileImageUrl'
        );

        // 返回更新后的任务
        res.json({
            success: true,
            data: updatedTask,
            message: 'Task assigned successfully',
        })


    } catch (error) {
        next(error)
    }
}

// 获取任务仪表盘数据
export const getDashboardData = async (req, res, next) => {

    try {

        // 统计所有任务数量
        const totalTasks = await Task.countDocuments();
        // 统计 Pending 任务数量
        const pendingTasks = await Task.countDocuments({ status: 'Pending' });
        // 统计 In Progress 任务数量
        const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });
        // 统计 overdue 任务数量
        const overdueTasks = await Task.countDocuments({ 
            // 状态不为 Completed 的任务
            status: { $ne: 'Completed' },
            // 截止日期小于今天
            // $lt: less than（小于）
            dueDate: { $lt: new Date() },
        });

        // 统计任务状态分布
        const taskStatuses = ["Pending", "In Progress", "Completed"];

        // 按 status 分组，统计每种状态有多少个任务
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: '$status',
                    // 每出现一条记录就加 1
                    count: { $sum: 1 },
                },
            },
        ]);

        // reduce() 是 数组累加函数
        // acc 是累加器，status 是当前状态
        // 返回一个对象，对象的键是状态，值是数量
        const taskDistribution = taskStatuses.reduce((acc, status) => {
            // 把状态中的空格替换为下划线
            const formattedKey = status.replace(/\s+/g, '_')
            // 如果 taskDistributionRaw 中找到状态，则把数量赋值给 acc[formattedKey]，否则赋值为 0
            acc[formattedKey] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
            // 返回累加器
            return acc;
        }, {});

        // 把所有任务数量赋值给 All
        taskDistribution["All"] = totalTasks;

        // 统计任务优先级分布
        const taskPriorities = ["Low", "Medium", "High"];

        // 按 priority 分组，统计每种优先级有多少个任务
        const taskPriorityLevelsRaw = await Task.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 },
                },
            },
        ]);


        // 把优先级聚合结果整理成对象格式，并保证 Low / Medium / High 都存在
        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            // 如果 taskPriorityLevelsRaw 中找到优先级，则把数量赋值给 acc[formattedKey]，否则赋值为 0
            acc[priority] = taskPriorityLevelsRaw.find(item => item._id === priority)?.count || 0;
            return acc;
        }, {});

        // 查询最近 10 个任务
        const recentTasks = await Task.find()
          // 按创建时间排序，-1 表示倒序，最新任务排在前面
          .sort({ createdAt: -1 })
          // 限制返回 10 条数据
          .limit(10)
          // 选择 title、status、priority、dueDate、createdAt 字段
          .select('title status priority dueDate createdAt');

        // 返回成功响应
        res.json({
            success: true,
            // 统计信息
            statistics: {
                totalTasks,
                pendingTasks,
                inProgressTasks,
                overdueTasks,
            },
            // 图表信息
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        })
        

    } catch (error) {
        next(error)
    }
}

// 获取用户任务仪表盘数据
export const getUserDashboardData = async (req, res, next) => {

    try {

        // 获取当前用户 ID
        const userId = req.user._id;

        // 统计当前用户所有任务数量
        const assignedFilter = { assignedTo: { $in: [userId] } };
        // 统计当前用户所有任务数量
        const totalTasks = await Task.countDocuments(assignedFilter);
        // 统计当前用户所有 Pending 任务数量
        const pendingTasks = await Task.countDocuments({ ...assignedFilter, status: 'Pending' });
        // 统计当前用户所有 Completed 任务数量
        const completedTasks = await Task.countDocuments({ ...assignedFilter, status: 'Completed' });

        const overdueTasks = await Task.countDocuments({ 
            ...assignedFilter, 
            status: { $ne: 'Completed' },
            dueDate: { $lt: new Date() },
        });

        // 统计任务状态分布
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        // 按 status 分组，统计每种状态有多少个任务
        const taskDistributionRaw = await Task.aggregate([
            {
                $match: {
                    assignedTo: { $in: [userId] },
                },
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, '_')
            acc[formattedKey] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
            return acc;
        }, {});

        taskDistribution["All"] = totalTasks;

        // 统计任务优先级分布
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            {
                // 如果 assignedTo 是数组，则把 assignedTo 赋值给 assignedToIds
                $match: {
                    assignedTo: { $in: [userId] },
                },
            },
            {
                // 按 priority 分组，统计每种优先级有多少个任务
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find(item => item._id === priority)?.count || 0;
            return acc;
        }, {});

        // 查询最近 10 个任务
        const recentTasks = await Task.find({ assignedTo: { $in: [userId] } })
          // 按创建时间排序，-1 表示倒序，最新任务排在前面
          .sort({ createdAt: -1 })
          // 限制返回 10 条数据
          .limit(10)
          // 选择 title、status、priority、dueDate、createdAt 字段
          .select('title status priority dueDate createdAt');

        // 返回成功响应
        res.json({
            success: true,
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        })


    } catch (error) {
        next(error)
    }
}