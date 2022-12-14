import { TfiTrash } from 'react-icons/tfi'
import * as listService from '@/lib/list.service'
import * as todoService from '@/lib/todo.service'
import useListStore from '@/stores/lists'
import { useAuth } from '@/components/AuthContext'

interface Props {
  listId: string
}

const ListOption = ({ listId }: Props) => {
  const listStore = useListStore()
  const { user } = useAuth()

  const handleDelete = async () => {
    const confirmWindow = confirm(
      'Eits bentar bentar... Are you sure about this?\n\nDeleting this list will also delete all to-dos within it.',
    )
    if (confirmWindow) {
      listStore.deleteList(listId)
      const todosInList = listStore.lists.filter(
        (list) => list.id === listId,
      )[0].order
      Promise.all([
        listService.deleteList(user!.uid, listId),
        listService.deleteFromListOrder(user!.uid, listId),
        todoService.deleteMultipleTodos(user!.uid, todosInList),
      ])
    } else {
      return
    }
  }

  return (
    <div className="absolute left-0 top-6 rounded-xl shadow bg-white overflow-hidden">
      <button
        onClick={handleDelete}
        className="flex items-center px-3 py-2 hover:bg-zinc-50"
      >
        <TfiTrash /> <span className="ml-2 md:text-sm">Delete</span>
      </button>
    </div>
  )
}

export default ListOption
