import { Model } from 'mongoose'
import database from '~/db/database'
import { getSelectData, getUnSelectData } from '~/utils'

const finAllDiscountCodeSelect = async <T>({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  select,
  model
}: {
  limit: number
  sort?: string
  page: number
  filter: Record<string, any>
  select: string[]
  model?: Model<T>
}) => {
  const skip = (page - 1) * limit
  const sortBy: any = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const document = await database.discount
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
  return document
}

const finAllDiscountCodeUnselect = async <T>({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  unSelect,
  model
}: {
  limit: number
  sort?: string
  page: number
  filter: Record<string, any>
  unSelect: string[]
  model: Model<T>
}) => {
  const skip = (page - 1) * limit
  const sortBy: any = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const document = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean()
  return document
}
const checkDiscountExists = async <T>({ model, filter }: { filter: Record<string, any>; model: Model<T> }) => {
  return await model.findOne(filter).lean()
}
export { finAllDiscountCodeUnselect, finAllDiscountCodeSelect, checkDiscountExists }
