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

// 限制上传文件类型，只允许 JPEG, PNG, JPG 文件上传
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    // 如果文件类型是 JPEG, PNG, JPG，则允许上传
    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Only JPEG, PNG, JPG files are allowed'), false)
    }
}

export const upload = multer({ storage, fileFilter })