const { join } = require('path')

const vdSocket = require('./vd')
const CState = require('../state-center/api')

const cState = new CState({ name: 'hawk' })
const analyzePublisher = cState.publish('analyze')

const nodejieba = require('nodejieba')

nodejieba.load({
  userDict: join(__dirname, 'dictionary/userdict.txt'),
})

let danmaku = []
let danmaku1h = []

const filter = message => {
  if (message.includes('点歌')) {
    return false
  }
  if (message.includes('角色')) {
    return false
  }
  if (message.includes('整理')) {
    return false
  }
  if (message.includes('辣条')) {
    return false
  }
  if (!message.replace(/8/g, '').length) {
    return false
  }
  if (!message.replace(/6/g, '').length) {
    return false
  }
  if (!message.replace(/h/g, '').length) {
    return false
  }
  if (message.replace(/3/g, '') === '2') {
    return false
  }
  return true
}

const store = message => {
  if (typeof message !== 'string') {
    console.error(message)
  } else {
    danmaku.push(message)
    danmaku1h.push(message)
    setTimeout(() => danmaku.shift(), 1000 * 60 * 60 * 24)
    setTimeout(() => danmaku1h.shift(), 1000 * 60 * 60)
  }
}

vdSocket.on('danmaku', ({ message }) => {
  if (filter(message)) {
    store(message)
  }
})

setInterval(() => {
  const analyzed = {
    day: nodejieba.extract(danmaku.join('\n'), 256),
    h: nodejieba.extract(danmaku1h.join('\n'), 256),
  }
  analyzePublisher(analyzed)
  // io.emit('analyze', analyzed)
  console.log(`Analyze ${danmaku1h.length}, ${danmaku.length}`)
}, 1000 * 60)

console.log('Hawk is here')
