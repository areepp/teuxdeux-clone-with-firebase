import create from 'zustand'

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
}

interface State {
  lists: IList[]
}

const useListStore = create<ListStore>((set: any) => ({
  lists: [],
  listOrder: ['one', 'two', 'three'],
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
}))

export default useListStore
