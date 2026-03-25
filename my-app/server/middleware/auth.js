export const ADMIN_LOGIN = 'admin'
export const ADMIN_PASSWORD = 'admin123'
export const ADMIN_TOKEN = 'super-admin-token'

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.replace('Bearer ', '')

  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  next()
}