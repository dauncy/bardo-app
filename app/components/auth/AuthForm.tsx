import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import { InitialAuthForm } from './InitialAuthForm'
import { AuthStep } from '@app/types/auth'
import { SignInForm } from './SignInForm'
import { SignUpForm } from './SignUpForm'

const renderForm = (
  step: AuthStep,
  currentEmail: string,
  setAuthStep: Dispatch<SetStateAction<AuthStep>>,
  setCurrentEmail: Dispatch<SetStateAction<string>>,
) => {
  switch (step) {
    case AuthStep.INTIAL:
      return <InitialAuthForm setAuthStep={setAuthStep} setCurrentEmail={setCurrentEmail} />

    case AuthStep.SIGN_IN:
      return <SignInForm currentEmail={currentEmail} setAuthStep={setAuthStep} />

    case AuthStep.SIGN_UP:
      return <SignUpForm currentEmail={currentEmail} setAuthStep={setAuthStep} />
  }
}
export const AuthForm = () => {
  const [authStep, setAuthStep] = useState<AuthStep>(AuthStep.INTIAL)
  const [currentEmail, setCurrentEmail] = useState<string>('')

  return renderForm(authStep, currentEmail, setAuthStep, setCurrentEmail)
}
