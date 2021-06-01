const argon2 = require('argon2-browser')

export default {
  VerifyHash(password, hash, secret) {
    const enc = new TextEncoder()
    const encodedSecret = enc.encode(secret)
    return argon2.verify({
      pass: password,
      secret: encodedSecret,
      encoded: hash,
    })
  },
  GetHash(password, salt, secret) {
    const enc = new TextEncoder()
    const encodedSecret = enc.encode(secret)
    return (
      argon2
        .hash({
          // required
          pass: password,
          salt,
          // optional
          time: 1, // the number of iterations
          mem: 128000, // used memory, in KiB
          hashLen: 32, // desired hash length
          parallelism: 1, // desired parallelism (will be computed in parallel only for PNaCl)
          secret: encodedSecret, // optional secret data
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
}
