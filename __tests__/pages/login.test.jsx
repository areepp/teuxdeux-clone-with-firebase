import { login } from '@/lib/auth.service'
import Login from '@/pages/login'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { useRouter } from 'next/router'
import React from 'react'
import util from 'util'

jest.mock('@/lib/firebaseAdmin', () => jest.fn())

jest.mock('@/lib/auth.service', () => ({
  login: jest.fn(),
}))

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('Login', () => {
  const correctData = { email: '', password: '' }
  const wrongData = { email: '', password: '' }

  beforeEach(() => {
    correctData.email = 'test123@gmail.com'
    correctData.password = 'test123'
    wrongData.email = 'wrong@gmail.com'
    wrongData.password = 'wrong123'

    const mockedLogin = jest.fn((data) => {
      if (util.isDeepStrictEqual(data, correctData)) {
        return Promise.resolve('success')
      }
      return Promise.reject(new Error('fail'))
    })
    login.mockImplementation(mockedLogin)
  })

  it('should redirect on sign in', async () => {
    const mockRouter = { push: jest.fn() }
    useRouter.mockReturnValue(mockRouter)

    render(<Login />)
    const emailInput = screen.getByLabelText('email input')
    const passwordInput = screen.getByLabelText('password input')
    const loginButton = screen.getByRole('button', {
      name: /^log in/i,
    })

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: correctData.email } })
      fireEvent.change(passwordInput, {
        target: { value: correctData.password },
      })
      fireEvent.click(loginButton)
    })

    expect(login).toHaveBeenCalledWith(correctData)
    expect(mockRouter.push).toHaveBeenCalledWith('/')
  })

  it('should show error on failed sign in', async () => {
    const mockRouter = { push: jest.fn() }
    useRouter.mockReturnValue(mockRouter)

    render(<Login />)
    const emailInput = screen.getByLabelText('email input')
    const passwordInput = screen.getByLabelText('password input')
    const loginButton = screen.getByRole('button', {
      name: /^log in/i,
    })

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: wrongData.email } })
      fireEvent.change(passwordInput, {
        target: { value: wrongData.password },
      })
      fireEvent.click(loginButton)
    })

    const errorMessage = screen.getByText('Incorrect email and/or password')

    expect(login).toHaveBeenCalledWith(wrongData)
    expect(errorMessage).toBeVisible()
  })

  it('should show error when trying to submit without entering input value', async () => {
    render(<Login />)
    const loginButton = screen.getByRole('button', {
      name: /^log in/i,
    })

    await act(async () => {
      fireEvent.click(loginButton)
    })

    expect(screen.getAllByText('This field is required')).toHaveLength(2)
  })
})
