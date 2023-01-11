import React, { ReactChild } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Concert } from 'services/APIConcertFetcher'
import {
    solidPurple, transparentPurple, transparentToastifyRed, transparentYellow,
} from 'utils/colors'
import { HorizontalStack, Style, StyleMap, VerticalStack } from 'utils/styles'

import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ButtonStandardProps {
    children: ReactChild
    fontSize?: number
    inverse?: boolean
    disabled?: boolean
    onClick(): void
}

export function ButtonStandard(props: ButtonStandardProps): JSX.Element {
    const style = {
        padding: '10px 30px',
        backgroundColor: '#A10AC7',
        color: 'inherit',
        borderRadius: '5px',
        alignItems: 'center',
        fontSize: props.fontSize || 20,
        fontWeight: 600,
        opacity: props.disabled ? 0.5 : 1,
    }

    return <button style={style} onClick={props.onClick} disabled={props.disabled}>{props.children}</button>
}

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
                    <img style={styles.thumbnail} src={this.props.concert.venue_image_src} alt="Concert"/>
                </VerticalStack>
                <VerticalStack style={styles.info}>
                    <div style={styles.showName}>{this.props.concert.venue_name}</div>
                    <div style={styles.showDate}>{this.props.concert.show_time}</div>
                </VerticalStack>
            </HorizontalStack>
        )
    }
}

interface BorderedButtonProps {
    children: ReactChild[]
    errorHighlight?: boolean
    flashOnClick?: boolean
    onClick(...args: any): void
}

interface BorderedButtonState {
    backgroundColor: string
}

export class BorderedButton extends React.Component<BorderedButtonProps, BorderedButtonState> {
    constructor(props: BorderedButtonProps) {
        super(props)

        this.state = {backgroundColor: transparentPurple}
    }

    onClick = () => {
        this.props.onClick()
        if (this.props.flashOnClick) {
            this.setState({backgroundColor: transparentYellow})
            setTimeout(this.afterButtonFlash, 100)
        }
    }

    afterButtonFlash = () => {
        this.setState({backgroundColor: transparentPurple})
    }

    render(): JSX.Element {
        const border = this.props.errorHighlight ? `5px solid ${transparentToastifyRed}` : `1px solid ${solidPurple}`
        const style: Style = {
            height: '8vh',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: this.state.backgroundColor,
            borderRadius: '5px',
            border: `${border}`,
            padding: '5vw',
            marginBottom: '8px',
            fontSize: 15,
        }

        return (
            <HorizontalStack style={style} onClick={this.onClick}>
                {this.props.children}
            </HorizontalStack>
        )
    }
}
