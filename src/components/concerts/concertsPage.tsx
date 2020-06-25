import { observer } from 'mobx-react'
import React from 'react'
import { RouteComponentProps } from 'react-router'

import { ConcertListEndpoint } from '../../services/APIConcertFetcher'
import { ConcertThumbnail, MenuHeader } from '../shared'
import { ConcertsModel } from './models'

interface BaseConcertsPageProps extends RouteComponentProps<any> {}

export abstract class BaseConcertsPage extends React.Component<BaseConcertsPageProps> {
    abstract concertsURL: ConcertListEndpoint
    menuTitle: string = 'Shows'
    private concertsModel: ConcertsModel

    constructor(props: BaseConcertsPageProps) {
        super(props)

        this.concertsModel = new ConcertsModel()
    }

    async componentDidMount(): Promise<void> {
        this.concertsModel.loadConcerts(this.concertsURL)
    }

    goToConcert = (concertID: number): void => {
        this.props.history.push(`/concerts/${concertID}`)
    }

    // TODO: refactor this out into a component, implment Maybe base type with isVisible prop
    // https://trello.com/c/rfLA6ae8/31-concerts-page-refactor
    // -maybeconcertbuttons-into-component-instead-of-separate-function-call
    maybeConcertButtons = (): JSX.Element => {
        const concertButtons = this.concertsModel.concertList.map(concert => {
            return <ConcertThumbnail concert={concert} onClick={this.goToConcert}/>
        })

        if (concertButtons.length) {
            return <div>{concertButtons}</div>
        }

        return <h1>No Concerts</h1>
    }

    render(): JSX.Element {
        if (this.concertsModel.isLoading) {
            // TODO: Loading indicator
            // https://trello.com/c/IiDDdi9U/29-loading-indicator
            return <div>Loading</div>
        }

        return (
            <div>
                <MenuHeader title={this.menuTitle}/>
                {this.maybeConcertButtons()}
            </div>
        )
    }
}

@observer
export class AllConcertsPage extends BaseConcertsPage {
    concertsURL: ConcertListEndpoint = ConcertListEndpoint.allConcerts
}

@observer
export class UpcomingConcertsPage extends BaseConcertsPage {
    concertsURL: ConcertListEndpoint = ConcertListEndpoint.upcomingConcerts
    menuTitle: string = 'Upcoming Shows'
}
