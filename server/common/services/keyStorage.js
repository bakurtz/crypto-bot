let crypto = require('crypto');
let sharedSecret = crypto.randomBytes(16); // should be 128 (or 256) bits
let initializationVector = crypto.randomBytes(16); // IV is always 16-bytes

let plaintext = "Everything's gonna be 200 OK!";
key = "this is my password. Make it as long as you want. But its hashed into 512 bytes."
let encrypted;

let encrypt = (utf8String) => {
    cipher = crypto.createCipher('aes-256-cbc', key)
    encryptedData = cipher.update(utf8String, 'utf8', 'hex')
    encryptedData += cipher.final('hex')
    return encryptedData;
}

let decrypt = (hexString, key) => {
  decipher = crypto.createDecipher('aes-256-cbc', key);
  decryptedData = decipher.update(hexString, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
}

let encryptedString = encrypt(plaintext);

console.log(decrypt(encryptedString,key))