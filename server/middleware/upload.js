const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage"); //Công cụ lưu trữ GridFS lưu trữ trực tiếp các tệp đã tải lên MongoDb.

const storage = new GridFsStorage({
    url: process.env.DB, //Một url trỏ đến cơ sở dữ liệu được sử dụng để lưu trữ các tệp đến.
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];
        //indexOff tìm kiếm theo match
        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-any-name-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "photos",
            filename: `${Date.now()}-any-name-${file.originalname}`,
        };
    },
});

module.exports = multer({ storage });
