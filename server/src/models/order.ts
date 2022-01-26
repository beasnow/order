import * as mongoose from "mongoose";

export const orderSchema = new mongoose.Schema({
  date: { type: String, required: [true, "缺少预定日期"] },
  name: { type: String, required: [true, "缺少预定者姓名"] },
  people: { type: Number, required: [false] },
  room: { type: String, required: [true, "缺少预定的房间号"] },
  phone: { type: String },
  time: { type: String },
});

const Order = mongoose.model("order", orderSchema);

export default Order;
