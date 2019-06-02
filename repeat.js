const vtbs = require('./api/vtbs')

let check = {}

for (let i = 0; i < vtbs.length; i++) {
  if (check[vtbs[i].mid]) {
    throw new Error(`Repeat: ${vtbs[i].mid}`)
  }
  if (!vtbs[i].mid) {
    throw new Error(`No MID: ${vtbs[i].mid}`)
  }
  if (typeof vtbs[i].note !== 'object') {
    throw new Error(`Wrong Note: ${vtbs[i].mid}`)
  }
  check[vtbs[i].mid] = true
}
