import create from 'zustand'
import update from 'immutability-helper'
import { getInitialColumns } from '@/utils/dateHelper'

export interface IColumn {
  id: string
  order: string[]
}

interface ColumnStore {
  columns: IColumn[]
  setColumns: (_columns: IColumn[]) => void
  unshiftColumns: (_newColumns: IColumn[]) => void
  pushColumns: (_newColumns: IColumn[]) => void
  syncColumns: (_cloudColumns: IColumn[]) => void
  pushToColumnOrder: (_columnId: string, _newItem: string) => void
  editColumn: (_columnId: string, _newColumn: IColumn) => void
}

const useColumnStore = create<ColumnStore>((set: any) => ({
  columns: getInitialColumns(),
  setColumns: (newColumns: IColumn[]) => set(() => ({ columns: newColumns })),
  unshiftColumns: (newColumns: IColumn[]) =>
    set((state: any) => ({ columns: [...newColumns, ...state.columns] })),
  pushColumns: (newColumns: IColumn[]) =>
    set((state: any) => ({ columns: [...state.columns, ...newColumns] })),
  syncColumns: (cloudColumns: IColumn[]) =>
    set((state: any) => ({
      columns: state.columns.map(
        (local: IColumn) =>
          cloudColumns.find((fire) => fire.id === local.id) || local,
      ),
    })),
  pushToColumnOrder: (columnId: string, newItem: string) =>
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
  editColumn: (columnId: string, newColumn: IColumn) =>
    set((state: any) => ({
      columns: state.columns.map((column: IColumn) =>
        column.id === columnId ? newColumn : column,
      ),
    })),
}))

export default useColumnStore
