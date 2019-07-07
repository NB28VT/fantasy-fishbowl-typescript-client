import React from 'react';
import './App.css';
import Cookies from 'universal-cookie';
import { AuthenticatedApp } from 'components/authenticatedAppMain';
import { UnauthenticatedApp } from 'components/UnauthenticatedApp/unauthenticatedAppMain';

// Need default values for callback function, per official docs
// https://reactjs.org/docs/context.html#updating-context-from-a-nested-component
export const AuthContext = React.createContext({
  token: '',
  authenticated: false,
  onLogin: (loginToken: string): void => {}
})

export interface AuthContextInterface {
  token: string
  authenticated: boolean
  onLogin(loginToken: string): void
}

type FantasyFishbowlState = AuthContextInterface

class FantasyFishbowl extends React.Component<{}, FantasyFishbowlState> {
  private cookies: Cookies
  constructor(props: {}) {
    super(props)

    // Check if the user is already authenticated
    this.cookies = new Cookies();
    const maybeToken = this.cookies.get("token")

    this.state = {
      token: maybeToken,
      authenticated: (maybeToken !== undefined),
      onLogin: this.onLogin,
    }
  }

  onLogin = (loginToken: string): void => {
    // Set login cookie; path is set to "/" so it's accessbile on every page
    // https://www.npmjs.com/package/universal-cookie
    this.cookies.set("token", loginToken, {path: "/"})

    this.setState({
      token: loginToken,
      authenticated: true
    })    
  }

  render(): JSX.Element {
    const AppVersion = this.state.authenticated ? <AuthenticatedApp/> : <UnauthenticatedApp/>

    return <AuthContext.Provider value={this.state}>{AppVersion}</AuthContext.Provider>
  }
}

const App: React.FC = () => {
  return <FantasyFishbowl/>
}

export default App;
