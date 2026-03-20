import { useState } from 'react'
import { Header } from '@/widgets/header/ui/Header'
import { Footer } from '@/widgets/footer/ui/Footer'
import { StandFilters } from '@/widgets/stand-filters/ui/StandFilters'
import { StandList } from '@/widgets/stand-list/ui/StandList'
import { useGetMallsQuery, useGetStandsQuery } from '@/entities/stand/api/standApi'
import { Loader } from '@/shared/ui/Loader'


export const HomePage = () => {
  const [mall, setMall] = useState('')
  const [search, setSearch] = useState('')

  const { data: malls = [] } = useGetMallsQuery()
  const { data: stands = [], isLoading } = useGetStandsQuery({
    mall: mall || undefined,
    search: search || undefined
  })

  return (
    <div className="page">
      <Header />

      <main className="pageMain">
        <div className="container">
          <div className="stack24">
            <h1 className="sectionTitle">Рекламные точки</h1>

            <StandFilters
              mall={mall}
              search={search}
              malls={malls.map((item) => item.mallName)}
              onMallChange={setMall}
              onSearchChange={setSearch}
            />

            {isLoading ? <Loader /> : <StandList stands={stands} />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}