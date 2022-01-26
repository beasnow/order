import { useCallback, useEffect, useState } from "react";
import { View, Picker } from "@tarojs/components";
import {
  AtActionSheet,
  AtActionSheetItem,
  AtButton,
  AtCalendar,
  AtList,
  AtListItem,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtInput,
  AtToast
} from "taro-ui";
import moment from "moment";

import "taro-ui/dist/style/components/button.scss"; // 按需引入
import "taro-ui/dist/style/components/flex.scss";
import "taro-ui/dist/style/components/calendar.scss";
import "taro-ui/dist/style/components/list.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/modal.scss";
import "taro-ui/dist/style/components/action-sheet.scss";
import "taro-ui/dist/style/components/list.scss";
import "taro-ui/dist/style/components/toast.scss";
import "taro-ui/dist/style/components/icon.scss";
import "./index.less";
import { createOrder, deleteOrder, findCurrent } from "../../api";

interface Order {
  name: string;
  time?: string;
  room: string;
  id?: string;
  phone?: string;
  people?: number;
}
type OrderProp = Order | {};

const Index = () => {
  const [actionVisible, setActionVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderTitle, setOrderTitle] = useState("新增预定");
  const [formObj, setFormObj] = useState<OrderProp>({});
  const [toastVisible, setToashVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  const [toashText, setToashText] = useState("姓名和房间号为必填项");

  const [list, setList] = useState([]);

  const fetchList = useCallback(async () => {
    const { data } = await findCurrent(selectedDate);
    const { result } = data;
    setList(result);
  }, [selectedDate]);

  useEffect(() => {
    fetchList();
  }, [fetchList, selectedDate]);

  const onChangeInput = (value, key) => {
    setFormObj(Object.assign({}, { ...formObj }, { [key]: value }));
  };

  const onSubmit = async () => {
    const { name, room } = formObj;
    if (!name || !room) {
      setToashVisible(true);
      return;
    }
    const orderInfo = { date: selectedDate, ...formObj };
    const { statusCode } = await createOrder(orderInfo);

    if (statusCode === 200) {
      setToashText("创建成功");
      setModalVisible(false);
      setToashVisible(true);
      setFormObj({});
      await fetchList();
      return;
    } else {
      setToashText("创建失败");
      setModalVisible(false);
      setToashVisible(true);
      return;
    }
  };

  const onEdit = () => {
    setOrderTitle("编辑");
    setActionVisible(false);
    setModalVisible(true);
  };
  const onDelete = async () => {
    const { statusCode } = await deleteOrder(formObj["_id"]);
    if (statusCode === 200) {
      setToashText("删除成功");
      setActionVisible(false);
      setToashVisible(true);
      await fetchList();
    } else {
      setToashText("删除失败");
      setActionVisible(false);
      setToashVisible(true);
    }
  };

  return (
    <View className="at-column">
      <View className="at-col">
        <AtCalendar
          format="YYYY-MM-DD"
          onSelectDate={date => {
            setSelectedDate(moment(date?.value?.end + "").format("YYYY-MM-DD"));
          }}
        />
      </View>
      <View className="at-col">
        <AtList>
          {list.map(item => {
            const phoneString = item?.phone ? `(Tel: ${item.phone})` : "";
            return (
              <AtListItem
                key={item?.["_id"]}
                title={`${item?.name} ${phoneString}`}
                extraText={`人数: ${item?.people}`}
                note={`桌号: ${item?.room}`}
                onClick={() => {
                  setFormObj(item);
                  setActionVisible(true);
                }}
              />
            );
          })}
        </AtList>
      </View>
      <View className="at-col ">
        <AtButton
          type="primary"
          onClick={() => {
            setFormObj({});
            setModalVisible(true);
          }}
        >
          新增预定
        </AtButton>
      </View>
      <AtActionSheet
        isOpened={actionVisible}
        onCancel={() => setActionVisible(false)}
        onClose={() => setActionVisible(false)}
      >
        <AtActionSheetItem onClick={() => onEdit()}>编辑</AtActionSheetItem>
        <AtActionSheetItem onClick={() => onDelete()}>删除</AtActionSheetItem>
      </AtActionSheet>
      <AtModal
        isOpened={modalVisible}
        onCancel={() => setModalVisible(false)}
        onClose={() => setModalVisible(false)}
      >
        <AtModalHeader>{orderTitle}</AtModalHeader>
        <AtModalContent>
          <AtInput
            name="name"
            title="姓名"
            required
            type="text"
            value={formObj?.name}
            placeholder="顾客姓名"
            onChange={value => onChangeInput(value, "name")}
          />
          <AtInput
            name="people"
            title="人数"
            required
            type="number"
            value={formObj?.people}
            placeholder="人数"
            onChange={value => onChangeInput(value, "people")}
          />
          <AtInput
            name="phone"
            title="联系方式"
            type="text"
            placeholder="顾客联系电话"
            value={formObj?.phone}
            onChange={value => onChangeInput(value, "phone")}
          />
          <AtInput
            name="room"
            title="包间"
            required
            type="text"
            placeholder="输入预定的包间号"
            value={formObj?.room}
            onChange={value => onChangeInput(value, "room")}
          />
          <Picker
            mode="time"
            onChange={e => onChangeInput(e?.detail?.value, "time")}
          >
            <span>点击选择预定时间</span>
            <View>{formObj?.time || "请选择时间"}</View>
          </Picker>
        </AtModalContent>
        <AtModalAction>
          <AtButton onClick={() => setModalVisible(false)}>取消</AtButton>
          <AtButton onClick={() => setFormObj({})}>重置</AtButton>
          <AtButton onClick={() => onSubmit()}>保存</AtButton>
        </AtModalAction>
        <AtToast
          isOpened={toastVisible}
          text={toashText}
          onClose={() => setToashVisible(false)}
        ></AtToast>
      </AtModal>
    </View>
  );
};

export default Index;
