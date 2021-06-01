import ArgonManager from '@/services/ArgonManager.js'
// block for `time` ms, then return the number of loops we could run in that time:
// function expensive(time) {
//   const start = Date.now()
//   let count = 0
//   while (Date.now() - start < time) count++
//   return count
// }

// Respond to message from parent thread
self.addEventListener('message', async (event) => {
  if (event.data.action === 'hash') {
    // Post data to parent thread
    const hash = await ArgonManager.GetHash(
      event.data.password,
      event.data.salt,
      event.data.secret
    )
    self.postMessage(hash)
  } else {
    self.postMessage({ hello: 'from worker' })
  }
})
