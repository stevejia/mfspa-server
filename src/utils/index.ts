import {
  HIDE_TIME,
  MEETING_LIST,
  MUTE_CAMERA,
  MUTE_MICROPHONE,
  USER_MEETING_ID,
  USR_ID,
} from "../constant/constant";

/**
 * 判断对象是否为空或者空字符串(包含空格)
 * @param emptyLike 要判断是否为空的对象
 * @returns boolean
 */
export const isNullOrWhiteSpace = (emptyLike) => {
  if (emptyLike === undefined) {
    return true;
  }
  if (emptyLike === null) {
    return true;
  }

  if (typeof emptyLike === "string" && !emptyLike.trim()) {
    return true;
  }
  return false;
};
/**
 * 判断对象是否为空或者空字符串
 * @param emptyLike 要校验的对象
 * @returns boolean
 */
export const isNullOrEmpty = (emptyLike) => {
  if (emptyLike === undefined) {
    return true;
  }
  if (emptyLike === null) {
    return true;
  }

  if (typeof emptyLike === "string" && !emptyLike) {
    return true;
  }
  return false;
};

/**
 * 判断对象是否为空或者空字符串或空对象
 * @param emptyLike 要校验的对象
 * @returns boolean
 */
export const isNullOrEmptyObject = (emptyLike) => {
  if (emptyLike === undefined) {
    return true;
  }
  if (emptyLike === null) {
    return true;
  }

  if (typeof emptyLike === "string" && !emptyLike) {
    return true;
  }

  if (typeof emptyLike === "object" && JSON.stringify(emptyLike) === "{}") {
    return true;
  }

  if (emptyLike instanceof Array && emptyLike.length === 0) {
    return true;
  }
  return false;
};

export const clone: <T>(arg: T) => T = <T>(obj: T) => {
  if (isNullOrEmpty(obj)) {
    return obj;
  }
  return toObject(toJSON(obj)) as T;
};

export const toJSON = (obj) => {
  if (isNullOrEmpty(obj)) {
    return obj;
  }
  return JSON.stringify(obj);
};

export const equals = (obj1, obj2) => {
  const obj1Empty = isNullOrEmpty(obj1);
  const obj2Empty = isNullOrEmpty(obj2);

  if (obj1Empty && obj2Empty) {
    return true;
  } else if (!obj1Empty && !obj2Empty) {
    return toJSON(obj1) === toJSON(obj2);
  } else {
    return false;
  }
};

export const toObject = (obj) => {
  return JSON.parse(obj);
};

export function formatDate(date, fmt = "yyyy-MM-dd hh:mm:ss") {
  if (typeof date == "string") {
    return date;
  }

  if (typeof date === "number") {
    date = new Date(date);
  }

  if (!fmt) fmt = "yyyy-MM-dd hh:mm:ss";

  if (!date || date == null) return null;
  var o = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), // 日
    "h+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  }
  return fmt;
}

export function getCommonData() {
  const userid = localStorage.getItem(USR_ID);
  const muteCamera = JSON.parse(localStorage.getItem(MUTE_CAMERA) || "true");
  const muteMicrophone = JSON.parse(
    localStorage.getItem(MUTE_MICROPHONE) || "true"
  );
  const hideTime = JSON.parse(localStorage.getItem(HIDE_TIME) || "true");

  const userMeetingId = JSON.parse(localStorage.getItem(USER_MEETING_ID));

  const meetingList = JSON.parse(localStorage.getItem(MEETING_LIST) || "[]");
  return {
    userid,
    muteCamera,
    muteMicrophone,
    hideTime,
    userMeetingId,
    meetingList,
  };
}

export function guid() {
  let code = Math.floor(Math.random() * Math.pow(10, 8));
  if (code < Math.pow(10, 7)) {
    code += Math.pow(10, 7);
  }
  return code;
}

export function getQueryParam(url: string) {
  let p = url.split("?")[1];
  let keyValue = p.split("&");
  let obj: any = {};
  for (let i = 0; i < keyValue.length; i++) {
    let item = keyValue[i].split("=");
    let key = item[0];
    let value = item[1];
    obj[key] = value;
  }
  return obj;
}

export function isScreenVideo(tag: string) {
  if (!tag) {
    return false;
  }
  tag = tag.toLowerCase();

  return tag.indexOf("screen") > -1;
}
