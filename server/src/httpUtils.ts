import { Context } from "koa";

export const resSuccess = (body: any) => {
  const { ctx, msg = "请求成功", result = null } = body;
  ctx.body = { code: 200, msg, result };
};
export const resError = (body: any) => {
  const { ctx, msg = "请求失败", code = 500 } = body;
  ctx.body = { code, msg };
};

export const resUtil = (
  ctx: Context,
  statusCode: number,
  msg?: string,
  result?: any
) => {
  const responseBody = {
    ctx,
    statusCode,
    msg,
    result,
  };
  if (statusCode < 300) {
    return resSuccess(responseBody);
  }
  if (statusCode > 400) {
    return resError(responseBody);
  }
};
