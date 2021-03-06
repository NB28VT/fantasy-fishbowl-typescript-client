import { AuthContext } from 'App'
import { AllConcertsPage, UpcomingConcertsPage } from 'components/concerts/concertsPage'
import { LeaderboardPage } from 'components/leaderboardPage'
import backgroundImage from 'images/papyrus-dark.png'
import React from 'react'
import { BrowserRouter, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom'
import { HorizontalStack, Style, StyleMap, VerticalStack } from 'utils/styles'

import {
    faCalendarAlt, faHome, faListOl, faSignOutAlt, IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ConcertPage } from './concerts/concertPage'
import { DashboardPage } from './dashboardPage'

interface NavIconProps {
    icon: IconDefinition
    onClick?(): void
}

function NavIcon(props: NavIconProps): JSX.Element {
    const style: Style = {
        alignItems: 'center',
        fontSize: 15,
        flexGrow: 1,
    }

    const iconStyle = {
        fontSize: 35,
    }

    return (
        <VerticalStack style={style} onClick={props.onClick}>
            <FontAwesomeIcon icon={props.icon} style={iconStyle}/>
        </VerticalStack>
    )
}

function LogoutButton(): JSX.Element {
    return (
        <AuthContext.Consumer>
            {({onLogout}) => (
                <NavIcon icon={faSignOutAlt} onClick={onLogout}/>
            )}
        </AuthContext.Consumer>
    )
}

/**
 * This is a mild hack to get withRouter working with TypeScript
 * TODO: take a close look at best practices here
 * https://trello.com/c/sm8jTYed/19-revisit-typing-when-using-react-router
 * https://stackoverflow.com/questions/49342390/typescript-how-to-add-type-check-for-history-object-in-react
 */
interface NavBarProps extends RouteComponentProps<any> {}

class NavFooter extends React.Component<NavBarProps> {
    render(): JSX.Element {
        const styles: StyleMap = {
            container: {
                position: 'fixed',
                left: 0,
                bottom: 0,
                height:  60,
                width: '100%',
                backgroundColor: '#63067A',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 10,
            },
        }

        const goToLeaderboard = (): void => {
            this.props.history.push('/leaderboard')
        }

        const goToUpcomingConcerts = (): void => {
            this.props.history.push('/concerts/upcoming')
        }

        return (
            <HorizontalStack style={styles.container}>
                <NavIcon icon={faHome} onClick={goToLeaderboard}/>
                <NavIcon icon={faListOl} onClick={goToLeaderboard}/>
                <NavIcon icon={faCalendarAlt} onClick={goToUpcomingConcerts}/>
                <LogoutButton/>
            </HorizontalStack>
        )
    }
}

const NavFooterWithRouter = withRouter(NavFooter)

class AppContent extends React.Component<{}> {
    render(): JSX.Element {
        const styles: StyleMap = {
            container: {
                background: `url(${backgroundImage})`,
                color: '#F5ED13',
                height: '100%',
            },
            content: {
                overflow: 'auto',
                margin: '0px 10px',
                paddingBottom: 60,
            },
        }

        return (
            <div style={styles.container}>
                <div style={styles.overlay}>
                    <VerticalStack style={styles.content}>
                        <Switch>
                            <Route exact path={'/'} component={DashboardPage}/>
                            <Route exact path="/leaderboard" component={LeaderboardPage}/>
                            <Route exact path="/concerts" component={AllConcertsPage}/>
                            <Route exact path="/concerts/upcoming" component={UpcomingConcertsPage}/>
                            <Route exact path="/concerts/:id" component={ConcertPage}/>
                        </Switch>
                    </VerticalStack>
                    <NavFooterWithRouter/>
                </div>
            </div>
        )
    }
}

export function AuthenticatedApp(): JSX.Element {
    return (
        <BrowserRouter>
            <AppContent/>
        </BrowserRouter>
    )
}
