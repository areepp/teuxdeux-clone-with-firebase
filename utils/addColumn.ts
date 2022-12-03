import { IColumn } from '@/components/Dashboard/Column'

const columnFactory = (date: string) => {
  return {
    id: date,
    order: [],
  }
}

export const getNextFourDays = (startDate: string) => {
  const date = new Date(startDate)
  let nextFourDays: IColumn[] = []

  for (let i = 1; i <= 4; i++) {
    const nextDate = new Date(
      date.getTime() + 24 * 60 * 60 * 1000 * i,
    ).toLocaleDateString('en-US')
    nextFourDays.push(columnFactory(nextDate))
  }

  return nextFourDays
}

export const getPastFourDays = (startDate: string) => {
  const date = new Date(startDate)
  let pastFourDays: IColumn[] = []

  for (let i = 1; i <= 4; i++) {
    const pastDate = new Date(
      date.getTime() - 24 * 60 * 60 * 1000 * i,
    ).toLocaleDateString('en-US')
    pastFourDays.push(columnFactory(pastDate))
  }

  return pastFourDays
}
