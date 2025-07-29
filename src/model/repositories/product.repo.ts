'use strict'

import database from '~/db/database'
type TQuery = {
  query: Record<string, any>
  limit?: number
  skip?: number
}
///QUERY///
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
export { findAllDraftForShop, findAllPublishForShop, publishProductByShop, UnPublishProductByShop, searchProductByUser }
