import create from 'zustand'
import update from 'immutability-helper'

export interface IList {
  id: string
  title: string
  order: string[]
}

interface ListStore {
  lists: IList[]
  listOrder: string[]
  addList: () => void
  setListTitle: (_listId: string, _title: string) => void
  setLists: (_newLists: IList[]) => void
  setListOrder: (_listOrder: string[]) => void
  pushToListOrder: (_listId: string, _newItem: string) => void
  editList: (_listId: string, _newList: IList) => void
}

interface State {
  lists: IList[]
}

const useListStore = create<ListStore>((set: any) => ({
  lists: [],
  listOrder: [],
  addList: () =>
    set((state: any) => ({
      lists: [...state.lists, { id: '', title: '', order: [] }],
    })),
  setListTitle: (listId: string, title: string) =>
    set((state: State) => ({
      lists: state.lists.map((list) =>
        list.id === listId ? { ...list, title } : list,
      ),
    })),
  setLists: (newLists: IList[]) => set(() => ({ lists: newLists })),
  setListOrder: (newListOrder: string[]) =>
    set(() => ({ listOrder: newListOrder })),
  pushToListOrder: (listId: string, newItem: string) =>
    set((state: State) => ({
      lists: state.lists.map((list) =>
        list.id === listId
          ? update(list, {
              order: {
                $push: [newItem],
              },
            })
          : list,
      ),
    })),
  editList: (listId: string, newList: IList) =>
    set((state: State) => ({
      lists: state.lists.map((list) => (list.id === listId ? newList : list)),
    })),
}))

export default useListStore
