import useSettingStore from '@/stores/settings'
import clsx from 'clsx'

const Setting = () => {
  const settingStore = useSettingStore()
  const slidesPerViewOptions = [3, 5, 7]

  const changeSlidesPerView = (option: number) => {
    settingStore.setSlidesPerViewBigScreen(option)
    settingStore.setSlidesPerView(option)
  }

  return (
    <section className="w-full justify-center items-center py-2 hidden md:flex">
      <div className="rounded overflow-hidden">
        {slidesPerViewOptions.map((option) => (
          <button
            key={option}
            className={clsx(
              'py-1 px-2 text-sm bg-red-100 hover:bg-red-200 transition-all duration-300',
              settingStore.slidesPerView === option && 'bg-primary text-white',
            )}
            type="button"
            onClick={() => changeSlidesPerView(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  )
}

export default Setting
