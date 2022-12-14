import useListStore from '@/stores/lists'
import SwiperCore from 'swiper'

interface Props {
  activeSlideIndex: number
}

const SlideProgress = ({ activeSlideIndex }: Props) => {
  const { listOrder } = useListStore()

  console.log(activeSlideIndex <= 2)

  return (
    <div className="flex gap-2">
      {listOrder.map((list, index) => (
        <div
          key={list}
          className={`${
            activeSlideIndex <= index && index < activeSlideIndex + 3
              ? 'bg-primary'
              : 'bg-gray-400'
          } w-[6px] h-[6px] rounded-full`}
        ></div>
      ))}
    </div>
  )
}

export default SlideProgress
