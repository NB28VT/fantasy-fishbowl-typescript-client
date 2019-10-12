const JSONHeaders = {"Content-Type": "application/json"}

export const APIGet = async<T>(url: string): Promise<T> => {
    const args = {method: "GET", headers: JSONHeaders}
    return await APIRequest<T>(new Request(url, args))
}

export const APIPost = async<T, U>(url: string, body: U): Promise<T> => {
    const args = {method: "POST", headers: JSONHeaders, body: JSON.stringify(body)}
    return await APIRequest<T>(new Request(url, args))
}

export const APIPut = async<T, U>(url: string, body: U): Promise<T> => {
    const args = {method: "PUT", headers: JSONHeaders, body: JSON.stringify(body)}
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
