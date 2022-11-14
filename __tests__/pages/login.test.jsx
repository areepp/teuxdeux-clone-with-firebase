import React from 'react'
import { render } from '@testing-library/react'

import Login from '@/pages/login'

jest.mock('@/lib/firebaseAdmin', () => jest.fn())
jest.mock('@/lib/auth', () => jest.fn())

describe('Login', () => {
  // let expectedEmail, expectedPassword, expectedRouterPush

  // beforeEach(() => {
  //   expectedRouterPush = jest.fn()
  //   useRouter.mockImplementation({ push: expectedRouterPush })

  //   expectedEmail = 'test123@gmail.com'
  //   expectedPassword = 'test123'
  // })

  // it('should redirect on sign in', async () => {
  //   const { getByText } = render(<Login />)
  //   const email = getByText('email')
  //   const password = getByText('password')
  //   const signInButton = getByText('Sign In')

  //   fireEvent.change(email, { target: { value: expectedEmail } })
  //   fireEvent.change(password, { target: { value: expectedPassword } })
  //   fireEvent.click(signInButton)

  //   expect(login).toHaveBeenCalled()
  //   expect(expectedRouterPush).toHaveBeenCalledWith('/')
  // })

  it('test', () => {
    const { container } = render(<Login />)
    expect(container).toBeInTheDocument()
  })
})
