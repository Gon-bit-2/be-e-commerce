'use strict'
import { pick } from 'lodash'
const getInfoData = ({ fields, object }: { fields: string[]; object: any }) => {
  return pick(object, fields)
}
export { getInfoData }
