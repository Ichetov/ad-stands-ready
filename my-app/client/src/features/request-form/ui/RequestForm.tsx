import { useState } from 'react'
import { useCreateRequestMutation } from '@/entities/request/api/requestApi'
import styles from './RequestForm.module.css'

type Props = {
  standId?: number
}

export const RequestForm = ({ standId }: Props) => {
  const [clientName, setClientName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [successText, setSuccessText] = useState('')
  const [errorText, setErrorText] = useState('')

  const [createRequest, { isLoading }] = useCreateRequestMutation()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setSuccessText('')
    setErrorText('')

    try {
      await createRequest({
        standId,
        clientName,
        phone,
        email,
        message
      }).unwrap()

      setClientName('')
      setPhone('')
      setEmail('')
      setMessage('')
      setSuccessText('Заявка отправлена')
    } catch {
      setErrorText('Не удалось отправить заявку')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className="grid2">
        <div className="formRow">
          <label>Имя</label>
          <input
            className="input"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>

        <div className="formRow">
          <label>Телефон</label>
          <input
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="grid2">
        <div className="formRow">
          <label>Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="formRow">
        <label>Сообщение</label>
        <textarea
          className="textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {successText && <div className={styles.success}>{successText}</div>}
      {errorText && <div className={styles.error}>{errorText}</div>}

      <button className="button" type="submit" disabled={isLoading}>
        {isLoading ? 'Отправка...' : 'Отправить'}
      </button>
    </form>
  )
}