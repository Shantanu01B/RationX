const CryptoJS = require("crypto-js");

const SECRET = process.env.QR_SECRET_KEY;

// Encrypt user ID
function encrypt(text) {
    return CryptoJS.AES.encrypt(text, SECRET).toString();
}

// Decrypt scanned QR data
function decrypt(cipher) {
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = { encrypt, decrypt };