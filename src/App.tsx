import './App.css'

import { AuthenticatedApp } from 'components/authenticatedAppMain'
import { UnauthenticatedApp } from 'components/UnauthenticatedApp/unauthenticatedAppMain'
import React from 'react'
import Cookies from 'universal-cookie'
import { Style, StyleMap } from 'utils/styles'

// Need default values for callback function, per official docs
// https://reactjs.org/docs/context.html#updating-context-from-a-nested-component
export const AuthContext = React.createContext({
  token: '',
  authenticated: false,
  onLogin: (loginToken: string): void => {},
  onLogout: (): void => {},
})

export interface AuthContextInterface {
  token: string
  authenticated: boolean
  onLogin(loginToken: string): void
  onLogout(): void
}

// These are the same for now, might change in the future
type FantasyFishbowlState = AuthContextInterface

class FantasyFishbowl extends React.Component<{}, FantasyFishbowlState> {
  private cookies: Cookies

  constructor(props: {}) {
    super(props)

    // Check if the user is already authenticated
    this.cookies = new Cookies()
    const maybeToken = this.cookies.get('token')

    this.state = {
      token: maybeToken,
      authenticated: (maybeToken !== undefined),
      onLogin: this.onLogin,
      onLogout: this.onLogout,
    }
  }

  // Set login cookie and remove on logout path is set to '/' so it's accessbile on every page.
  // https://www.npmjs.com/package/universal-cookie
  onLogin = (loginToken: string): void => {
    this.cookies.set('token', loginToken, {path: '/'})

    this.setState({
      token: loginToken,
      authenticated: true,
    })
  }

  onLogout = (): void => {
    this.cookies.remove('token', {path: '/'})

    this.setState({
      token: '',
      authenticated: false,
    })
  }

  render(): JSX.Element {
    const AppVersion = this.state.authenticated ? <AuthenticatedApp/> : <UnauthenticatedApp/>

    return <AuthContext.Provider value={this.state}>{AppVersion}</AuthContext.Provider>
  }
}

const App: React.FC = () => {
  // Type style map
  const globalStyle: Style = {
    fontFamily: 'Oswald, sans-serif',
  }

  return (
    <div style={globalStyle}>
      <FantasyFishbowl/>
    </div>
  )
}

export default App
