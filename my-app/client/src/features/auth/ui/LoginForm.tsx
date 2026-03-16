import {useState } from 'react'
import { useLoginMutation } from '@/entities/auth/api/authApi'
import { setToken } from '@/shared/lib/auth'
import styles from './LoginForm.module.css'
import { useNavigate } from 'react-router'

export const LoginForm = () => {
  const navigate = useNavigate()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [errorText, setErrorText] = useState('')
  const [loginRequest, { isLoading }] = useLoginMutation()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setErrorText('')

    try {
      const result = await loginRequest({ login, password }).unwrap()
      setToken(result.token)
      navigate('/admin/stands')
    } catch {
      setErrorText('Неверный логин или пароль')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className="formRow">
        <label>Логин</label>
        <input
          className="input"
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
      </div>

      <div className="formRow">
        <label>Пароль</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {errorText && <div className={styles.error}>{errorText}</div>}

      <button className="button" type="submit" disabled={isLoading}>
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
    </form>
  )
}