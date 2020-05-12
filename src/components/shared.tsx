import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Concert } from 'services/APIConcertFetcher'
import { HorizontalStack, Style, StyleMap, VerticalStack } from 'utils/styles'

import { faAngleLeft, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface NavBackHeaderProps extends RouteComponentProps<any> {pageTitle: string}

function NavBackHeader(props: NavBackHeaderProps): JSX.Element {
    const goBack = (): void => {
        props.history.goBack()
    }

    const styles: StyleMap = {
        container: {
            justifyContent: 'flex-start',
            height: '10vh',
            fontSize: 30,
        },
        buttonContainer: {
            justifyContent: 'center',
        },
    }

    return (
        <HorizontalStack style={styles.container}>
            <VerticalStack style={styles.buttonContainer} onClick={goBack}>
                <FontAwesomeIcon icon={faAngleLeft}/>
            </VerticalStack>
            <MenuHeader title={props.pageTitle}/>
        </HorizontalStack>
    )
}

export const NavBackHeaderWithRouter = withRouter(NavBackHeader)

export function MenuHeader(props: {title: string}): JSX.Element {
    const style: Style = {
        display: 'flex',
        flexGrow: 2,
        justifyContent: 'center',
        alignItems: 'center',
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
                marginBottom: 15,
            },
            thumbnailContainer: {
                alignItems: 'center',
            },
            thumbnail: {
                height: '100%',
                objectFit: 'cover',
                width: 80,
            },
            showDate: {
                fontSize: 15,
                marginBottom: 10,
            },
            showName: {
                fontSize: 25,
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
                <VerticalStack style={styles.thumbnailContainer}>
                    <img style={styles.thumbnail} src={this.props.concert.venue_image_src} alt="Concert Photo"/>
                </VerticalStack>
                <VerticalStack style={styles.info}>
                    <div style={styles.showName}>{this.props.concert.venue_name}</div>
                    <div style={styles.showDate}>{this.props.concert.show_time}</div>
                </VerticalStack>
            </HorizontalStack>
        )
    }
}

interface ButtonWithIconProps {
    text: string
    icon: IconDefinition
    onClick?(...args: any): void
}

export function ButtonWithIcon(props: ButtonWithIconProps): JSX.Element {
    const style: Style = {
        height: '8vh',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgb(203,13,250, 0.2)',
        borderRadius: '5px',
        border: '1px solid #CB0DFA',
        padding: '5vw',
        // marginBottom: '5px',
        marginBottom: '8px',
        fontSize: 15,
    }

    return (
        <HorizontalStack style={style} onClick={props.onClick}>
            {props.text}
            <FontAwesomeIcon icon={props.icon}/>
        </HorizontalStack>
    )
}
