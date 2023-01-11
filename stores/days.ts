import { getInitialColumns } from '@/helper/dateHelper'
import { IDayColumn } from '@/types/IDayColumn'
import update from 'immutability-helper'
import create from 'zustand'

interface State {
  dayColumns: IDayColumn[]
}

export interface DayStore {
  dayColumns: IDayColumn[]
  setColumns: (_columns: IDayColumn[]) => void
  unshiftColumns: (_newColumns: IDayColumn[]) => void
  pushColumns: (_newColumns: IDayColumn[]) => void
  syncColumns: (_cloudColumns: IDayColumn[]) => void
  addTodoToColumn: (_columnId: string, _newItem: string) => void
  deleteTodoFromColumn: (_columnId: string, _todoId: string) => void
  editColumnById: (_columnId: string, _newColumn: IDayColumn) => void
}

const useDayStore = create<DayStore>((set: any) => ({
  dayColumns: getInitialColumns(),
  setColumns: (newColumns: IDayColumn[]) =>
    set(() => ({ dayColumns: newColumns })),
  unshiftColumns: (newColumns: IDayColumn[]) =>
    // add columns to the beginning of columns state array
    set((state: State) => ({
      dayColumns: [...newColumns, ...state.dayColumns],
    })),
  pushColumns: (newColumns: IDayColumn[]) =>
    // add columns to the end of columns state array
    set((state: State) => ({
      dayColumns: [...state.dayColumns, ...newColumns],
    })),
  syncColumns: (cloudColumns: IDayColumn[]) =>
    // replace a column from columns state to the ones that are found from api
    set((state: State) => ({
      dayColumns: state.dayColumns.map(
        (local: IDayColumn) =>
          cloudColumns.find((fire) => fire.id === local.id) || local,
      ),
    })),
  addTodoToColumn: (columnId: string, newItem: string) =>
    // add an id to a column order
    set((state: State) => ({
      dayColumns: state.dayColumns.map((column: IDayColumn) =>
        (column.id === columnId
          ? update(column, {
            order: {
              $push: [newItem],
            },
          })
          : column)),
    })),
  deleteTodoFromColumn: (columnId: string, todoId: string) =>
    set((state: State) => ({
      dayColumns: state.dayColumns.map((column) =>
        (column.id === columnId
          ? { ...column, order: column.order.filter((id) => id !== todoId) }
          : column)),
    })),
  editColumnById: (columnId: string, newColumn: IDayColumn) =>
    // replace a column with the new provided column
    set((state: State) => ({
      dayColumns: state.dayColumns.map((column: IDayColumn) =>
        (column.id === columnId ? newColumn : column)),
    })),
}))

export default useDayStore
