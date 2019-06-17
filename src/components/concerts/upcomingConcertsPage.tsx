import thumbnailPlaceholder from 'images/alpharetta-venue-image.jpg';
import React from 'react';
import { APIConcertFetcher, Concert } from 'services/APIConcertFetcher';
import { HorizontalStack, StyleMap, VerticalStack } from 'utils/styles';

interface ConcertThumbnailProps {
    concert: Concert
    onClick(concertID: number): void
}

function ConcertThumbnail(props: ConcertThumbnailProps): JSX.Element {
    // TODO: save thumbnail (on the backend)
    const styles: StyleMap = {
        container:  {
            display: 'flex',
            padding: 10,
            justifyContent: 'flex-start',

            border: '1px solid',
            borderRadius: '10px',
            marginBottom: 10,
        },
        thumbnail: {
            height: '100%',
            width: 80,
        },
        showDate: {
            fontSize: 25,
            marginBottom: 10,
        },
        showName: {
            fontSize: 12,
        },
        info: {
            justifyContent: 'space-between',
            marginLeft: 20,
        }
    }

    function onSelectConcert(): void {
        props.onClick(props.concert.id)
    }

    return (
        <HorizontalStack style={styles.container} onClick={onSelectConcert}>
                <img style={styles.thumbnail} src={thumbnailPlaceholder} alt="Concert Photo"/>
            <VerticalStack style={styles.info}>
                <div style={styles.showDate}>{props.concert.show_time}</div>
                <div style={styles.showName}>{props.concert.venue_name}</div>
            </VerticalStack>
        </HorizontalStack>       
    )
}


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

        const styles: StyleMap = {
            container: {
                display: 'flex',
            },
            header: {
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 20,
                marginTop: 20,
                fontSize: 30,
            }
        }

        const concertButtons = this.concertList.map(concert => {
            return <ConcertThumbnail concert={concert} onClick={this.props.onSelectConcert}/>
        })

        return (
            <div style={styles.concert}>
                <div style={styles.header}>UpcomingConcerts</div>
                {concertButtons}
            </div>
        )
    }
}