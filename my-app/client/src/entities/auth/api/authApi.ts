import { baseApi } from '@/shared/api/baseApi'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string }, { login: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body
      })
    })
  })
})

export const { useLoginMutation } = authApi