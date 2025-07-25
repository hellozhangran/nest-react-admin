import * as Lodash from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear'; // 导入插件
import timezone from 'dayjs/plugin/timezone'; // 导入插件
import utc from 'dayjs/plugin/utc'; // 导入插件
import 'dayjs/locale/zh-cn'; // 导入本地化语言
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Beijing'); // tz(timezone) 设置 默认时区为东八区
dayjs.extend(isLeapYear); // 是否是闰年插件 dayjs('2000-01-01').isLeapYear() 返回true
dayjs.locale('zh-cn'); // 使用本地化语言


/**
 * UTC 时间工具函数
 * 用于数据库存储、API 内部计算
 * @param time 可选，指定时间，默认当前时间
 * @param format 可选，输出格式，默认 ISO 格式
 * @returns UTC 时间字符串
 */
export function useUTCTime(time?: string | Date, format?: string): string {
  const utcTime = time ? dayjs(time).utc() : dayjs().utc();
  return format ? utcTime.format(format) : utcTime.toISOString();
}

/**
 * 北京时间工具函数
 * 用于用户界面显示、本地化处理
 * @param time 可选，指定时间（可以是UTC时间），默认当前时间
 * @param format 可选，输出格式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 北京时间字符串
 */
export function useBeijingTime(time?: string | Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  if (time) {
    // 如果传入的是UTC时间，先转换
    return dayjs.utc(time).tz('Asia/Beijing').format(format);
  } else {
    // 当前北京时间
    return dayjs().tz('Asia/Beijing').format(format);
  }
}

/**
 * 数组转树结构
 * @param arr
 * @param getId
 * @param getLabel
 * @returns
 */
export function ListToTree(arr, getId, getLabel) {
  const kData = {}; // 以id做key的对象 暂时储存数据
  const lData: any[] = []; // 最终的数据 arr

  // 第一次遍历，构建 kData
  arr.forEach((m: any) => {
    const id = getId(m);
    const label = getLabel(m);
    const parentId = +m.parentId;

    kData[id] = {
      id,
      label,
      parentId,
      children: [], // 初始化 children 数组
    };

    // 如果是根节点，直接推入 lData
    if (parentId === 0) {
      lData.push(kData[id]);
    }
  });
  // 第二次遍历，处理子节点
  arr.forEach((m: any) => {
    const id = getId(m);
    const parentId = +m.parentId;

    if (parentId !== 0) {
      // 确保父节点存在后再添加子节点
      if (kData[parentId]) {
        kData[parentId].children.push(kData[id]);
      } else {
        console.warn(`Parent menuId: ${parentId} not found for child menuId: ${id}`);
      }
    }
  });
  return lData;
}

/**
 * 获取当前时间
 * YYYY-MM-DD HH:mm:ss
 * @returns
 */
export function GetNowDate() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 时间格式化
 * @param date
 * @param format
 * @returns
 */
export function FormatDate(date: Date, format = 'YYYY-MM-DD HH:mm:ss') {
  return date && dayjs(date).format(format);
}

/**
 * 深拷贝
 * @param obj
 * @returns
 */
export function DeepClone<T>(obj: T) {
  return Lodash.cloneDeep(obj);
}

/**
 * 生成唯一id
 * UUID
 * @returns
 */
export function GenerateUUID(): string {
  const uuid = uuidv4();
  return uuid.replaceAll('-', '');
}

/**
 * 数组去重
 * @param list
 * @returns
 */
export function Uniq<T extends number | string>(list: Array<T>): Array<T> {
  return Lodash.uniq(list);
}

/**
 * 分页
 * @param data
 * @param pageSize
 * @param pageNum
 * @returns
 */
export function Paginate(data: { list: Array<any>; pageSize: number; pageNum: number }, filterParam: any) {
  // 检查 pageSize 和 pageNumber 的合法性
  if (data.pageSize <= 0 || data.pageNum < 0) {
    return [];
  }

  // 将数据转换为数组
  let arrayData = Lodash.toArray(data.list);

  if (Object.keys(filterParam).length > 0) {
    arrayData = Lodash.filter(arrayData, (item) => {
      const arr: boolean[] = [];
      if (filterParam.ipaddr) {
        arr.push(Boolean(item.ipaddr.includes(filterParam.ipaddr)));
      }

      if (filterParam.userName && item.userName) {
        arr.push(Boolean(item.userName.includes(filterParam.userName)));
      }
      return !Boolean(arr.includes(false));
    });
  }

  // 获取指定页的数据
  const pageData = arrayData.slice((data.pageNum - 1) * data.pageSize, data.pageNum * data.pageSize);

  return pageData;
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}
