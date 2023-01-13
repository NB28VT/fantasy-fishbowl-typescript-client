import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import React from 'react'
import DemoStartPage from "./demoStartPage";

interface DemoAppProps extends RouteComponentProps<any> {}

class DemoAppContent extends React.Component<DemoAppProps> {
  render(): JSX.Element {
      return (
          <Switch>
              <Route exact path={'/demo/start'} component={DemoStartPage}/>
          </Switch>
      )
  }
}

const DemoAppContentWithRouter = withRouter(DemoAppContent)

export function DemoApp(): JSX.Element {
    return (
          <DemoAppContentWithRouter/>
    )
}
