<template>
  <v-app>
    <v-main>
      <v-container>
        <p class="text-h3">Example</p>
        <p>
          <span class="text-h5">Runtime example</span><br />
          <v-text-field
            v-model="inputPassword"
            label="Password"
            required
            @keyup="createHashWorker()"
          ></v-text-field>
          <v-text-field
            v-model="inputSecret"
            label="Secret"
            required
            @keyup="createHashWorker()"
          ></v-text-field>
          Random Salt = {{ inputRandomSalt }}<br />
          Result Hash =
          <span class="font-weight-black" style="color: red">{{
            inputResultHash
          }}</span>
        </p>
        <p>
          <span class="text-h5">Multiple Hash Generate</span><br />
          <v-btn elevation="2" @click="generateHashes()"
            >Generate 50 hashes</v-btn
          ><br />
          Result =
          <span class="font-weight-black" style="color: red">{{
            generateHashesResult
          }}</span>
        </p>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import WorkerManager from '@/services/WorkerManager.js'
const crypto = require('crypto')
export default {
  data() {
    return {
      inputPassword: '',
      inputRandomSalt: '',
      inputResultHash: '',
      inputSecret: '',
      inputTimeout: null,
      generateHashesResult: '',
      worker: null,
    }
  },
  methods: {
    generateHashes() {
      this.generateHashesResult = 'Generating...'
      let salt = ''
      let pass = ''
      let secret = ''
      const start = performance.now()
      let end = performance.now()
      let counter = 1
      for (let i = 0; i < 50; i++) {
        salt = crypto.randomBytes(256).toString('base64')
        pass = crypto.randomBytes(256).toString('base64')
        secret = crypto.randomBytes(256).toString('base64')
        const hashWorker = WorkerManager.GetHashWorker(pass, salt, secret)
        hashWorker.onmessage = (event) => {
          end = performance.now()
          this.generateHashesResult =
            'Generated ' +
            counter++ +
            ' random hashes - ' +
            (end - start) +
            ' ms'
          hashWorker.terminate()
        }
      }
    },
    createHashWorker() {
      if (this.worker !== null) {
        this.worker.terminate()
      }
      if (this.inputPassword !== '') {
        this.inputResultHash = 'Generating...'
        this.inputRandomSalt = ''
        const salt = crypto.randomBytes(16).toString('base64')
        this.worker = WorkerManager.GetHashWorker(
          this.inputPassword,
          salt,
          this.inputSecret
        )
        this.worker.onmessage = (event) => {
          console.log(event.data)
          this.inputResultHash = event.data.encoded
          this.inputRandomSalt = salt
          this.worker.onmessage = null
        }
      } else {
        this.inputResultHash = ''
        this.inputRandomSalt = ''
      }
    },
  },
}
</script>
