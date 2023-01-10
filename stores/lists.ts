import update from 'immutability-helper'
import create from 'zustand'

export interface IList {
  id: string
  title: string
  order: string[]
}

export interface ListStore {
  lists: IList[]
  listOrder: string[]
  addList: (_id: string) => void
  deleteList: (_deletedId: string) => void
  setListTitle: (_listId: string, _title: string) => void
  setLists: (_newLists: IList[]) => void
  setListOrder: (_listOrder: string[]) => void
  pushToListOrder: (_listId: string, _newItem: string) => void
  deleteTodoFromList: (_listId: string, _todoId: string) => void
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
    // add list to the lists state and listOrder state
    set((state: any) => ({
      lists: [...state.lists, { id, title: '', order: [] }],
      listOrder: [...state.listOrder, id],
    })),
  deleteList: (deletedId: string) =>
    // delete list from lists state and listOrder state
    set((state: State) => ({
      lists: state.lists.filter((list) => list.id !== deletedId),
      listOrder: state.listOrder.filter((id) => id !== deletedId),
    })),
  setListTitle: (listId: string, title: string) =>
    set((state: State) => ({
      lists: state.lists.map((list) =>
        (list.id === listId ? { ...list, title } : list)),
    })),
  setLists: (newLists: IList[]) => set(() => ({ lists: newLists })),
  setListOrder: (newListOrder: string[]) =>
    set(() => ({ listOrder: newListOrder })),
  pushToListOrder: (listId: string, newItem: string) =>
    // add a todo id to the list order
    set((state: State) => ({
      lists: state.lists.map((list) =>
        (list.id === listId
          ? update(list, {
            order: {
              $push: [newItem],
            },
          })
          : list)),
    })),
  deleteTodoFromList: (listId: string, todoId: string) =>
    set((state: State) => ({
      lists: state.lists.map((list) =>
        (list.id === listId
          ? { ...list, order: list.order.filter((id) => id !== todoId) }
          : list)),
    })),
  editList: (listId: string, newList: IList) =>
    // replace a list with a new provided list
    set((state: State) => ({
      lists: state.lists.map((list) => (list.id === listId ? newList : list)),
    })),
}))

export default useListStore
