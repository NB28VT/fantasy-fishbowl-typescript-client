import 'react-toastify/dist/ReactToastify.min.css'

import React from 'react'
import { BrowserRouter, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom'
import { LoginPage } from './loginPage'
import DemoStartPage from './demoStartPage'

interface UnauthenticatedAppProps extends RouteComponentProps<any> {}


class UnauthenticatedAppContent extends React.Component<UnauthenticatedAppProps> {
    render(): JSX.Element {
        return (
            <Switch>
                <Route exact path={'/'} component={LoginPage}/>
                <Route exact path={'/demo/start'} component={DemoStartPage}/>
            </Switch>
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
