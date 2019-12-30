import React from 'react';
import { APIConcertFetcher, Concert, ConcertListEndpoint } from '../../services/APIConcertFetcher';
import { MenuHeader, ConcertThumbnail } from '../shared';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

class ConcertsModel {
    @observable isLoading: boolean
    @observable concertList: Concert[]
    private concertFetcher: APIConcertFetcher


    constructor() {
        this.isLoading = true
        this.concertFetcher = new APIConcertFetcher()
        this.concertList = []
    }

    loadConcerts = async(concertsUrl: ConcertListEndpoint): Promise<void> => {
        this.concertList = await this.concertFetcher.fetchConcerts(concertsUrl)
        this.isLoading = false
    }
}


interface BaseConcertsPageProps extends RouteComponentProps<any> {}

export abstract class BaseConcertsPage extends React.Component<BaseConcertsPageProps> {
    private concertsModel: ConcertsModel
    abstract concertsURL: ConcertListEndpoint

    constructor(props: BaseConcertsPageProps) {
        super(props)

        this.concertsModel = new ConcertsModel()
    }

    async componentDidMount() {
        this.concertsModel.loadConcerts(this.concertsURL)
    }

    goToConcert = (concertID: number): void => {
        this.props.history.push(`/concerts/${concertID}`)
    }

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
                <MenuHeader title="Concerts"/>
                {this.maybeConcertButtons()}
            </div>
        )
    }
}

@observer
export class AllConcertsPage extends BaseConcertsPage {
    concertsURL = ConcertListEndpoint.allConcerts
}

@observer
export class UpcomingConcertsPage extends BaseConcertsPage {
    concertsURL = ConcertListEndpoint.upcomingConcerts
}