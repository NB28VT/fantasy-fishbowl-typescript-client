import React from 'react';
import { APIConcertFetcher, Concert } from 'services/APIConcertFetcher';
import { MenuHeader, ConcertThumbnail } from 'components/shared';
import { RouteComponentProps } from 'react-router';


interface UpcomingConcertsPageProps extends RouteComponentProps<any> {}

// TODO: Mobx observer for data loading indicator
export class UpcomingConcertsPage extends React.Component<UpcomingConcertsPageProps> {
    private concertFetcher: APIConcertFetcher
    private concertList: Concert[]

    constructor(props: UpcomingConcertsPageProps) {
        super(props)

        this.concertList = []
        this.concertFetcher = new APIConcertFetcher()
        this.concertList = this.concertFetcher.fetchConcerts()
    }


    // Figure out how to async this and re-render. Redux?
    async componentDidMount() {
        // this.concertList = await this.concertFetcher.fetchConcerts()
    }

    goToConcert = (concertID: number): void => {
        this.props.history.push(`/concerts/${concertID}`)
    }

    render(): JSX.Element {
        if (this.concertFetcher.isLoading) {
            // TODO: Loading indicator
            return <div>Loading</div>
        }

        const concertButtons = this.concertList.map(concert => {
            return <ConcertThumbnail concert={concert} onClick={this.goToConcert}/>
        })

        return (
            <div>
                <MenuHeader title="UpcomingConcerts"/>
                {concertButtons}
            </div>
        )
    }
}