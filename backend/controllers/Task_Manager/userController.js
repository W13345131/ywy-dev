import User from '../../models/User.js'
import Task from '../../models/Task_manager/Task.js'


// 获取所有用户
export const getUsers = async (req, res, next) => {

    try {
        // 查询所有member用户，除了密码字段
        const users = await User.find({ role: 'member' }).select('-password');

        // Promise.all 会：同时执行所有查询,提高性能
        const usersWithTaskCounts = await Promise.all(users.map(async (user) => {
            // 统计 Pending 任务数量
            const pendingTasks = await Task.countDocuments({ 
                assignedTo: user._id, 
                status: 'Pending' });
            // 统计 In Progress 任务数量
            const inProgressTasks = await Task.countDocuments({ 
                assignedTo: user._id, 
                status: 'In Progress' });
            // 统计 Completed 任务数量
            const completedTasks = await Task.countDocuments({ 
                assignedTo: user._id, 
                status: 'Completed' });
            return {
                // 把用户数据展开
                // 再添加任务统计字段
                ...user.toObject(),
                pendingTasks,
                inProgressTasks,
                completedTasks,
            }
        }));
        
        // 返回用户数据，包括任务统计字段
        res.json(usersWithTaskCounts);
    } catch (error) {
        next(error)
    }
}


// 获取单个用户
export const getUserById = async (req, res, next) => {

    try{
        // 根据用户 ID 查找用户，除了密码字段
        const user = await User.findById(req.params.id).select('-password');

        // 如果用户不存在，则返回错误
        if(!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                statusCode: 404,
            })
        }
        
        res.json(user);
    } catch (error) {
        next(error)
    }

}
