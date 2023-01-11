import { IDayColumn } from '@/types/IDayColumn'

export const transformDateSlashToDash = (date: string) =>
  date.replace(/\//g, '-')

const columnFactory = (date: string) => ({
  id: transformDateSlashToDash(date),
  order: [],
})

export const getDaysColumns = (
  initialDate: Date,
  days: number,
  direction: 'future' | 'past',
): IDayColumn[] => {
  const returnValue: IDayColumn[] = []
  let multiplier = 1

  if (direction === 'past') multiplier = -1

  for (let i = 1; i <= days; i++) {
    const nextDate = new Date(
      initialDate.getTime() + 24 * 60 * 60 * 1000 * i * multiplier,
    ).toLocaleDateString()
    returnValue.push(columnFactory(nextDate))
  }

  return returnValue
}

export const getInitialColumns = (): IDayColumn[] => {
  // returns an array of column that contains 21 days (last week and next 2 weeks)
  const today = new Date()
  const nextTwoWeeks = getDaysColumns(today, 14, 'future')
  const lastWeek = getDaysColumns(today, 7, 'past')

  return [
    ...lastWeek.reverse(),
    columnFactory(today.toLocaleDateString()),
    ...nextTwoWeeks,
  ]
}

export const getReInitiatedDays = (date: Date): IDayColumn[] => [
  ...getDaysColumns(date, 7, 'past').reverse(),
  columnFactory(date.toLocaleDateString()),
  ...getDaysColumns(date, 7, 'future'),
]

export const getNextFourDays = (startDate: string): IDayColumn[] => {
  const date = new Date(startDate)

  return getDaysColumns(date, 4, 'future')
}

export const getPastFourDays = (startDate: string): IDayColumn[] => {
  const date = new Date(startDate)

  return getDaysColumns(date, 4, 'past')
}

export const getDayOfTheWeek = (prop: string) => {
  const date = new Date(prop)

  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

export const getFullDate = (prop: string) => {
  const date = new Date(prop)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export const checkIsToday = (date: string) => {
  const todayDate = new Date()
  const inputDate = new Date(date)

  return inputDate.setHours(0, 0, 0, 0) === todayDate.setHours(0, 0, 0, 0)
}

export const checkIsPast = (date: string) => {
  const todayDate = new Date()
  const inputDate = new Date(date)

  return inputDate.setHours(0, 0, 0, 0) < todayDate.setHours(0, 0, 0, 0)
}
