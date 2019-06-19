import thumbnailPlaceholder from 'images/alpharetta-venue-image.jpg';
import React from 'react';
import { Concert } from 'services/APIConcertFetcher';
import { HorizontalStack, Style, StyleMap, VerticalStack } from 'utils/styles';

export function MenuHeader(props: {title: string}): JSX.Element {
    const style: Style = {
        display: 'flex',
        flexGrow: 2,
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 20,
        fontSize: 30,   
    }

    return <div style={style}>{props.title}</div>
}

interface ConcertThumbnailProps {
    concert: Concert
    onClick?(concertID: number): void
}

export function ConcertThumbnail(props: ConcertThumbnailProps): JSX.Element {
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
        if (!props.onClick) {
            // no-op
            return
        }

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