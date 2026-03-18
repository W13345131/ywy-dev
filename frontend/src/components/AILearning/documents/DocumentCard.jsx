import React from 'react'
import { useNavigate } from 'react-router-dom';
import { BookOpen, BrainCircuit, Clock, FileText, Trash2 } from 'lucide-react';
import moment from 'moment';


// 文件大小格式化函数，作用是把字节（bytes）转换成人类更容易阅读的单位
const formatFileSize = (bytes) => {
    // 如果文件大小为空或 undefined，则返回 'N/A'
    if (bytes === undefined || bytes ===null) return 'N/A';

    // 定义单位数组
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    // 初始化大小为字节数
    let size = bytes;   
    // 初始化单位索引为0
    let unitIndex = 0;

    // 如果大小大于等于1024，并且单位索引小于单位数组长度减1，则循环
    while (size >= 1024 && unitIndex < units.length - 1) {
        // 每次循环，大小除以1024，单位索引加1
        size /= 1024;
        // 单位索引加1
        unitIndex++;
    }
    // 返回格式化后的文件大小
    // size.toFixed(1) 保留1位小数
    // units[unitIndex] 获取单位
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

const DocumentCard = ({ document, onDelete }) => {

    // useNavigate() 是 React Router v6 的 Hook。
    // 用来跳转页面。
    const navigate = useNavigate();

    // 点击文档卡片时触发
    const handleNavigate = () => {
        navigate(`/documents/${document._id}`);
    }

    // 点击删除按钮时触发
    const handleDelete = (e) => {
        // 阻止事件冒泡
        e.stopPropagation();
        // 调用父组件的 onDelete 函数
        onDelete(document);
    }

  return (
    // 文档卡片组件
    <div
    className='group relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-5 
    hover:border-slate-300/60 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 
    flex flex-col justify-between cursor-pointer hover:-translate-y-1'
    onClick={handleNavigate}
    >
        {/* Header Section */}
        {/* 文档卡片内容区域 */}
        <div className=''>
            <div className='flex items-center justify-between gap-3 mb-4'>
                <div className='shrink-0 w-12 h-12 bg-linear-to-br from-emerald-500 to-cyan-500 rounded-xl 
                flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 
                transition-transform duration-300'>
                    <FileText className='w-6 h-6 text-white' strokeWidth={2} />   
                </div>
                {/* 删除按钮 */}
                <button
                onClick={handleDelete}
                className='opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center 
                text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all 
                duration-200 cursor-pointer'
                >
                    <Trash2 className='w-4 h-4' strokeWidth={2} />
                </button>
            </div>

            {/* Title */}
            <h3 className='text-base font-semibold text-slate-900 truncate mb-2' title={document.title}>
                {/* 文档标题 */}
                {document.title}
            </h3>

            {/* Document Info */}
            <div className='flex items-center gap-3 text-xs text-slate-500 mb-3'>
                {
                // 如果文件大小不为空，则显示文件大小
                document.fileSize !== undefined && (
                    <>
                    {/* 格式化文件大小 */}
                    <span className='font-medium'>{formatFileSize(document.fileSize)}</span>
                    </>
                )}
            </div>

            {/* Status Section */}
            {/* 状态区域 */}
            <div className='flex items-center gap-3'>
                {/* 如果闪卡数量不为空，则显示闪卡数量 */}
                {document.flashcardCount !== 0 && (
                    // 闪卡数量区域
                    <div className='flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 rounded-lg'>
                        <BookOpen className='w-3.5 h-3.5 text-purple-600' strokeWidth={2} />
                        <span className='text-xs font-semibold text-purple-700'>{document.flashcardCount} Flashcards</span>
                    </div>
                )}
                {document.quizCount !== 0 && (
                    <div className='flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-lg'>
                        <BrainCircuit className='w-3.5 h-3.5 text-emerald-600' strokeWidth={2} />
                        <span className='text-xs font-semibold text-emerald-700'>{document.quizCount} Quizzes</span>
                    </div>
                )}
            </div>
        </div>

        {/* Footer Section */}
        <div className='mt-5 pt-5 border-t border-slate-100'>
            <div className='flex items-center gap-1.5 text-xs text-slate-500'>
                <Clock className='w-3.5 h-3.5' strokeWidth={2} />
                {/* 上传时间 */}
                <span>Uploaded {moment(document.createdAt).fromNow()}</span>
            </div>
        </div>

        {/* Hover Indicator */}
        {/* 悬停指示器 */}
        <div className='absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-500/0 
        to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all 
        duration-300 pointer-events-none' />
    </div>
  )
}

export default DocumentCard