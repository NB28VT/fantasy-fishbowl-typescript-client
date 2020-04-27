import thumbnailPlaceholder from 'images/alpharetta-venue-image.jpg'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Concert } from 'services/APIConcertFetcher'
import { HorizontalStack, Style, StyleMap, VerticalStack } from 'utils/styles'

import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons'

import { NavIcon } from './authenticatedAppMain'

interface BackButtonProps extends RouteComponentProps<any> {title: string}

function BackButton(props: BackButtonProps): JSX.Element {
    const goBack = (): void => {
        props.history.goBack()
    }

    return <NavIcon icon={faAngleDoubleLeft} title={props.title} onClick={goBack}/>
}

export const BackButtonWithRouter = withRouter(BackButton)

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
    concert: Concert | null
    onClick?(concertID: number): void
}

export class ConcertThumbnail extends React.Component<ConcertThumbnailProps> {
    render(): JSX.Element | null {
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
            },
        }

        // TODO: More elegant way to handle optional event
        const onClick = (): void => {
            if (this.props.onClick && this.props.concert) {
                this.props.onClick(this.props.concert.id)
            }
        }

        if (!this.props.concert) {
            return null
        }

        return (
            <HorizontalStack style={styles.container} onClick={onClick}>
                <img style={styles.thumbnail} src={this.props.concert.venue_image_src} alt="Concert Photo"/>
                <VerticalStack style={styles.info}>
                    <div style={styles.showDate}>{this.props.concert.show_time}</div>
                    <div style={styles.showName}>{this.props.concert.venue_name}</div>
                </VerticalStack>
            </HorizontalStack>
        )
    }
}
