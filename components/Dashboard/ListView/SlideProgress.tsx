import useListStore from '@/stores/lists'
import useSettingStore from '@/stores/settings'

interface Props {
  activeSlideIndex: number
}

const SlideProgress = ({ activeSlideIndex }: Props) => {
  const { listOrder } = useListStore()
  const settingStore = useSettingStore()

  if (listOrder.length <= settingStore.slidesPerView) {
    return null
  }

  return (
    <div className="flex gap-2">
      {listOrder.map((list, index) => (
        <div
          key={list}
          className={`${
            activeSlideIndex <= index &&
            index < activeSlideIndex + settingStore.slidesPerView
              ? 'bg-primary'
              : 'bg-gray-400'
          } w-[6px] h-[6px] rounded-full`}
        />
      ))}
    </div>
  )
}

export default SlideProgress
