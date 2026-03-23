import multer from 'multer'


// diskStorage: 保存到服务器磁盘
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/pictures')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

// 限制上传文件类型，支持图片和常见视频格式
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
        'video/mp4',
        'video/webm',
        'video/quicktime',
    ]
    // 如果文件类型在允许列表中，则允许上传
    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Only image and video files are allowed'), false)
    }
}

export const upload = multer({ storage, fileFilter })