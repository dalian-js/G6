import type { PrefixKey, PrefixObject, ReplacePrefix } from '../types/prefix';

/**
 * <zh> 首字母大写
 *
 * <en> Uppercase first letter
 * @param str - <zh> 字符串 | <en> string
 * @returns <zh> 首字母大写的字符串 | <en> Uppercase first letter string
 */
export function toUppercaseFirstLetter<T extends string>(str: T) {
  return (str.toString().charAt(0).toUpperCase() + str.toString().slice(1)) as Capitalize<T>;
}

/**
 * <zh> 首字母小写
 *
 * <en> Lowercase first letter
 * @param str - <zh> 字符串 | <en> string
 * @returns <zh> 首字母小写的字符串 | <en> Lowercase first letter string
 */
export function toLowercaseFirstLetter(str: string) {
  return str.toString().charAt(0).toLowerCase() + str.toString().slice(1);
}

/**
 * <zh> 是否以某个前缀开头
 *
 * <en> Whether starts with prefix
 * @param str - <zh> 字符串 | <en> string
 * @param prefix - <zh> 前缀 | <en> prefix
 * @returns <zh> 是否以某个前缀开头 | <en> whether starts with prefix
 */
export function startsWith(str: string, prefix: string) {
  if (!str.startsWith(prefix)) return false;
  const nextChart = str[prefix.length];
  return nextChart >= 'A' && nextChart <= 'Z';
}

/**
 * <zh> 添加前缀
 *
 * <en> Add prefix
 * @param str - <zh> 字符串 | <en> string
 * @param prefix - <zh> 前缀 | <en> prefix
 * @returns <zh> 添加前缀后的字符串 | <en> string with prefix
 */
export function addPrefix(str: string, prefix: string): PrefixKey {
  return `${prefix}${toUppercaseFirstLetter(str)}`;
}

/**
 * <zh> 移除前缀
 *
 * <en> Remove prefix
 * @param string - <zh> 字符串 | <en> string
 * @param prefix - <zh> 前缀 | <en> prefix
 * @param lowercaseFirstLetter - <zh> 是否小写首字母 | <en> whether lowercase first letter
 * @returns <zh> 移除前缀后的字符串 | <en> string without prefix
 */
export function removePrefix(string: string, prefix?: string, lowercaseFirstLetter: boolean = true) {
  if (!prefix) return string;
  if (!startsWith(string, prefix)) return string;
  const str = string.slice(prefix.length);
  return lowercaseFirstLetter ? toLowercaseFirstLetter(str) : str;
}

/**
 * <zh> 从样式中提取子样式
 *
 * <en> Extract sub style from style
 * @param style - <zh> 样式 | <en> style
 * @param prefix - <zh> 子样式前缀 | <en> sub style prefix
 * @returns <zh> 子样式 | <en> sub style
 */
export function subStyleProps<T extends object>(style: object, prefix: string) {
  return Object.entries(style).reduce((acc, [key, value]) => {
    if (key === 'className' || key === 'class') return acc;
    if (startsWith(key, prefix)) {
      acc[removePrefix(key, prefix)] = value;
    }
    return acc;
  }, {} as T);
}

/**
 * <zh/> 从样式中排除子样式
 *
 * <en/> Omit sub style from style
 * @param style - <zh/> 样式 | <en/> style
 * @param prefix - <zh/> 子样式前缀 | <en/> sub style prefix
 * @returns <zh/> 排除子样式后的样式 | <en/> style without sub style
 */
export function omitStyleProps<T extends object>(style: object, prefix: string) {
  return Object.entries(style).reduce((acc, [key, value]) => {
    if (!startsWith(key, prefix)) {
      acc[key] = value;
    }
    return acc;
  }, {} as T);
}

/**
 * <zh> 创建前缀样式
 *
 * <en> Create prefix style
 * @param style - <zh> 样式 | <en> style
 * @param prefix - <zh> 前缀 | <en> prefix
 * @returns <zh> 前缀样式 | <en> prefix style
 */
export function superStyleProps<T extends object, P extends string>(style: T, prefix: P): PrefixObject<T, P> {
  return Object.entries(style).reduce(
    (acc, [key, value]) => {
      acc[addPrefix(key, prefix)] = value;
      return acc;
    },
    {} as PrefixObject<T, P>,
  );
}

/**
 * <zh> 替换前缀
 *
 * <en> Replace prefix
 * @param style - <zh> 样式 | <en> style
 * @param oldPrefix - <zh> 旧前缀 | <en> old prefix
 * @param newPrefix - <zh> 新前缀 | <en> new prefix
 * @returns <zh> 替换前缀后的样式 | <en> style with replaced prefix
 */
export function replacePrefix<T extends object>(style: T, oldPrefix: string, newPrefix: string) {
  return Object.entries(style).reduce(
    (acc, [key, value]) => {
      if (startsWith(key, oldPrefix)) {
        acc[addPrefix(removePrefix(key, oldPrefix, false), newPrefix)] = value;
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {} as ReplacePrefix<T, typeof oldPrefix, typeof newPrefix>,
  );
}