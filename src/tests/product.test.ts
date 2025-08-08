import redisPubsubService from '~/services/redisPubsub.service'

class ProductServiceTest {
  purchaseProduct(productId: string, quantity: number) {
    const order = { productId, quantity }
    redisPubsubService.publish('purchase_events', JSON.stringify(order))
  }
}

const productServiceTest = new ProductServiceTest()
export default productServiceTest
