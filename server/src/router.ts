import { findAll, createOrder, deleteById } from "./service/orderService";
import { Context } from "koa";
import * as Router from "koa-router";
import { resSuccess, resError } from "./httpUtils";
import Order from "./models/order";
import * as moment from "moment";

const router = new Router();

router.get("/", async (ctx: Context) => {
  const { current } = ctx.request.query;
  const result = await Order.find({ date: current });
  const resBody = { ctx, result };
  return resSuccess(resBody);
});

/** 测试使用 */
router.get("/all", async (ctx: Context) => {
  const result = await findAll();
  const resBody = { ctx, result };
  return resSuccess(resBody);
});

router.post("/create", async (ctx: Context) => {
  const reqBody = ctx.request.body;
  const { date } = reqBody;
  let res = {
    success: true,
    result: {},
  };
  Order.create(
    {
      ...reqBody,
      date: date ?? moment().format("YYYY-MM-DD"),
    },
    (err: Error, result: any) => {
      if (err) {
        res.success = false;
        console.log("创建失败");
      }
      res.result = result;
    }
  );

  return res.success
    ? resSuccess({ ctx, result: res.result, msg: "创建成功" })
    : resError({ ctx, msg: "创建失败" });
});

router.del("/delete", async (ctx) => {
  const { id } = ctx.request.query;
  if (!id) return resError({ ctx, msg: "id不可为空", code: 400 });
  let res = {
    success: true,
    result: {},
  };
  const { deletedCount } = await Order.deleteOne({ _id: id });
  if (deletedCount < 1) res.success = false;
  return res.success
    ? resSuccess({ ctx, result: res.result, msg: "删除成功" })
    : resError({ ctx, msg: "删除失败" });
});

router.post("/update", async (ctx) => {
  const reqBody = ctx.request.body;
  const { id, name, room, people, date, time, phone } = reqBody;
  let res = {
    success: true,
    result: {},
  };
  const { modifiedCount } = await Order.updateOne(
    { _id: id },
    { name, room, people, date, time, phone }
  ).exec();
  if (modifiedCount < 1) res.success = false;
  const updatedResult = await Order.findOne({ _id: id });
  if (updatedResult) res.result = updatedResult;
  return res.success
    ? resSuccess({ ctx, result: res.result, msg: "修改成功" })
    : resError({ ctx, msg: "修改失败" });
});

router.get("/findById", async (ctx) => {
  const { id } = ctx.request.query;
  if (!id) resError({ ctx, msg: "缺少Id" });
  let res = {
    success: true,
    result: {},
  };
  Order.findById({ _id: id }, (error: Error, result: any[]) => {
    if (error) res.success = false;
    res.result = result;
  });
  return res.success
    ? resSuccess({ ctx, result: res.result, msg: "查询成功" })
    : resError({ ctx, msg: "查询失败" });
});

export default router;
