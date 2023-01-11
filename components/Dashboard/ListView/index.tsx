import { useState } from 'react'
import { IoIosAdd, IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import SwiperCore from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useAuth } from '@/components/AuthContext'
import * as listService from '@/lib/list.service'
import useListStore, { IList } from '@/stores/lists'
import useTodoStore, { ITodo } from '@/stores/todos'
import useSettingStore from '@/stores/settings'
import ListColumn from './ListColumn'
import NavLeft from './NavLeft'
import NavRight from './NavRight'
import ReOrderListModal from './ReOrderListModal'
import SlideProgress from './SlideProgress'

const ListView = () => {
  const { user } = useAuth()
  const listStore = useListStore()
  const todoStore = useTodoStore()
  const settingStore = useSettingStore()
  const [swiperRef, setSwiperRef] = useState<SwiperCore>()
  const [isListVisible, setIsListVisible] = useState(true)
  const [isReOrderModalVisible, setIsReOrderModalVisible] = useState(false)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  const handleAddList = async () => {
    const res = await listService.addList(user!.uid)
    listService.addToListOrder(user!.uid, res.id)
    listStore.addList(res.id)
  }

  return (
    <section className="bg-zinc-50 py-2">
      {/* LIST TOGGLER */}
      <div className="px-5 flex items-center justify-between">
        {/* ACTUAL TOGGLER */}
        <button
          type="button"
          className="text-3xl text-gray-400 hover:text-primary transition-all duration-300"
          onClick={() => setIsListVisible(!isListVisible)}
        >
          {isListVisible ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
        </button>

        {/* RE-ORDER LIST BUTTON */}
        <div className="flex items-center">
          <SlideProgress activeSlideIndex={activeSlideIndex} />
          <button
            type="button"
            className="ml-4 px-3 py-1 text-xs rounded bg-zinc-200 hover:bg-zinc-300 transition-all"
            onClick={() => setIsReOrderModalVisible(true)}
          >
            Re-order
          </button>
        </div>

        {isReOrderModalVisible && (
          <ReOrderListModal
            setIsReOrderModalVisible={setIsReOrderModalVisible}
          />
        )}

        {/* ADD NEW LIST BUTTON */}
        <button
          type="button"
          onClick={handleAddList}
          className="text-3xl text-gray-400 hover:text-primary transition-all duration-300"
        >
          <IoIosAdd />
        </button>
      </div>

      {/* LISTS */}
      {isListVisible && (
        <div className="relative flex min-h-[500px]">
          <NavLeft activeSlideIndex={activeSlideIndex} swiperRef={swiperRef} />

          <div className="flex w-full md:w-main">
            <Swiper
              className="w-full"
              onSwiper={setSwiperRef}
              initialSlide={0}
              slidesPerView={settingStore.slidesPerView}
              allowTouchMove={false}
              speed={600}
              onActiveIndexChange={(e) => setActiveSlideIndex(e.activeIndex)}
              onSlidesLengthChange={(e) => {
                if (e.slides.length <= 4) return
                swiperRef?.slideTo(e.slides.length - 3) // swipe when new list is created
              }}
            >
              {listStore.listOrder.map((id) => {
                let listTodos
                const list = listStore.lists.find((el) => el.id === id) as IList
                if (list.order.length === 0) {
                  listTodos = null
                } else {
                  listTodos = list.order.map(
                    (elId) =>
                      todoStore.todos.find((todo) => todo.id === elId) as ITodo,
                  )
                }

                return (
                  <SwiperSlide className="w-full" key={list.id}>
                    <ListColumn list={list} todos={listTodos} key={list.id} />
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>

          <NavRight activeSlideIndex={activeSlideIndex} swiperRef={swiperRef} />
        </div>
      )}
    </section>
  )
}

export default ListView
