import redisPubsubService from '~/services/redisPubsub.service'

class InvenServiceTest {
  constructor() {
    redisPubsubService.subscribe('purchase_events', (channel, message) => {
      console.log('received message', message)

      inventoryServiceTest.updateInventory(message)
    })
  }
  updateInventory(productId: string, quantity?: number) {
    console.log(`update inventory with ${productId} with quantity ${quantity}`)
  }
}
const inventoryServiceTest = new InvenServiceTest()
export default inventoryServiceTest
