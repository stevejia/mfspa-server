import {
  Avatar,
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Input,
  Menu,
  Select,
} from "antd";
import React from "react";
import { MEETING_LIST, USR_ID } from "../../constant/constant";
import { BaseProps, MeetingInfo, MEETING_STATUS } from "../../types/types";
import "./home.less";
import {
  SettingOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  CarryOutOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { formatDate, getCommonData } from "../../utils";
interface HomeProps extends BaseProps {}

interface HomeState {
  userid: string;
  meetingList: Array<MeetingInfo>;
  hoverAction: boolean;
}

const meetingDurations = [
  {
    label: "15分钟",
    value: 15 * 60 * 1000,
  },
  {
    label: "30分钟",
    value: 30 * 60 * 1000,
  },
  {
    label: "45分钟",
    value: 45 * 60 * 1000,
  },
  {
    label: "1小时",
    value: 60 * 60 * 1000,
  },
];

export default class Home extends React.Component<HomeProps, HomeState> {
  state = {
    userid: localStorage.getItem(USR_ID),
    meetingList: [
    ],
    hoverAction: false,
    quick: false,
    join: false,
    book: false,
  };
  componentDidMount(): void {
    this.getMeetingList();
  }
  async getMeetingList() {
    //TODO::
   const {meetingList} = getCommonData();
   this.setState({meetingList});
  }

  onMenuClick = (key: string) => {
    if (key === "1") {
      console.log("复制邀请");
    }
  };

  toggleDrawer(type: string) {
    this.state[type] = !this.state[type];
    this.setState({ ...this.state });
  }

  onJoinMeeting = (values: any) => {
    console.log("Success:", values);
    const {userid, meetingId} = values;

    this.props.navigate(`/meeting/room?userid=${userid}&meetingId=${meetingId}`)
  };

  onBookMeeting = (values: any) => {
    console.log(values);
    const {startDate, startTime, duration, ...restValue} = values; 

    const _startDate = startDate.valueOf();
    const start = _startDate;
    const end = _startDate + duration;
    const { userMeetingId} = getCommonData();
    const meetingInfo: MeetingInfo = {
        startTime: start,
        endTime: end,
        meetingId: userMeetingId,
        status: MEETING_STATUS.NOT_STARTED,
        ...restValue
    }
    console.log(meetingInfo);
    this.saveBookMeeting(meetingInfo);
  };
  async saveBookMeeting(meetingInfo: MeetingInfo) {
    //TODO
    const {meetingList} = getCommonData();
    meetingList.push(meetingInfo)
    localStorage.setItem(MEETING_LIST, JSON.stringify(meetingList));
  }

  render(): React.ReactNode {
    const { userid, meetingList, quick, join, book } = this.state;
    const { muteCamera, muteMicrophone } = getCommonData();
    const menu = (
      <Menu
        onClick={(event) => this.onMenuClick(event.key)}
        items={[
          {
            key: "1",
            label: "复制邀请",
          },
          {
            key: "2",
            label: "修改会议",
          },
          {
            key: "3",
            label: "取消会议",
          },
        ]}
      />
    );
    return (
      <div className="meeting-home-wrapper">
        <div className="meeting-home-container">
          <div className="meeting-home-header">
            <div className="meeting-home-avatar-container">
              <Avatar src="http://cdn.mfspa.cc/resources/images/avatar.jpeg"></Avatar>
              <div className="m-l-xs">{userid}</div>
            </div>
            <SettingOutlined></SettingOutlined>
          </div>
          <div className="meeting-home-content">
            <div className="meeting-home-action">
              <Button
                onClick={() => this.toggleDrawer("join")}
                shape="round"
                type="primary"
                icon={<PlusOutlined />}
                size="large"
              >
                加入会议
              </Button>
              <Button
                onClick={() => this.toggleDrawer("quick")}
                shape="round"
                type="primary"
                icon={<ThunderboltOutlined />}
                size="large"
              >
                快速会议
              </Button>
              <Button
                onClick={() => this.toggleDrawer("book")}
                shape="round"
                type="primary"
                icon={<CarryOutOutlined />}
                size="large"
              >
                预定会议
              </Button>
            </div>
            <Divider></Divider>
            <div className={`meeting-home-list${meetingList.length > 0 ? '': ' empty'}`}>
              {meetingList?.length > 0
                ? meetingList.map((item) => {
                    return (
                      <div
                        className="meeting-item"
                        onMouseOver={() => {
                          item.hover = true;
                          this.setState({ meetingList });
                        }}
                        onMouseLeave={() => {
                          item.hover = false;
                          this.setState({ meetingList });
                        }}
                      >
                        <div className="item-info">
                          <div className="item-info-top">
                            <div className="light">
                              {formatDate(item.startTime)} -{" "}
                              {formatDate(item.endTime)}
                            </div>
                            <div className="m-l-sm light">{item.meetingId}</div>
                            <div className="m-l-sm">
                              {item.status === MEETING_STATUS.NOT_STARTED
                                ? "未开始"
                                : "已开始"}
                            </div>
                          </div>
                          <div className="item-info-bottom m-t-sm">
                            {item.title}
                          </div>
                        </div>
                        <div className="item-opration">
                          {item.hover ? (
                            <Dropdown.Button type="primary" overlay={menu}>
                              进入会议
                            </Dropdown.Button>
                          ) : (
                            <RightOutlined />
                          )}
                        </div>
                      </div>
                    );
                  })
                : <Empty description="暂无会议"></Empty>}
            </div>
          </div>
        </div>
        <Drawer
          title="快速会议"
          placement="right"
          closable={false}
          onClose={() => {
            this.toggleDrawer("quick");
          }}
          open={quick}
        >
          快速会议
          {/* <div className="setting-item">
          <div className="setting-item-label">入会开启摄像头</div>
          <Switch checked={!muteCamera} onChange={(e)=> this.toggleSettingItem('muteCamera', e)} className="setting-item-switch"></Switch>
        </div>
        <div className="setting-item m-t-sm">
          <div className="setting-item-label">入会开启麦克风</div>
          <Switch checked={!muteMicrophone} onChange={(e)=> this.toggleSettingItem('muteMicrophone', e)} className="setting-item-switch"></Switch>
        </div>
        <div className="setting-item m-t-sm">
          <div className="setting-item-label">入会显示时间</div>
          <Switch checked={!hideTime} onChange={(e)=> this.toggleSettingItem('hideTime', e)} className="setting-item-switch"></Switch>
        </div> */}
        </Drawer>
        <Drawer
          title="加入会议"
          placement="right"
          closable={false}
          onClose={() => {
            this.toggleDrawer("join");
          }}
          open={join}
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
              userid,
              muteCamera: !muteCamera,
              muteMicrophone: !muteMicrophone,
            }}
            onFinish={this.onJoinMeeting}
            //   onFinishFailed={this.onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="会议号"
              name="meetingId"
              rules={[{ required: true, message: "请输入会议号" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="您的名称"
              name="userid"
              rules={[{ required: true, message: "请输入您的名称" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="muteCamera"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>入会开启摄像头</Checkbox>
            </Form.Item>

            <Form.Item
              name="muteMicrophone"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>入会开启麦克风</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                加入会议
              </Button>
            </Form.Item>
          </Form>
          {/* <div className="setting-item">
          <div className="setting-item-label">入会开启摄像头</div>
          <Switch checked={!muteCamera} onChange={(e)=> this.toggleSettingItem('muteCamera', e)} className="setting-item-switch"></Switch>
        </div>
        <div className="setting-item m-t-sm">
          <div className="setting-item-label">入会开启麦克风</div>
          <Switch checked={!muteMicrophone} onChange={(e)=> this.toggleSettingItem('muteMicrophone', e)} className="setting-item-switch"></Switch>
        </div>
        <div className="setting-item m-t-sm">
          <div className="setting-item-label">入会显示时间</div>
          <Switch checked={!hideTime} onChange={(e)=> this.toggleSettingItem('hideTime', e)} className="setting-item-switch"></Switch>
        </div> */}
        </Drawer>
        <Drawer
          title="预约会议"
          placement="right"
          closable={false}
          onClose={() => {
            this.toggleDrawer("book");
          }}
          open={book}
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
              title: `${userid}预定的会议`,
            }}
            onFinish={this.onBookMeeting}
            //   onFinishFailed={this.onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="主题"
              name="title"
              rules={[{ required: true, message: "请输入会议主题" }]}
            >
              <Input placeholder="请输入主题" />
            </Form.Item>

            <div className="meeting-start">
              <Form.Item
                label="开始"
                name="startDate"
                className="meeting-start-date"
                rules={[{ required: true, message: "请选择开始时间" }]}
              >
                <DatePicker
                  placeholder="请选择开始日期"
                />
              </Form.Item>

              <Form.Item
                className="meeting-start-time"
                name="startTime"
              >
                <Input></Input>
              </Form.Item>
            </div>

            <Form.Item
              label="时长"
              name="duration"
              valuePropName="duration"
              rules={[{ required: true, message: "请选择时长" }]}
            >
              <Select>
                {meetingDurations.map((item) => {
                  return (
                    <Select.Option value={item.value}>
                      {item.label}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                加入会议
              </Button>
            </Form.Item>
          </Form>
          {/* <div className="setting-item">
          <div className="setting-item-label">入会开启摄像头</div>
          <Switch checked={!muteCamera} onChange={(e)=> this.toggleSettingItem('muteCamera', e)} className="setting-item-switch"></Switch>
        </div>
        <div className="setting-item m-t-sm">
          <div className="setting-item-label">入会开启麦克风</div>
          <Switch checked={!muteMicrophone} onChange={(e)=> this.toggleSettingItem('muteMicrophone', e)} className="setting-item-switch"></Switch>
        </div>
        <div className="setting-item m-t-sm">
          <div className="setting-item-label">入会显示时间</div>
          <Switch checked={!hideTime} onChange={(e)=> this.toggleSettingItem('hideTime', e)} className="setting-item-switch"></Switch>
        </div> */}
        </Drawer>
      </div>
    );
  }
}
