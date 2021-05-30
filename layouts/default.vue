<template>
  <v-app>
    <v-main>
      <v-container>
        <p class="text-h3">Example</p>
        <p>
          <span class="text-h5">Password > Hash</span><br />
          Input password = {{ passwordString }}<br />
          Input salt = {{ passwordSalt }}<br />
          Result Hash =
          <span class="font-weight-black" style="color: red">{{
            passwordHash
          }}</span>
        </p>
        <p>
          <span class="text-h5">Hash > Password</span><br />
          Input password = {{ passwordString }}<br />
          Input hash = {{ passwordHash }}<br />
          Result Compare =
          <span class="font-weight-black" style="color: red">{{
            compareResult
          }}</span>
        </p>
        <p>
          <span class="text-h5">Runtime example</span><br />
          <v-text-field
            v-model="inputPassword"
            label="Password"
            required
            @keyup="setGenerating()"
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
const crypto = require('crypto')
const argon2 = require('argon2-browser')

export default {
  data() {
    return {
      passwordString: 'ThisIsATestPassword!',
      passwordSalt: 'PasswordSalt',
      passwordHash: '',
      compareResult: false,
      inputPassword: '',
      inputRandomSalt: '',
      inputResultHash: '',
      inputTimeout: null,
      generateHashesResult: '',
    }
  },
  mounted() {
    this.getHash(this.passwordString, this.passwordSalt) // result
      .then((res) => {
        // res.hash // hash as Uint8Array
        // res.hashHex // hash as hex-string
        this.passwordHash = res.encoded // encoded hash, as required by argon2
        this.verifyHash(this.passwordString, this.passwordHash).then(() => {
          console.log('OK')
          this.compareResult = true
        })
      })
  },
  methods: {
    getHash(password, salt) {
      return (
        argon2
          .hash({
            // required
            pass: password,
            salt,
            // optional
            time: 2, // the number of iterations
            mem: 15360, // used memory, in KiB
            hashLen: 24, // desired hash length
            parallelism: 1, // desired parallelism (will be computed in parallel only for PNaCl)
            // secret: new Uint8Array([...]), // optional secret data
            // ad: new Uint8Array([...]), // optional associated data
            type: argon2.ArgonType.Argon2id, // or argon2.ArgonType.Argon2i or argon2.ArgonType.Argon2id
          })
          // or error
          .catch((err) => {
            console.log(err.message)
            // err.message // error message as string, if available
            // err.code // numeric error code
          })
      )
    },
    verifyHash(password, hash) {
      return argon2.verify({ pass: password, encoded: hash }).catch((e) => {
        console.error(e.message, e.code)
        this.compareResult = false
      })
    },
    setGenerating() {
      if (this.inputPassword === '') {
        this.inputResultHash = ''
      } else {
        clearTimeout(this.inputTimeout)
        this.inputResultHash = 'Generating...'
        this.inputTimeout = setTimeout(this.generateInputHash, 250)
      }
    },
    generateInputHash() {
      if (this.inputPassword === '') {
        this.inputResultHash = ''
        this.inputRandomSalt = ''
      } else {
        const salt = crypto.randomBytes(128).toString('base64')
        this.inputRandomSalt = salt
        this.getHash(this.inputPassword, salt).then(
          (res) => (this.inputResultHash = res.encoded)
        )
      }
    },
    generateHashes() {
      this.generateHashesResult = 'Generating'
      setTimeout(
        async function () {
          let salt = ''
          let pass = ''
          const start = performance.now()
          for (let i = 0; i < 50; i++) {
            salt = crypto.randomBytes(128).toString('base64')
            pass = crypto.randomBytes(16).toString('base64')
            await this.getHash(pass, salt)
          }
          const end = performance.now()

          this.generateHashesResult =
            'Generated 50 random hashes - ' + (end - start) + ' ms'
        }.bind(this),
        500
      )
    },
  },
}
</script>
