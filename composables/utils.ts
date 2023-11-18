export function formatNumber (number: number) {
  if (number < 1000) {
    return number.toFixed(0)
  } else if (number < 1000000) {
    return (number / 1000).toFixed(1) + 'K'
  } else if (number < 1000000000) {
    return (number / 1000000).toFixed(1) + 'M'
  } else {
    return (number / 1000000000).toFixed(1) + 'B'
  }
}


export function getPercentage(votes: number, total: number) {
  return Number(((votes / total) * 100).toFixed(2))
}
