interface LoginUserResponse {
    token: string
}

export class AuthClient {
    loginUser = async (email: string, password: string): Promise<LoginUserResponse> => {
        const encodedEmail = encodeURIComponent(email)
        const encodedPassword = encodeURIComponent(password)

        const authUrl = `/authenticate?email=${encodedEmail}&password=${encodedPassword}`
        const result = await fetch(authUrl, {method: 'POST', headers: {'Content-Type': 'application/json'}})

        if (result.status === 401) {
            // TODO: Handle invalid error with toast message or something
            // https://trello.com/c/7AVyO03f/10-handle-error-responses-alert
            throw new Error('Bad auth')
        }

        return result.json()
    }
}
