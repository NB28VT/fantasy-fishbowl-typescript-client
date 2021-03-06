import 'react-toastify/dist/ReactToastify.min.css'

import { AuthContext } from 'App'
import { SubmitButton } from 'components/concerts/concertPage'
import backgroundImage from 'images/nb-super-fade.jpg'
import vertLogo from 'images/yellow-logo-vertical.png'
import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import React, { ChangeEvent } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { AuthClient } from 'services/authClient'
import { Style, StyleMap, VerticalStack } from 'utils/styles'

function WelcomeLogo(): JSX.Element {
    const styles: StyleMap = {
        container: {
            textAlign: 'center',
            justifyContent: 'center',
            fontSize: 20,
            color: '#F5ED13',
        },
    }

    return (
        <VerticalStack style={styles.container}>
            <img alt="logo" src={vertLogo}/>
            <p>The Setlist Prediction Game</p>
        </VerticalStack>
    )
}

class LoginFormModel {
    @observable email: string
    @observable password: string

    constructor(
        private onLogin: (responseToken: string) => void
    ) {
        this.email = ''
        this.password = ''
    }

    loginUser = async (): Promise<void> => {
        const client = new AuthClient()

        try {
            const loginResponse = await client.loginUser(this.email, this.password)
            this.onLogin(loginResponse.token)
        } catch (error) {
            toast.error('Invalid Login, Please Try Again', {
                hideProgressBar: true,
                closeOnClick: true,
            })
        }
    }

    @action
    updateEmail = (event: ChangeEvent<HTMLInputElement>): void => {
        this.email = event.target.value
    }

    @action
    updatePassword = (event: ChangeEvent<HTMLInputElement>): void => {
        this.password = event.target.value
    }
}

interface LoginFormProps {
    onLogin(loginToken: string): void
}

@observer
class LoginForm extends React.Component<LoginFormProps> {
    model: LoginFormModel

    constructor(props: LoginFormProps) {
        super(props)

        this.model = new LoginFormModel(this.props.onLogin)
    }

    render(): JSX.Element {
        const styles: StyleMap = {
            container: {
                margin: '0px 40px',
                alignItems: 'space-between',
            },
            input: {
                marginBottom: 10,
                borderRadius: 3,
            },
        }

        const model = this.model

        return (
            <VerticalStack style={styles.container}>
                <input style={styles.input} placeholder="Email" value={model.email} onChange={model.updateEmail}/>
                <input
                    type="password"
                    style={styles.input}
                    placeholder="Password"
                    value={model.password}
                    onChange={model.updatePassword}
                />
                <SubmitButton onClick={model.loginUser}/>
                <ToastContainer position="bottom-center"/>
            </VerticalStack>
        )
    }
}

class LoginPage extends React.Component<{}> {
    render(): JSX.Element {
        const style: Style = {
            background: `url(${backgroundImage})`,
            height: '100vh',
            backgroundSize: 'cover',
            justifyContent: 'center',
        }

        return (
            <AuthContext.Consumer>
                {({onLogin}) => (
                    <VerticalStack style={style}>
                        <WelcomeLogo/>
                        <LoginForm onLogin={onLogin}/>
                    </VerticalStack>
                )}
            </AuthContext.Consumer>
        )
    }
}

export class UnauthenticatedApp extends React.Component<{}> {
    render(): JSX.Element {
        return <LoginPage/>
    }
}
