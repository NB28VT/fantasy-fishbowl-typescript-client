import { faCalendarAlt, faListOl, faSignOutAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AuthContext } from 'App';
import { UpcomingConcertsPage } from 'components/concerts/upcomingConcertsPage';
import { LeaderboardPage } from 'components/leaderboardPage';
import backgroundImage from 'images/papyrus-dark.png';
import React from 'react';
import { BrowserRouter, Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import { HorizontalStack, Style, StyleMap, VerticalStack } from 'utils/styles';
import { AllConcertsPage } from "./concerts/allConcertsPage";
import { DashboardPage } from "./dashboardPage";
import { ConcertPage } from './concerts/concertPage';

interface NavIconProps {
    icon: IconDefinition
    title: string
    onClick?(): void
}

export function NavIcon(props: NavIconProps): JSX.Element {
    const style: Style = {
        alignItems: 'center',
        fontSize: 10,
        flexGrow: 1,
    }

    const iconStyle = {
        fontSize: 30,
    }

    return (
        <VerticalStack style={style} onClick={props.onClick}>
            <FontAwesomeIcon icon={props.icon} style={iconStyle}/>
            {props.title}
        </VerticalStack>
    )
}

function LogoutButton(): JSX.Element {
    return (
        <AuthContext.Consumer>
            {({onLogout}) => (
                <NavIcon icon={faSignOutAlt} title="Log Out" onClick={onLogout}/>
            )}
        </AuthContext.Consumer>
    )
}

// This is a mild hack to get withRouter working with TypeScript
// https://stackoverflow.com/questions/49342390/typescript-how-to-add-type-check-for-history-object-in-react
interface NavBarProps extends RouteComponentProps<any> {}

class NavFooter extends React.Component<NavBarProps> {
    render(): JSX.Element {
        const styles: StyleMap = {
            container: {
                position: 'fixed',
                left: 0,
                bottom: 0,
                height:  50,
                width: '100%',
                backgroundColor: '#636d66',
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
                <NavIcon icon={faListOl} title="Rankings" onClick={goToLeaderboard}/>
                <NavIcon icon={faCalendarAlt} title="Upcoming Shows" onClick={goToUpcomingConcerts}/>
                <LogoutButton/>
            </HorizontalStack>
        )
    }
}

const NavFooterWithRouter = withRouter(NavFooter)
const AllConcertsPageWithRouter = withRouter(AllConcertsPage)
const UpcomingConcertsPageWithRouter = withRouter(UpcomingConcertsPage)

class AppContent extends React.Component<{}> {
    render(): JSX.Element {
        const styles: StyleMap = {
            container: {
                background: `url(${backgroundImage})`,
                position: 'relative',
                color: '#F5ED13',
            },
            overlay: {
                // TODO: this matches the global purple, get this into a constant somewhere
                backgroundColor: 'rgba(203, 13, 250, 0.5)',
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
                            <Route exact path={"/"} component={DashboardPage}/>
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