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
