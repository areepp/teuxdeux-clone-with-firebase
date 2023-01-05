import { getDaysColumns } from "@/helper/dateHelper";

test('getDaysColumns functions properly', () => {
  const today = new Date()
  const columns = getDaysColumns(today, 7, 'future')
  expect(columns).toHaveLength(7)
  columns.forEach(col => {
    expect(col).toHaveProperty('id')
    expect(col).toHaveProperty('order')
  })
})