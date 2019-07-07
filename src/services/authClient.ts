export class AuthClient {
    // TODO: Type response
    loginUser = (email: string, password: string): any => {
        const encodedEmail = encodeURIComponent(email)
        const encodedPassword = encodeURIComponent(password)
    
        const authUrl = `/authenticate?email=${encodedEmail}&password=${encodedPassword}`
        
        // Wrap into some request logic?
        fetch(authUrl, {
            method: "POST",
            headers: {"Content-Type": "application/json"}
          })
          .then(result => {
            if (result.status === 401) {
                // TODO: Handle invalid error with toast message or something
                // https://trello.com/c/7AVyO03f/10-handle-error-responses-alert
                throw new Error("Bad auth")
            }
              return result.json()
          })
          .then(responseData => {
            return responseData.token
          })
    }
}