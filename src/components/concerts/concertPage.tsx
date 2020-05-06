import { AuthContext } from 'App'
import { PredictionsForm } from 'components/predictions/predictionForm'
import { BackButtonWithRouter, ConcertThumbnail, MenuHeader } from 'components/shared'
import { observer } from 'mobx-react'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { HorizontalStack, Style, StyleMap, VerticalStack } from 'utils/styles'

import { ConcertPageModel } from './models'

interface SubmitButtonProps {
    onClick(): void
}

export function SubmitButton(props: SubmitButtonProps): JSX.Element {
    const style: Style = {
        padding: '10px 30px',
        backgroundColor: 'rgba(203, 13, 250, 0.7)',
        borderRadius: '10px',
        alignItems: 'center',
        fontSize: 25,
        fontWeight: 600,

    }

    return <VerticalStack style={style} onClick={props.onClick}>Submit</VerticalStack>
}

interface ConcertPageRouterParams {
    id: string
}

interface ConcertPageProps extends RouteComponentProps<ConcertPageRouterParams> {
    concertID: number
}

@observer
export class ConcertPage extends React.Component<ConcertPageProps> {
    model: ConcertPageModel
    concertID: number

    constructor(props: ConcertPageProps) {
        super(props)

        this.concertID = parseInt(this.props.match.params.id, 10)
        this.model = new ConcertPageModel()
    }

    async componentDidMount(): Promise<void> {
        await this.model.loadConcert(this.concertID)
    }

    render(): JSX.Element | null {

        const topBarStyle: Style = {
            justifyContent: 'flex-start',
            alignItems: 'center',
            height: '10vh',
        }

        if (!this.model.concert) {
            return null
        }

        return (
            <VerticalStack>
                <HorizontalStack style={topBarStyle}>
                    <VerticalStack>
                        <BackButtonWithRouter title="Back To Shows"/>
                    </VerticalStack>
                    <MenuHeader title="My Setlist Prediction"/>
                </HorizontalStack>

                <VerticalStack>
                    <ConcertThumbnail concert={this.model.concert}/>
                </VerticalStack>
                <AuthContext.Consumer>
                    {({token}) => (
                        <PredictionsForm concertID={this.concertID} token={token}/>
                    )}
                </AuthContext.Consumer>
                <ToastContainer position="bottom-center"/>
            </VerticalStack>
        )
    }
}
