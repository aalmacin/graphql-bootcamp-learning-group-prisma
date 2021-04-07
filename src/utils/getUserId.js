import jwt from 'jsonwebtoken'

export function getUserId({request}) {
    const header = request.headers.authorization

    if(!header) {
        throw new Error('Authentication required')
    }

    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, 'whatasecret')

    return decoded.userId
}