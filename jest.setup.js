import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import { setConfig, config } from 'next/config'

setConfig({
  ...config,
  publicRuntimeConfig: {
    BASE_PATH: '/',
    SOME_KEY: 'your_value',
  },
  serverRuntimeConfig: {
    YOUR_KEY: 'your_value',
  },
})
