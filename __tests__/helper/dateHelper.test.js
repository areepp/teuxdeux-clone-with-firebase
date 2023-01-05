import { getDaysColumns } from "@/helper/dateHelper";

test('getDaysColumns functions properly', () => {
  const date = new Date('1/1/2023')
  const columns = getDaysColumns(date, 7, 'future')

  const expectedOutput = [
    { id: '1-2-2023', order: [] },
    { id: '1-3-2023', order: [] },
    { id: '1-4-2023', order: [] },
    { id: '1-5-2023', order: [] },
    { id: '1-6-2023', order: [] },
    { id: '1-7-2023', order: [] },
    { id: '1-8-2023', order: [] }
  ]

  expect(columns).toEqual(expectedOutput)
})