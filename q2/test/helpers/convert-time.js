export const minutes = sec => sec * 60
export const hours = sec => minutes(sec) * 60
export const days = sec => hours(sec) * 24
export const weeks = sec => days(sec) * 24
export const years = sec => days(sec) * 365

