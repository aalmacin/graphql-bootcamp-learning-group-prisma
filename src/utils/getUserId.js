import jwt from 'jsonwebtoken'

export function getUserId({request}, requireAuth = true) {
    const header = request.headers.authorization

    if(header) {
        const token = header.split(' ')[1]
        const decoded = jwt.verify(token, 'whatasecret')

        return decoded.userId
    }
    if(requireAuth) {
        throw new Error('Authentication required')
    }
    return null
}