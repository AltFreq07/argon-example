export default {
  GetHashWorker(password, salt, secret) {
    const singleWorker = window.$nuxt.$root.context.app.$worker.createWorker()
    console.log(singleWorker)
    singleWorker.postMessage({
      action: 'hash',
      password,
      salt,
      secret,
    })
    return singleWorker
  },
}
