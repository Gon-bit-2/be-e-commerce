import database from '~/db/database'
import { getSelectData, getUnSelectData } from '~/utils'

const finAllDiscountCodeSelect = async ({
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
  model?: any
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

const finAllDiscountCodeUnselect = async ({
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
  model: any
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

export { finAllDiscountCodeUnselect, finAllDiscountCodeSelect }
