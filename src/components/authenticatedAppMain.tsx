import { faCalendarAlt, faListOl, faSignOutAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConcertPage } from 'components/concerts/concertPage';
import { UpcomingConcertsPage } from 'components/concerts/upcomingConcertsPage';
import { LeaderboardPage } from 'components/leaderboardPage';
import backgroundImage from 'images/papyrus-dark.png';
import { observable } from "mobx";
import { observer } from "mobx-react";
import React from 'react';
import { HorizontalStack, Style, StyleMap, VerticalStack } from 'utils/styles';
import { AuthContext } from 'App';

export enum Pages {
    UpcomingConcerts,
    Concert,
    Leaderboard,
}

export class PageModel {
    @observable currentPage: Pages
    // Blech this should really be handled by the router 
    @observable selectedConcertID: number | null

    constructor(){
        this.selectedConcertID = null
        this.currentPage = Pages.UpcomingConcerts
    }

    showUpcomingConcerts = (): void => {
        this.currentPage = Pages.UpcomingConcerts
    }

    showLeaderboard = (): void => {
        this.currentPage = Pages.Leaderboard
    }

    showConcert = (concertId: number): void => {
        this.selectedConcertID = concertId
        this.currentPage = Pages.Concert
    }
}

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

class NavFooter extends React.Component<{model: PageModel}> {
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

        const model = this.props.model

        return (
            <HorizontalStack style={styles.container}>
                <NavIcon icon={faListOl} title="Rankings" onClick={model.showLeaderboard}/>
                <NavIcon icon={faCalendarAlt} title="Upcoming Shows" onClick={model.showUpcomingConcerts}/>
                <LogoutButton/>
            </HorizontalStack>
        )
    }
}

@observer
class CurrentPage extends React.Component<{model: PageModel}> {
    render(): JSX.Element | undefined {
        const model = this.props.model
        switch(model.currentPage) {
            case Pages.UpcomingConcerts:
                return <UpcomingConcertsPage onSelectConcert={model.showConcert}/>
            case Pages.Concert:
                // This should get fixed if I use React router
                if (model.selectedConcertID) {
                    return <ConcertPage concertID={model.selectedConcertID} onBackToConcertList={model.showUpcomingConcerts}/>
                }
                return <UpcomingConcertsPage onSelectConcert={model.showConcert}/>                
            case Pages.Leaderboard:
                return <LeaderboardPage/>
        }
    }
}

@observer
export class AuthenticatedApp extends React.Component<{}> {
    private pageModel: PageModel

    constructor() {
        super({})
        this.pageModel = new PageModel()
        this.pageModel.currentPage = Pages.UpcomingConcerts
    }

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
                        <CurrentPage model={this.pageModel}/>
                    </VerticalStack>
                    <NavFooter model={this.pageModel}/>
                </div>
            </div>
        )
    }
}