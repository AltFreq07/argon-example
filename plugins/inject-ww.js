import HashWorker from '~/assets/js/HashWorker.worker.js' // worker files has to end in ".worker.js" - see nuxt.config.js

export default (context, inject) => {
  inject('worker', {
    createWorker() {
      return new HashWorker()
    },
  })
}
