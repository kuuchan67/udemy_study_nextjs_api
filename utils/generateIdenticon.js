const Identicon = require("identicon.js")

const generateIdeticon = (input,size=64) => {

    const hash = require("crypto").createHash("md5").update(input).digest("hex");
    const data = new Identicon(hash, size).toString();
    return `data:image/ping;base64,${data}`;
}

module.exports = generateIdeticon;