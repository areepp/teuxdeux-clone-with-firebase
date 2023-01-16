import { signup } from '@/lib/auth.service'
import SignUp from '@/pages/signup'
import { act, fireEvent, render, screen } from '@testing-library/react'

jest.mock('@/lib/firebaseAdmin', () => jest.fn())
jest.mock('@/lib/auth.service.ts', () => ({
  signup: jest.fn(),
}))
jest.mock('@/lib/user.service.ts', () => jest.fn())
jest.mock('firebase/app', () => jest.fn())

describe.skip('SignUp Page', () => {
  it('should show success message after succesful signup', async () => {
    render(<SignUp />)

    const emailInput = screen.getByLabelText('email input')
    const passwordInput = screen.getByLabelText('password input')
    const signUpButton = screen.getByRole('button')

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'signup@gmail.com' } })
      fireEvent.change(passwordInput, {
        target: { value: 'pass123' },
      })
      fireEvent.click(signUpButton)
    })

    const succesMessage = screen.getByText('Sign up succesful')
    expect(signup).toBeCalled()
    expect(succesMessage).toBeVisible()
  })
  // eslint-disable-next-line max-len
  it('should show error when trying to signup without providing email and/or password', async () => {
    render(<SignUp />)
    const signUpButton = screen.getByRole('button')

    await act(async () => {
      fireEvent.click(signUpButton)
    })

    expect(screen.getAllByText('This field is required')).toHaveLength(2)
  })
})
