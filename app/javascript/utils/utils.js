
export function ensureArray(obj, attr) {
  if (!(attr in obj)) obj[attr] = []
  if (!Array.isArray(obj[attr])) obj[attr] = [obj[attr]]
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}