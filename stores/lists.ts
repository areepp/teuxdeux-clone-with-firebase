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
  addList: (_id: string) => void
  deleteList: (_deletedId: string) => void
  setListTitle: (_listId: string, _title: string) => void
  setLists: (_newLists: IList[]) => void
  setListOrder: (_listOrder: string[]) => void
  pushToListOrder: (_listId: string, _newItem: string) => void
  editList: (_listId: string, _newList: IList) => void
}

interface State {
  lists: IList[]
  listOrder: string[]
}

const useListStore = create<ListStore>((set: any) => ({
  lists: [],
  listOrder: [],
  addList: (id: string) =>
    set((state: any) => ({
      lists: [...state.lists, { id, title: '', order: [] }],
      listOrder: [...state.listOrder, id],
    })),
  deleteList: (deletedId: string) =>
    set((state: State) => ({
      lists: state.lists.filter((list) => list.id !== deletedId),
      listOrder: state.listOrder.filter((id) => id !== deletedId),
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
