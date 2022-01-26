import { resError } from './../httpUtils';
import { Error } from "mongoose";
import Order from "../models/order";

export const findAll = () => Order.find();

export const findById = (id: string) =>
  Order.findById({ uuid: id }, (error: Error, result: any[]) => {
    if (error) return { result: [] };
    return { result };
  });

export const createOrder = (param: any) => {
  const { name, room, people } = param;
  let newResult = {};
  Order.create(
    { date: new Date().getTime(), name, room, people },
    (err: Error, result: any) => {
      if (err) {
          
        console.log("创建失败");
        resError
      }
      console.log("rrrr", result);
      newResult = result;
    }
  );
  return newResult;
};

export const deleteById = (id: string | string[]) => {
  Order.deleteOne({ _id: id }, (err: Error, result: any) => {
    if (err) {
      console.log("删除失败");
      return false;
    }
    console.log("删除成功");
  });
  return true;
};
