import Taro from "@tarojs/taro";

const baseUrl = "https://www.beasnow.top";

const orderRequest = (url: string, options?: Record<string, any>) =>
  Taro.request({ url: `${baseUrl + url}`, ...options });

export const findCurrent = (currentDate: string) =>
  orderRequest(`?current=${currentDate}`, { method: "GET" });

export const deleteOrder = (id: string) =>
  orderRequest(`/delete?id=${id}`, { method: "DELETE" });

export const createOrder = (param: Record<string, any>) =>
  orderRequest("/create", {
    method: "POST",
    data: { ...param },
  });

export const updateOrder = (param: Record<string, any>) =>
  orderRequest("/update", {
    method: "POST",
    data: { ...param },
  });
