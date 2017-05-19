
const randomIdCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
const randomIdCharsetLength = randomIdCharset.length

export function generateRandomId(length) {
  let result = ''
  let array

  if ('Uint8Array' in window && 'crypto' in window) {
    array = new Uint8Array(length)
    window.crypto.getRandomValues(array)
  } else {
    array = new Array(length)
    for (let i = 0; i < length; i++)
      array[i] = Math.floor(Math.random() * randomIdCharsetLength)
  }

  for (let i = 0; i < length; i++)
    result += randomIdCharset.charAt(array[i] % randomIdCharsetLength)
  return result
}