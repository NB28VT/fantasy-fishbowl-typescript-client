import React from 'react'
import { observable} from "mobx";
// Need mobx react
// import { observer} from "mobx-react";

import backgroundImage from 'images/nb-super-fade.jpg'
import { Style, StyleMap } from 'utils/styles';
import { UpcomingConcertsPage } from 'components/concerts/upcomingConcertsPage';
import { ConcertPage } from 'components/concerts/concertPage';
import { LeaderboardPage } from 'components/leaderboardPage';
import { url } from 'inspector';



export enum Pages {
    UpcomingConcerts,
    Concert,
    Leaderboard,
}

// Nav model with observables for pages
class PageModel {
    @observable currentPage: Pages

    constructor(){
        // Dashboard
        this.currentPage = Pages.UpcomingConcerts
    }

    showUpcomingConcerts = (): void => {
        this.currentPage = Pages.UpcomingConcerts
    }

    showLeaderboard = (): void => {
        this.currentPage = Pages.UpcomingConcerts
    }

    showConcert = (concertId: number): void => {
        // Not sure how ID gets passed 
        this.currentPage = Pages.Concert
    }
}

class NavFooter extends React.Component<{model: PageModel}> {
    render(): JSX.Element {
        // TODO: refactor to use vertical 
        const styles: StyleMap = {
            container: {
                position: 'fixed',
                left: 0,
                bottom: 0,
                height: 50,
                width: '100%',
                backgroundColor: '#636d66',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
                
            },
            button: {
                border: '1px solid',
                width: 50,
            }
        }

        const model = this.props.model

        return (
            <div style={styles.container}>
                <div style={styles.button} onClick={model.showLeaderboard}>L</div>
                <div style={styles.button} onClick={model.showUpcomingConcerts}>U</div>
                <div style={styles.button} onClick={model.showUpcomingConcerts}>U</div>
            </div>
        )
    }
}



// Probably can be a func
class Content extends React.Component<{page: Pages}> {
    render(): JSX.Element {
        const style: Style = {
            flex: 1,
            overflow: 'auto',
            margin: '0px 10px'

        }

        return (
            <div style={style}>
                <CurrentPage page={this.props.page}/>
            </div>
        )
    }
}

// Need Mobx react
// @observer
class CurrentPage extends React.Component<{page: Pages}> {
    render(): JSX.Element | undefined {
        switch(this.props.page) {
            case Pages.UpcomingConcerts:
                return <UpcomingConcertsPage/>
            case Pages.Concert:
                // pass params?
                return <ConcertPage/>
            case Pages.Leaderboard:
                return <LeaderboardPage/>
        }
    }
}


export class Main extends React.Component<{}> {
    private pageModel: PageModel

    constructor() {
        super({})
        this.pageModel = new PageModel()
        this.pageModel.currentPage = Pages.UpcomingConcerts
    }

    render(): JSX.Element {
        const style: Style = {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: '#CB0DFA',
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: 'top',
            color: '#F5ED13',
        }
    
        return (
            <div style={style}>
                <Content page={this.pageModel.currentPage}/>
                <NavFooter model={this.pageModel}/>
            </div>
        )
    }
}