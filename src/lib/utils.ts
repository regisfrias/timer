export const pad = (n: number) => ('00' + n).slice(-2)

export const msToTime = (s: number) => {
  const ms = s % 1000
  s = (s - ms) / 1000
  const secs = s % 60
  s = (s - secs) / 60
  const mins = s % 60
  const hrs = (s - mins) / 60

  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs)
}

export const msToTimeObj = (s: number) => {
  const ms = s % 1000
  s = (s - ms) / 1000
  const secs = s % 60
  s = (s - secs) / 60
  const mins = s % 60
  const hrs = (s - mins) / 60

  return {hrs, mins, secs}
}
