
import { ButtonWithIcon } from 'components/shared'
import { observer } from 'mobx-react'
import React from 'react'
import Select from 'react-select'
import { PredictionCategory, SongSelection } from 'services/APIPredictionsClient'
import { HorizontalStack, Style, StyleMap, VerticalStack } from 'utils/styles'

import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'

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
        const styles: StyleMap = {
            container: {
                color: 'black',
                marginBottom: 20,
            },
            label: {
                marginBottom: 5,
                color: '#F5ED13',
            },
        }

        return (
            <VerticalStack style={styles.container}>
                <HorizontalStack style={styles.label}>
                    {this.props.predictionCategory.name}
                </HorizontalStack>
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
        borderRadius: '5px',
        alignItems: 'center',
        fontSize: 20,
        fontWeight: 600,

    }

    return <VerticalStack style={style} onClick={props.onClick}>Submit</VerticalStack>
}

// todo: Incorporate this in the popup
{/* <SongDropdown
    selected={selectedSong}
    songSelections={this.model.songSelections}
    predictionCategory={predictionCategory}
    onSelect={this.model.onSelect}
/> */}

interface PredictionsFormProps {
    concertID: number
    token: string
}

@observer
export class PredictionsForm extends React.Component<PredictionsFormProps> {
    model: ConcertPredictionModel

    constructor(props: PredictionsFormProps) {
        super(props)

        this.model = new ConcertPredictionModel(props.concertID, this.props.token)
    }

    async componentDidMount(): Promise<void> {
        await this.model.getSongSelections()
        await this.model.setDefaultPredictions()
    }

    render(): JSX.Element | null {
        // TODO: this can be slow, fill in a loading indicator
        if (!this.model.predictionCategories) {
            return null
        }

        const predictionButtons = this.model.predictionCategories.map((predictionCategory) => {
            const selectedSong = this.model.getSongSelectionForCategory(predictionCategory)

            const songTitle = selectedSong ? selectedSong.label : 'N/A'
            const buttonText = predictionCategory.name + ': ' + songTitle
            const icon = selectedSong ? faEdit : faPlus

            return <ButtonWithIcon text={buttonText} icon={icon}/>
        })

        return (
            <VerticalStack>
                <div>{predictionButtons}</div>
                <SubmitButton onClick={this.model.submitPrediction}/>
            </VerticalStack>
        )
    }
}
