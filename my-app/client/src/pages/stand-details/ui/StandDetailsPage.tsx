import { useMemo } from 'react'
import { Header } from '@/widgets/header/ui/Header'
import { Footer } from '@/widgets/footer/ui/Footer'
import { useGetStandBySlugQuery } from '@/entities/stand/api/standApi'
import { StandGallery } from '@/entities/stand/ui/StandGallery'
import { RequestForm } from '@/features/request-form/ui/RequestForm'
import { useParams } from 'react-router'
import { Loader } from '@/shared/ui/Loader'


export const StandDetailsPage = () => {
  const { slug = '' } = useParams()
  const { data: stand, isLoading, isError } = useGetStandBySlugQuery(slug)

  const mapSrc = useMemo(() => {
    if (!stand) return ''
    return `https://www.google.com/maps?q=${stand.lat},${stand.lng}&z=16&output=embed`
  }, [stand])

  return (
    <div className="page">
      <Header />

      <main className="pageMain">
        <div className="container">
          {isLoading && <Loader />}

          {isError && <div>Точка не найдена.</div>}

          {stand && (
            <div className="stack24">
              <h1 className="sectionTitle">{stand.title}</h1>

              <div className="grid2">
                <StandGallery images={stand.images} alt={stand.title} />

                <div className="stack16">
                  <div className="card stack16">
                    <div><strong>ТЦ:</strong> {stand.mallName}</div>
                    <div><strong>Адрес:</strong> {stand.address}</div>
                    <div><strong>Город:</strong> {stand.city}</div>
                    <p>{stand.description}</p>
                  </div>

                  <div className="card">
                    <iframe
                      title="map"
                      src={mapSrc}
                      width="100%"
                      height="320"
                      style={{ border: 0, borderRadius: '12px' }}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 style={{ marginBottom: 16 }}>Оставить заявку</h2>
                <RequestForm standId={stand.id} />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}