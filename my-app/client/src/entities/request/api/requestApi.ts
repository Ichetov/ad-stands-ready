import { baseApi } from '@/shared/api/baseApi'

export type RequestPayload = {
  standId?: number
  clientName: string
  phone: string
  email: string
  message?: string
}

export const requestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRequest: builder.mutation<{ success: true }, RequestPayload>({
      query: (body) => ({
        url: '/requests',
        method: 'POST',
        body
      })
    })
  })
})

export const { useCreateRequestMutation } = requestApi