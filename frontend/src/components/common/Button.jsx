import React from "react";


// 函数组件 + 解构 props
const Button = ({
    children,
    onClick,
    type = 'button',
    className = '',
    disabled = false,
    variant = 'primary',
    size = 'md',
}) => {

    // 所有按钮共有的样式
    // disabled:opacity-50	禁用透明
    // disabled:cursor-not-allowed	禁用鼠标
    // whitespace-nowrap	不换行
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap';

    // 按钮类型样式
    const variantStyles = {
        // 绿色渐变按钮
        primary: 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-500/30',
        // 灰色按钮
        secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
        // 白色 + 边框按钮
        danger: 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300',
    }

    // 控制按钮大小
    const sizeStyles = {
        sm: 'h-9 px-4 text-xs',
        md: 'h-11 px-5 text-sm',
    };

    // 数组拼接所有样式
    return (
        <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={[
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            className,
        ].join(' ')}
        >
            {/* 按钮内容 */}    
            {children}
        </button>
    )
};

export default Button;