import { error } from 'console'
import mysql, { ResultSetHeader } from 'mysql2'

//

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '117468',
  database: 'shopDev'
})
const bathSize = 100000 //
const totalSize = 10000000
let currentId = 1
const insertBath = async () => {
  const values = []
  for (let i = 0; i < bathSize && currentId <= totalSize; i++) {
    const name = `name-${currentId}`
    const age = currentId
    const address = `address-${currentId}`
    values.push([currentId, name, age, address])
    currentId++
  }
  if (!values.length) {
    pool.end((err) => {
      if (err) {
        console.log(`error occurred while running bath`)
      } else {
        console.log(`connect pool close`)
      }
    })
    return
  }
  const sql = `INSERT INTO test_table (id,name,age,address) VALUES ?`

  pool.query(sql, [values], async function (err, results: ResultSetHeader) {
    if (err) throw err
    console.log(`Inserted ${results.affectedRows} records`)
    await insertBath()
  })
}
insertBath().catch(console.error)

//
