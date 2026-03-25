import ImageKit from 'imagekit';

const imagekit = new ImageKit({
    // 公钥
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    // 私钥
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    // 上传地址
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;