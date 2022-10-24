import request from './request';

export const RTC_APP_ID = 'd8lk7l4ed';

export const HOST = 'https://api-demo.qnsdk.com';

export const PREFIX = '/v1/rtc';

export const API = {
  LIST_ROOM: `/rooms/app/${RTC_APP_ID}`,
  LIST_USERS: (appid: string, roomid: string) =>
    `${HOST}${PREFIX}/users/app/${appid || RTC_APP_ID}/room/${roomid}`,
  GET_APP_CONFIG: (appid?: string) =>
    `${HOST}${PREFIX}/app/${appid || RTC_APP_ID}`,
  JOIN_ROOM_TOKEN: (roomid: string, userid: string, appid?: string) =>
    `${HOST}${PREFIX}/token/app/${appid || RTC_APP_ID}/room/${roomid}/user/${userid}`,
  CREATE_ROOM_TOKEN: (roomid: string, userid: string, appid?: string) =>
    `${HOST}${PREFIX}/token/admin/app/${appid || RTC_APP_ID}/room/${roomid}/user/${userid}`,
};

export const getToken = (appid: string, roomid: string, userid: string) => {
  const api = userid === 'admin' ? API.CREATE_ROOM_TOKEN : API.JOIN_ROOM_TOKEN;
  // 此处服务器 URL 仅用于 Demo 测试！随时可能 修改/失效，请勿用于 App 线上环境！
  // 此处服务器 URL 仅用于 Demo 测试！随时可能 修改/失效，请勿用于 App 线上环境！
  // 此处服务器 URL 仅用于 Demo 测试！随时可能 修改/失效，请勿用于 App 线上环境！
  const requestURL = `http://sumer.dev.qiniu.io/v1/roomtokens`;
  const info = {
    authToken: '',
    meetingId: "972-112-784",
    userId: userid,
    roomTokenExpireAt: Math.floor((Date.now() + 2 * 24 * 60 * 60 * 1000)/1000)
  }
  return request(requestURL, 'POST', info);
  // const requestURL = `${api(roomid, userid, appid)}?bundleId=demo-rtc.qnsdk.com`;
  // return request(requestURL, 'GET');
}

export const FLV_PATH = (roomName: string) => `https://pili-hdl.qnsdk.com/sdk-live/${roomName}.flv`;

export const HLS_PATH = (roomName: string) => `https://pili-hls.qnsdk.com/sdk-live/${roomName}.m3u8`;
