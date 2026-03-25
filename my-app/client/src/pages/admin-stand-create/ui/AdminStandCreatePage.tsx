
import { StandForm } from '@/features/stand-form/ui/StandForm'
import { useCreateStandMutation, useUploadImagesMutation } from '@/entities/stand/api/standApi'
import { UPLOADS_URL } from '@/shared/config/env'
import { useNavigate } from 'react-router'

export const AdminStandCreatePage = () => {
  const navigate = useNavigate()
  const [createStand] = useCreateStandMutation()
  const [uploadImages] = useUploadImagesMutation()

  const handleUpload = async (files: FileList) => {
    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append('images', file))


    console.log()
  const result = await uploadImages(formData).unwrap()
      console.log()
return result.urls.map((url) => `${UPLOADS_URL}${url}`)
  }

  const handleSubmit = async (values: {
    slug: string
    title: string
    mallName: string
    address: string
    city: string
    description: string
    lat: number
    lng: number
    isActive: boolean
    images: string[]
  }) => {
    await createStand(values).unwrap()
    navigate('/admin/stands')
  }

  return (
    <div className="stack24">
      <h1 className="sectionTitle">Создать точку</h1>
      <div className="card">
        <StandForm
          submitText="Создать"
          onSubmit={handleSubmit}
          onUpload={handleUpload}
        />
      </div>
    </div>
  )
}