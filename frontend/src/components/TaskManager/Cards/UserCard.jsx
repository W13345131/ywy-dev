import React from "react";
import { User } from "lucide-react";

// 用户卡片组件，用于显示用户信息和任务统计
function UserCard({ userInfo }) {
    return (
        <div className="user-card">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* 显示用户头像 */}
                    {userInfo?.profileImageUrl ? (
                        // 如果用户头像存在，则显示用户头像
                        <img src={userInfo.profileImageUrl} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                        // 如果用户头像不存在，则显示用户图标
                    ) : (
                        <User className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center bg-slate-300" />
                    )}
                    {/* 显示用户名和邮箱 */}
                    <div className="">
                        <p className="text-sm font-medium">
                            {userInfo?.username}
                        </p>
                        <p className="text-xs text-gray-500">
                            {userInfo?.email}
                        </p>
                    </div>
                </div>
            </div>
            {/* 显示用户任务统计 */}
            <div className="flex items-end gap-3 mt-5">
                <StatCard
                  // 待办任务数量
                  label="Pending"
                  count={userInfo?.pendingTasks || 0}
                  status="Pending"
                />
                <StatCard
                  // 完成任务数量
                  label="Completed"
                  count={userInfo?.completedTasks || 0}
                  status="Completed"
                />
                <StatCard
                  // 进行中任务数量
                  label="In Progress"
                  count={userInfo?.inProgressTasks || 0}
                  status="In Progress"
                />
            </div>
        </div>
    )
}


export default UserCard;


// 任务统计卡片组件，用于显示任务统计信息
const StatCard = ({ label, count, status }) => {

    // 根据任务状态，设置任务统计卡片颜色
    const getStatusColor = () => {
        switch (status) {
            case 'Pending':
                return 'text-cyan-500 bg-gray-50';
            case 'Completed':
                return 'text-indigo-500 bg-gray-50';
            default:
                return 'text-violet-500 bg-gray-50';
        }
    }

    return (
        // 显示任务统计卡片
        <div className={`flex-1 text-[10px] font-medium ${getStatusColor()} px-4 py-0.5 rounded`}>
            <span className="text-[12px] font-semibold">
                {count}
                {/* 显示任务状态 */}
                <br /> {/* 换行 */}
                {label}
            </span>
        </div>
    )
}
