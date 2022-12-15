import { getInitialColumns } from '@/utils/dateHelper'
import update from 'immutability-helper'
import create from 'zustand'

export interface IColumn {
  id: string
  order: string[]
}

interface State {
  columns: IColumn[]
}

export interface ColumnStore {
  columns: IColumn[]
  setColumns: (_columns: IColumn[]) => void
  unshiftColumns: (_newColumns: IColumn[]) => void
  pushColumns: (_newColumns: IColumn[]) => void
  syncColumns: (_cloudColumns: IColumn[]) => void
  pushToColumnOrder: (_columnId: string, _newItem: string) => void
  deleteTodoFromColumn: (_columnId: string, _todoId: string) => void
  editColumn: (_columnId: string, _newColumn: IColumn) => void
}

const useColumnStore = create<ColumnStore>((set: any) => ({
  columns: getInitialColumns(),
  setColumns: (newColumns: IColumn[]) => set(() => ({ columns: newColumns })),
  unshiftColumns: (newColumns: IColumn[]) =>
    // add columns to the beginning of columns state array
    set((state: any) => ({ columns: [...newColumns, ...state.columns] })),
  pushColumns: (newColumns: IColumn[]) =>
    // add columns to the end of columns state array
    set((state: any) => ({ columns: [...state.columns, ...newColumns] })),
  syncColumns: (cloudColumns: IColumn[]) =>
    // replace a column from columns state to the ones that are found from api
    set((state: any) => ({
      columns: state.columns.map(
        (local: IColumn) =>
          cloudColumns.find((fire) => fire.id === local.id) || local,
      ),
    })),
  pushToColumnOrder: (columnId: string, newItem: string) =>
    // add an id to a column order
    set((state: any) => ({
      columns: state.columns.map((column: IColumn) =>
        column.id === columnId
          ? update(column, {
              order: {
                $push: [newItem],
              },
            })
          : column,
      ),
    })),
  deleteTodoFromColumn: (columnId: string, todoId: string) =>
    set((state: State) => ({
      columns: state.columns.map((column) =>
        column.id === columnId
          ? { ...column, order: column.order.filter((id) => id !== todoId) }
          : column,
      ),
    })),
  editColumn: (columnId: string, newColumn: IColumn) =>
    // replace a column with the new provided column
    set((state: any) => ({
      columns: state.columns.map((column: IColumn) =>
        column.id === columnId ? newColumn : column,
      ),
    })),
}))

export default useColumnStore
