require("dotenv").config();
const upload = require("./routes/upload");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const connection = require("./db");
const express = require("express");
const app = express();
const morgan = require('morgan');
const cors = require("cors");
const router = express.Router();
let gfs;
connection();

const conn = mongoose.connection;
conn.once("open", function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("photos");
});
app.use(cors());
app.use("/file", upload);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// media routes
app.get("/file/:filename", async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename }); //findOne tìm và trả về theo filename
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
    } catch (error) {
        res.send("not found");
    }
});
if (process.env.DB === 'production') {
    app.use(express.static('client/build'));
}
app.use(morgan('tiny'));
app.use('/api', router);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
