import { useDeleteStandMutation, useGetStandsQuery } from '@/entities/stand/api/standApi'
import { Link } from 'react-router'

export const AdminStandsPage = () => {
  const { data: stands = [], isLoading } = useGetStandsQuery({ admin: true })
  const [deleteStand] = useDeleteStandMutation()

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Удалить точку?')
    if (!confirmed) return

    await deleteStand(String(id)).unwrap()
  }

  return (
    <div className="stack24">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <h1 className="sectionTitle">Точки</h1>
        <Link className="button" to="/admin/stands/new">
          Добавить точку
        </Link>
      </div>

      {isLoading && <div>Загрузка...</div>}

      {!isLoading && (
        <div className="card">
          <div className="stack16">
            {stands.map((stand) => (
              <div
                key={stand.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: 12,
                  alignItems: 'center',
                  borderBottom: '1px solid #eee',
                  paddingBottom: 12
                }}
              >
                <div>
                  <div><strong>{stand.title}</strong></div>
                  <div>{stand.mallName}</div>
                  <div>{stand.isActive ? 'Активна' : 'Скрыта'}</div>
                </div>

                <Link className="buttonSecondary" to={`/admin/stands/${stand.id}/edit`}>
                  Редактировать
                </Link>

                <button className="buttonSecondary" type="button" onClick={() => handleDelete(stand.id)}>
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}