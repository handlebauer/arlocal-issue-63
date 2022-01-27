import test from 'ava'

import { arlocal } from './arlocal.js'
import { arweave } from './arweave.js'

const encode = obj => JSON.stringify(obj)

test('Should fail when data is fetched with arweave.getData() method', async t => {
  // Setup
  await arlocal.start()
  const key = await arweave.wallets.generate()
  const address = await arweave.wallets.jwkToAddress(key)
  await arweave.api.get(`mint/${address}/${1e12}`)

  // Post transaction
  const data = { hello: 'world' }
  const tx = await arweave.createTransaction({ data: encode(data) }, key) // <-- supplying the wallet doesn't help here
  await arweave.transactions.sign(tx, key)
  await arweave.transactions.post(tx)

  // Mine
  await arweave.api.get('mine/5')

  // This works
  const success = await arweave.api.get(tx.id).then(({ data }) => data)
  t.deepEqual(data, success)

  // This doesn't
  const failure = await arweave.transactions.getData(tx.id, {
    decode: true,
    string: true,
  })
  t.notDeepEqual(data, failure)
})

test.after.always(async () => {
  await arlocal.stop()
})
