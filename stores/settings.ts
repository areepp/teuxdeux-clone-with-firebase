import create from 'zustand'
import { persist } from 'zustand/middleware'

export interface SettingStore {
  slidesPerView: number
  slidesPerViewBigScreen: number
  setSlidesPerViewBigScreen: (num: number) => void,
  setSlidesPerView: (num: number) => void
}

const useSettingStore = create(persist<SettingStore>((set: any) => ({
  slidesPerView: 3,
  slidesPerViewBigScreen: 3,
  setSlidesPerViewBigScreen: (num: number) => set(() => ({ slidesPerViewBigScreen: num })),
  setSlidesPerView: (num: number) => set(() => ({ slidesPerView: num })),
}), {
  name: 'slidesPerView-storage',
}))

export default useSettingStore
