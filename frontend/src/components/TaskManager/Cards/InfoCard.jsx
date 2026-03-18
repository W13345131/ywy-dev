import React from 'react'

const InfoCard = ({ value, label, color, icon }) => {
  return (

    <div className='flex items-center gap-3'>
        {/* 圆点 */}
        <div className={`w-2 h-3 md:h-5 ${color} rounded-full`} />
        <p className='text-xs md:text-[14px] text-gray-500'>
            {/* mr-1：右外边距为1单位 4px */}
            <span className='text-sm md:text-[15px] text-black font-semibold mr-1'>
                {value}
            </span>
            {label}
        </p>
    </div>
  )
}

export default InfoCard