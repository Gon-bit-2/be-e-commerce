'use strict'

import { Types } from 'mongoose'
import database from '~/db/database'
import { BadRequestError, NotFoundError } from '~/middleware/error.middleware'
import { IDiscount } from '~/model/discount.model'
import { finAllDiscountCodeSelect, finAllDiscountCodeUnselect } from '~/model/repositories/discount.repo'
import { findAllProducts } from '~/model/repositories/product.repo'
import { convertToObjectIdMongo } from '~/utils'

/*
1:gen discount code [shop/admin]
2:get discount amount [user]
3:get all discount code [user/shop]
4:verify code [user]
5:delete code [shop/admin]
6:cencel discount code [user]
*/
class DiscountService {
  async createDiscountCode(payload: IDiscount) {
    const {
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_is_active,
      discount_shopId,
      discount_min_order_value,
      discount_product_ids,
      discount_applies_to,
      discount_name,
      discount_description,
      discount_type,
      discount_users_used,
      discount_value,
      discount_uses_count,
      discount_max_uses,
      discount_max_uses_per_user
    } = payload

    if (new Date() > new Date(discount_start_date) || new Date() < new Date(discount_end_date)) {
      throw new BadRequestError('Discount code has Expired')
    }
    if (new Date(discount_start_date) >= new Date(discount_end_date)) {
      throw new BadRequestError('Start Date Must Be Before End Date')
    }
    const foundDiscount = await database.discount
      .findOne({
        discount_code: discount_code,
        discount_shopId: discount_shopId
      })
      .lean()

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount exists!')
    }
    const newDiscount = await database.discount.create({
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_start_date: new Date(discount_start_date),
      discount_end_date: new Date(discount_end_date),
      discount_max_uses,
      discount_uses_count,
      discount_users_used,
      discount_max_uses_per_user,
      discount_min_order_value: discount_min_order_value || 0,
      discount_shopId,
      discount_is_active,
      discount_applies_to,
      discount_product_ids: discount_applies_to === 'all' ? [] : discount_product_ids
    })
    return newDiscount
  }

  async updateDiscount() {}
  //
  //get all discount
  async getAllDiscountCodeWithProduct({
    discount_code,
    discount_shopId,
    userId,
    limit,
    page
  }: {
    discount_code: string
    discount_shopId: Types.ObjectId
    userId: Types.ObjectId
    limit: number
    page: number
  }) {
    const foundDiscount = await database.discount
      .findOne({
        discount_code: discount_code,
        discount_shopId: discount_shopId
      })
      .lean()
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not Exists')
    }
    const { discount_applies_to, discount_product_ids } = foundDiscount
    let products
    if (discount_applies_to === 'all') {
      //get all
      await finAllDiscountCodeSelect({
        filter: {
          product_shop: discount_product_ids,
          isPublished: true
        },
        limit: limit,
        page: page,
        sort: 'ctime',
        select: ['Product_name']
      })
    }
    if (discount_applies_to === 'specific') {
      //get the product id
      await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true
        },
        limit: limit,
        page: page,
        sort: 'ctime',
        select: ['Product_name']
      })
    }
    return products
  }
  async getAllDiscountCodeByShop({
    limit,
    page,
    discount_shopId
  }: {
    limit: number
    page: number
    discount_shopId: string
  }) {
    const discounts = await finAllDiscountCodeUnselect({
      limit: limit,
      page: page,
      filter: {
        discount_shopId: convertToObjectIdMongo(discount_shopId),
        discount_is_active: true
      },
      unSelect: ['__v', 'discount_shopId'],
      model: database.discount
    })
    return discounts
  }
}

const discountService = new DiscountService()
export default discountService
