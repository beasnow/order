import * as mongoose from "mongoose";

const DB_URL = "mongodb://admin:123456@localhost:27017/admin";

const serverConnect = () => {
  mongoose.connect(DB_URL, (err: mongoose.NativeError) => {
    if (!err) {
      return console.log("连接数据库成功");
    } else {
      return console.log("连接数据库失败",err);
    }
  });
  return mongoose;
};

export default serverConnect;
