import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/lib/useAuth'

const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(6),
})

const registerSchema = z.object({
  name: z.string().min(1),
  surname: z.string().min(1),
  email: z.string().email(),
  dob: z.string().min(1),
  sex: z.string().min(1),
  password: z.string().min(6),
})

type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

type Props = {
  open: boolean
  onClose: () => void
}

const AuthModal = ({ open, onClose }: Props) => {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const { login, register } = useAuth()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm | RegisterForm>({
    resolver: zodResolver(mode === 'login' ? loginSchema : registerSchema),
  })


  const onSubmit = async (values: LoginForm | RegisterForm) => {
    if (mode === 'login') {
      try {
        await login({ user_identifier: values.email, password: values.password })
        onClose()
      } catch (err) {
        console.log(err)
      }
    } else {
      await register(values as RegisterForm)
    }
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-4 rounded w-80" role="dialog" aria-modal="true">
        <h2 className="text-lg font-semibold mb-2">
          {mode === 'login' ? 'Login' : 'Register'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {mode === 'register' && (
            <>
              <input
                {...registerField('name')}
                className="input-primary w-full"
                placeholder="Name"
                aria-invalid={mode === 'register' && 'name' in errors}
              />
              <input
                {...registerField('surname')}
                className="input-primary w-full"
                placeholder="Surname"
                aria-invalid={mode === 'register' && 'surname' in errors}
              />
              <input
                {...registerField('dob')}
                className="input-primary w-full"
                placeholder="Date of birth"
                aria-invalid={mode === 'register' && 'dob' in errors}
              />
              <input
                {...registerField('sex')}
                className="input-primary w-full"
                placeholder="Sex"
                aria-invalid={mode === 'register' && 'sex' in errors}
              />
            </>
          )}
          <input
            {...registerField('email')}
            className="input-primary w-full"
            placeholder="Email"
            aria-invalid={!!errors.email}
          />
          <input
            type="password"
            {...registerField('password')}
            className="input-primary w-full"
            placeholder="Password"
            aria-invalid={!!errors.password}
          />
          <button
            type="submit"
            className="btn-primary w-full"
            onClick={() => handleSubmit(onSubmit)()}
          >
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        <button
          className="text-primary mt-2 text-sm hover:underline"
          onClick={() =>
            setMode((m) => (m === 'login' ? 'register' : 'login'))
          }
        >
          {mode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
        <button
          aria-label="Close"
          className="absolute top-2 right-2 text-xl leading-none"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default AuthModal

