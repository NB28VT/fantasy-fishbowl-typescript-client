const JSONHeaders = {'Content-Type': 'application/json', 'Authorization': 'sdsds'}

export const APIGet = async<T>(url: string): Promise<T> => {
    const args = {method: 'GET', headers: JSONHeaders}
    return await APIRequest<T>(new Request(url, args))
}

export const APIPost = async<T, U>(url: string, body: U, auth_token: string): Promise<T> => {
    const AuthenticationHeaders = {'Content-Type': 'application/json', 'Authorization': auth_token}
    const args = {method: 'POST', headers: AuthenticationHeaders, body: JSON.stringify(body)}
    return await APIRequest<T>(new Request(url, args))
}

export const APIPut = async<T, U>(url: string, body: U, auth_token: string): Promise<T> => {
    const AuthenticationHeaders = {'Content-Type': 'application/json', 'Authorization': auth_token}
    const args = {method: 'PUT', headers: AuthenticationHeaders, body: JSON.stringify(body)}
    return await APIRequest<T>(new Request(url, args))
}

const APIRequest = <T>(request: RequestInfo): Promise<T> => {
    return new Promise((resolve, reject) => {
        let resp: Response
        fetch(request)
            .then(response => {
                resp = response
                return response.json()
            })
            .then(body => {
                return resp.ok ? resolve(body) : reject(resp)
            }
        ).catch(error => reject(error))
    })
}
