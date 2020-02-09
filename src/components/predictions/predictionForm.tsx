
import { observer } from 'mobx-react'
import React from 'react'
import Select from 'react-select'
import { PredictionCategory, SongSelection } from 'services/APIPredictionsClient'
import { Style, VerticalStack } from 'utils/styles'

import { ConcertPredictionModel } from './models'

interface SongDropdownProps {
    selected: SongSelection | null
    songSelections: SongSelection[]
    predictionCategory: PredictionCategory
    onSelect(songSelection: SongSelection, predictionCategoryID: number): void
}

@observer
class SongDropdown extends React.Component<SongDropdownProps> {
    /**
     * Arg type is "SongSelection" but cast as "any" because React-Select whines;
     * prefer this to jumping through hoops with the typing for React-Select's benefit
     */
    handleChange = (selectedOption: any)   => {
        this.props.onSelect(selectedOption, this.props.predictionCategory.id)
    }

    render(): JSX.Element {
        const style: Style = {
            color: 'black',
            marginBottom: 10,
        }

        const labelStyle: Style = {
            marginBottom: 5,
            color: '#F5ED13',
        }

        return (
            <VerticalStack style={style}>
                {this.props.predictionCategory.name}
                <Select
                    value={this.props.selected}
                    onChange={this.handleChange}
                    options={this.props.songSelections}
                />
            </VerticalStack>
        )
    }
}

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

interface PredictionFormProps {
    concertID: number
    token: string
}

@observer
export class PredictionsForm extends React.Component<PredictionFormProps> {
    model: ConcertPredictionModel

    constructor(props: PredictionFormProps) {
        super(props)

        this.model = new ConcertPredictionModel(props.concertID, this.props.token)
    }

    async componentDidMount(): Promise<void> {
        await this.model.getSongSelections()
        await this.model.setDefaultPredictions()
    }

    render(): JSX.Element | null {
        if (!this.model.predictionCategories) {
            return null
        }

        const songDropdowns = this.model.predictionCategories.map((predictionCategory) => {
            const selectedSong = this.model.getSongSelectionForCategory(predictionCategory)

            return (
                <SongDropdown
                    selected={selectedSong}
                    songSelections={this.model.songSelections}
                    predictionCategory={predictionCategory}
                    onSelect={this.model.onSelect}
                />
            )
        })

        return (
            <VerticalStack>
                <div>{songDropdowns}</div>
                <SubmitButton onClick={this.model.submitPrediction}/>
            </VerticalStack>
        )
    }
}
