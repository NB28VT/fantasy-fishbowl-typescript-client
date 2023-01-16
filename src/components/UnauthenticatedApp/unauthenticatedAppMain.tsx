import 'react-toastify/dist/ReactToastify.min.css'

import React from 'react'
import { BrowserRouter, Route, RouteComponentProps, withRouter } from 'react-router-dom'
import { LoginPage } from './loginPage'
import { DemoApp } from './Demo/demoApp'

interface UnauthenticatedAppProps extends RouteComponentProps<any> {}

class UnauthenticatedAppContent extends React.Component<UnauthenticatedAppProps> {
    render(): JSX.Element {
        return (
            <div>
                <Route exact path={'/'} component={LoginPage}/>
                <Route path={'/demo'} component={DemoApp}/>
            </div>
        )
    }
}

const UnauthenticatedAppContentWithRouter = withRouter(UnauthenticatedAppContent)

export function UnauthenticatedApp(): JSX.Element {
    return (
        <BrowserRouter>
            <UnauthenticatedAppContentWithRouter/>
        </BrowserRouter>
    )
}
