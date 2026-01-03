import { Badge } from "@/components/ui/badge";
import { MenuProps } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";

export const columnResigterFake: ColumnsType = [
  {
    title: "STT",
    fixed: "left",
    width: "2%",
  },
  {
    title: "Họ tên",
    key: "total",
    dataIndex: "total",
    width: "24%",
  },
  

  {
    title: "Nghỉ phép",
    dataIndex: "absents",
    children: [
      {
        title: "Từ ngày",
        dataIndex: "wait_retirement",
        key: "record",
        width: "12%",
      },
      {
        title: "Đến ngày",
        dataIndex: "on_leave",
        key: "record",
        width: "12%",
      },
    ],
  },
  {
    title: "Tranh thủ",
    dataIndex: "absents",
    children: [
      {
        title: "Từ ngày",
        dataIndex: "wait_retirement",
        key: "record",
        width: "12%",
      },
      {
        title: "Đến ngày",
        dataIndex: "on_leave",
        key: "record",
        width: "12%",
      },
    ],
  },
  {
    title: "TP duyệt",
    key: "presents",
    dataIndex: "presents",
    width: "24%",
  },
];

export const columnFake1: ColumnsType = [
  {
    title: "STT",
    key: "index",
    width: "2%",
  },

  {
    title: "Nội dung công việc",
    width: "35%",
  },
  {
    title: "Từ ngày",
    width: "15%",
  },
  {
    title: "Đến ngày",
    width: "15%",
  },
  {
    title: "Người phụ trách",
    width: "15%",
  },
  {
    title: "Người thực hiện",
    width: "15%",
  },
  {
    title: "",
    width: "3%",
  },
];

export const errorTime = {
  from: "Từ ngày không được lớn hơn Đến ngày",
  to: "Đến ngày không được nhỏ hơn Từ ngày",
};


export const WeekNumberList = [
  {
    value: moment().isoWeek(),
    name: moment().isoWeek(),
  },
  {
    value: moment().isoWeek() + 1,
    name: moment().isoWeek() + 1,
  },
];



export const roleUser = [
  {
    label: 'Nhóm I',
    value: 'GA'
  },
  {
    label: 'Nhóm II',
    value: 'CS'
  },
  {
    label: 'Nhóm III',
    value: 'LD'
  },
  {
    label: 'Nhóm IV',
    value: 'RA'
  },
  {
    label: 'Nhóm V',
    value: 'DI'
  },
]
export const departmentUser = [
  {
    label: 'Bộ phận huấn luyện',
    value: 'TRAINING'
  },
  {
    label: 'Bộ phận tác chiến thông tin',
    value: 'COMBAT'
  },
  {
    label: 'Bộ phận kiểm soát',
    value: 'CONTROL'
  },
  {
    label: 'Bộ phận kỹ thuật',
    value: 'TECH'
  },
]

export const groupDepartMent = {
  groupOne: "Nhóm I",
  groupTwo: "Nhóm II",
  groupThird: "Nhóm III",
  groupFour: "Nhóm IV",
  groupFive: "Nhóm V",
}
export const namesAllDepartment = {
  COMBAT: "Bộ phận tác chiến thông tin",
  TRAINING: "Bộ phận huấn luyện",
  COMMAND: "Bộ phận ban chỉ huy",
  CONTROL: "Bộ phận kiểm soát",
  TECH: "Bộ phận kĩ thuật",
}
export const statusUser = [
  {
    value: true,
    label: 'Đang hoạt động'

  },
  {
    value: false,
    label: 'Ngừng hoạt động'
  }
]
export const statusUserInAcrive =  {
    value: false,
    label: 'Ngừng hoạt động'
  }


export const dataWeekNumber = [
  { "value": 1, "label": "1" },
  { "value": 2, "label": "2" },
  { "value": 3, "label": "3" },
  { "value": 4, "label": "4" },
  { "value": 5, "label": "5" },
  { "value": 6, "label": "6" },
  { "value": 7, "label": "7" },
  { "value": 8, "label": "8" },
  { "value": 9, "label": "9" },
  { "value": 10, "label": "10" },
  { "value": 11, "label": "11" },
  { "value": 12, "label": "12" },
  { "value": 13, "label": "13" },
  { "value": 14, "label": "14" },
  { "value": 15, "label": "15" },
  { "value": 16, "label": "16" },
  { "value": 17, "label": "17" },
  { "value": 18, "label": "18" },
  { "value": 19, "label": "19" },
  { "value": 20, "label": "20" },
  { "value": 21, "label": "21" },
  { "value": 22, "label": "22" },
  { "value": 23, "label": "23" },
  { "value": 24, "label": "24" },
  { "value": 25, "label": "25" },
  { "value": 26, "label": "26" },
  { "value": 27, "label": "27" },
  { "value": 28, "label": "28" },
  { "value": 29, "label": "29" },
  { "value": 30, "label": "30" },
  { "value": 31, "label": "31" },
  { "value": 32, "label": "32" },
  { "value": 33, "label": "33" },
  { "value": 34, "label": "34" },
  { "value": 35, "label": "35" },
  { "value": 36, "label": "36" },
  { "value": 37, "label": "37" },
  { "value": 38, "label": "38" },
  { "value": 39, "label": "39" },
  { "value": 40, "label": "40" },
  { "value": 41, "label": "41" },
  { "value": 42, "label": "42" },
  { "value": 43, "label": "43" },
  { "value": 44, "label": "44" },
  { "value": 45, "label": "45" },
  { "value": 46, "label": "46" },
  { "value": 47, "label": "47" },
  { "value": 48, "label": "48" },
  { "value": 49, "label": "49" },
  { "value": 50, "label": "50" },
  { "value": 51, "label": "51" },
  { "value": 52, "label": "52" }
]

export const actionPlanWeek = [
  {
    value: 'Đang nhập',
    label: 'Đang nhập'
  },
  {
    value: 'Đã gửi',
    label: 'Đã gửi'
  },
  {
    value: 'Đã công bố',
    label: 'Đã công bố'
  },
]
export const actionPlanWeekGA = [
  {
    value: 'Đang nhập',
    label: 'Đang nhập'
  },
  {
    value: 'Đã công bố',
    label: 'Đã công bố'
  },
]


export const getMenuItems = (): MenuProps["items"] => [
  {
    label: <div>Thêm dòng</div>,
    key: "0",
  },
  {
    type: "divider",
  },
  {
    label: <div className="!text-red-error">Xóa dòng</div>,
    key: "1",
  },
];

export const momentTime={
  momentWeek:moment().isoWeek(),
  momentNextWeek:moment().isoWeek()+1
}

export const errmessageMilitary={
  sex:'Tổng số Nam + Nữ không được lớn hơn Tổng số QNCN + Sĩ quan',
  absent:'Cộng vắng không được lớn hơn Tổng số',
}

export const getStatusBadge = (status: string) => {
  switch(status.toLowerCase()) {
    case 'planning':
    case 'lập kế hoạch':
      return <Badge className="!bg-purple-500/80 text-white">Lập kế hoạch</Badge>;
    case 'in-progress':
    case 'đang tiến hành':
      return <Badge className="!bg-green-500/80 text-white">Đang tiến hành</Badge>;
    case 'active':
    case 'ongoing':
    case 'đang diễn ra':
      return <Badge className="!bg-green-500/80 text-white">Đang diễn ra</Badge>;
    case 'completed':
    case 'hoàn thành':
      return <Badge className="!bg-blue-500/80 text-white">Hoàn thành</Badge>;
    case 'on-hold':
    case 'tạm hoãn':
      return <Badge className="!bg-orange-500/80 text-white">Tạm hoãn</Badge>;
    case 'pending':
    case 'chờ xử lý':
      return <Badge className="!bg-yellow-500/80 text-white">Chờ xử lý</Badge>;
    case 'cancelled':
    case 'đã hủy':
      return <Badge className="!bg-red-500/80 text-white">Đã hủy</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};