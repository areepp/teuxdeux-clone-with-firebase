/* eslint-disable no-undef */
import { login } from '@/lib/auth'
import Login from '@/pages/login'
import { act, fireEvent, render } from '@testing-library/react'
import { useRouter } from 'next/router'
import React from 'react'

jest.mock('@/lib/firebaseAdmin', () => jest.fn())

jest.mock('@/lib/auth', () => ({
  login: jest.fn(() => {
    return Promise.resolve('success')
  }),
  foo: jest.fn(() => Promise.resolve('success')),
}))

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('Login', () => {
  let expectedEmail, expectedPassword

  beforeEach(() => {
    expectedEmail = 'test123@gmail.com'
    expectedPassword = 'test123'
  })

  it('should redirect on sign in', async () => {
    const mockRouter = { push: jest.fn() }
    useRouter.mockReturnValue(mockRouter)

    const { getByText, container } = render(<Login />)

    const email = container.querySelector('#email-input')
    const password = container.querySelector('#password-input')
    const loginButton = getByText('Log in')

    await act(async () => {
      fireEvent.change(email, { target: { value: expectedEmail } })
      fireEvent.change(password, { target: { value: expectedPassword } })
      fireEvent.click(loginButton)
    })

    expect(login).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalledWith('/')
  })
})
