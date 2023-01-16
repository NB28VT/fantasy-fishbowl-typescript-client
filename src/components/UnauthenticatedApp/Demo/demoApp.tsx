import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import React from 'react'
import DemoStartPage from "./demoStartPage";
import { StyleMap, VerticalStack } from "utils/styles";
import backgroundImage from 'images/papyrus-dark.png'
import LatestConcertPredictionPage from "./latestConcertPredictionPage";

interface DemoAppProps extends RouteComponentProps<any> {}

class DemoAppContent extends React.Component<DemoAppProps> {
  render(): JSX.Element {

    const styles: StyleMap = {
      container: {
          background: `url(${backgroundImage})`,
          color: '#F5ED13',
          height: '100vh',
      },
      content: {
          overflow: 'auto',
          margin: '0px 10px',
          paddingBottom: 60,
          paddingTop: 60,
      },
  }
    return (
      <div style={styles.container}>
        <VerticalStack style={styles.content}>
          <Switch>
              <Route path={'/demo/start'} component={DemoStartPage}/>
              <Route path={'/demo/prediction'} component={LatestConcertPredictionPage}/>
          </Switch>
        </VerticalStack>
      </div>
    )
  }
}

const DemoAppContentWithRouter = withRouter(DemoAppContent)

export function DemoApp(): JSX.Element {
    return (
        <DemoAppContentWithRouter/>
    )
}
