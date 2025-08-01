'use strict'

import { Model, Types } from 'mongoose'
import { UpdateQuery } from 'mongoose'
import database from '~/db/database'
import { convertToObjectIdMongo, getSelectData, getUnSelectData } from '~/utils'
type TQuery = {
  query: Record<string, any>
  limit?: number
  skip?: number
}
///QUERY///

const existingProduct = async ({ productName, productShop }: { productName: string; productShop: Types.ObjectId }) => {
  return await database.product
    .findOne({
      product_name: productName,
      product_shop: productShop
    })
    .lean()
}
const queryProduct = async ({ query, limit, skip }: { query: Record<string, any>; limit?: number; skip?: number }) => {
  return await database.product
    .find(query)
    .populate('product_shop', 'email name -_id')
    .sort({ updateAt: -1 })
    .skip(skip as number)
    .limit(limit as number)
    .lean()
}
const findAllDraftForShop = async ({ query, limit, skip }: TQuery) => {
  return await queryProduct({ query, limit, skip })
}
const findAllPublishForShop = async ({ query, limit, skip }: TQuery) => {
  return await queryProduct({ query, limit, skip })
}
const searchProductByUser = async (keySearch: string) => {
  // const regexSearch = new RegExp(keySearch)
  const resultsProduct = await database.product
    .find({ isPublished: true, $text: { $search: keySearch } }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .lean()

  return resultsProduct
}
const findAllProducts = async ({
  limit,
  sort,
  page,
  filter,
  select
}: {
  limit: number
  sort: string
  page: number
  filter: Record<string, any>
  select: string[]
}) => {
  const skip = (page - 1) * limit
  const sortBy: any = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const product = await database.product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
  return product
}
const findProduct = async ({ product_id, unSelect }: { product_id: string; unSelect: string[] }) => {
  return await database.product.findById(product_id).select(getUnSelectData(unSelect))
}
//PUT//
const publishProductByShop = async ({ product_shop, product_id }: { product_shop: string; product_id: string }) => {
  const foundShop = await database.product.findOne({
    product_shop: product_shop,
    _id: product_id
  })
  if (!foundShop) return null

  foundShop.isDraft = false
  foundShop.isPublished = true
  const { modifiedCount } = await foundShop.updateOne(foundShop)
  return modifiedCount
}
const UnPublishProductByShop = async ({ product_shop, product_id }: { product_shop: string; product_id: string }) => {
  const foundShop = await database.product.findOne({
    product_shop: product_shop,
    _id: product_id
  })
  if (!foundShop) return null

  foundShop.isDraft = true
  foundShop.isPublished = false
  const { modifiedCount } = await foundShop.updateOne(foundShop)
  return modifiedCount
}
const updateProductById = async <T>({
  productId,
  bodyUpdate,
  model,
  isNew = true
}: {
  productId: string
  bodyUpdate: UpdateQuery<T>
  model: Model<T>
  isNew?: boolean
}) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew
  })
}
const getProductById = async (productId: string) => {
  return await database.product.findOne({ _id: convertToObjectIdMongo(productId) }).lean()
}
export {
  existingProduct,
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  UnPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById
}
