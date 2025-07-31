import { Types } from 'mongoose'

const getSelectData = (select: string[] = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]))
}
const getUnSelectData = (select: string[] = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]))
}
const convertToObjectIdMongo = (id: string) => new Types.ObjectId(id)
/**
 * @description Loại bỏ các thuộc tính có giá trị null hoặc undefined khỏi một object.
 * @param obj - Object đầu vào.
 * @returns Object đã được làm sạch.
 */
const removeUndefinedObject = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k]
    }
  })
  return obj
}

/**
 * @description Chuyển đổi một object lồng nhau thành một object phẳng với các key dạng "parent.child".
 * @param obj - Object đầu vào.
 * @returns Object đã được làm phẳng.
 */
const updateNestedObjectParser = (obj: any) => {
  const final: Record<string, any> = {}
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return final
  }
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k])
      Object.keys(response).forEach((r) => {
        final[`${k}.${r}`] = response[r]
      })
    } else {
      final[k] = obj[k]
    }
  })
  return final
}
export { getSelectData, getUnSelectData, removeUndefinedObject, updateNestedObjectParser, convertToObjectIdMongo }
