import React from 'react';
import { APIConcertFetcher, Concert } from 'services/APIConcertFetcher';
import { MenuHeader, ConcertThumbnail } from 'components/shared';

// TODO: this will get replaced by a nested route via React Router
interface UpcomingConcertsPageProps {
    onSelectConcert(concertID: number): void
}

// Mobx observer for data loading indicator
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

    render(): JSX.Element {
        if (this.concertFetcher.isLoading) {
            // TODO: Loading indicator
            return <div>Loading</div>
        }

        const concertButtons = this.concertList.map(concert => {
            return <ConcertThumbnail concert={concert} onClick={this.props.onSelectConcert}/>
        })

        return (
            <div>
                <MenuHeader title="UpcomingConcerts"/>
                {concertButtons}
            </div>
        )
    }
}