import 'App.css'

import { ButtonWithIcon } from 'components/shared'
import { observer } from 'mobx-react'
import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import Select from 'react-select'
import { PredictionCategory, SongSelection } from 'services/APIPredictionsClient'
import { Style, StyleMap, VerticalStack } from 'utils/styles'

import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'

import { ConcertPredictionModel } from './models'

// TODO: Make Submit Button shared component https://trello.com/c/Lx6Phxxp/57-move-submit-button-component-to-shared
interface SubmitButtonProps {
    onClick(): void
}

export function SubmitButton(props: SubmitButtonProps): JSX.Element {
    const style: Style = {
        padding: '10px 30px',
        backgroundColor: '#A10AC7',
        borderRadius: '5px',
        alignItems: 'center',
        fontSize: 20,
        fontWeight: 600,

    }

    return <VerticalStack style={style} onClick={props.onClick}>Submit</VerticalStack>
}

interface SongPredictionButtonProps {
    model: ConcertPredictionModel
    category: PredictionCategory
}

interface SongPredictionButtonState {
    showModal: boolean
    selectedSong: SongSelection | null
}

@observer
class SongPredictionButton extends React.Component<SongPredictionButtonProps, SongPredictionButtonState> {
    constructor(props: SongPredictionButtonProps) {
        super(props)

        this.state = {
            showModal: false,
            selectedSong: null,
        }
    }

    componentDidMount = () => {
        const selectedSong = this.props.model.getSongSelectionForCategory(this.props.category)
        this.setState({selectedSong})
    }

    onShowModal = () => {
        this.setState({showModal: true})
    }

    onHideModal = () => {
        this.setState({showModal: false})
    }

    // Cast as "any" for now; problems with React Select
    onChangeSelection = (selectedSong: any) => {
        this.setState({selectedSong})
    }

    onSaveSelection = () => {
        this.props.model.onSelect(this.state.selectedSong, this.props.category.id)
        this.onHideModal()
    }

    render(): JSX.Element {
        const selectedSong = this.props.model.getSongSelectionForCategory(this.props.category)
        const songTitle = selectedSong ? selectedSong.label : 'N/A'
        const buttonText = this.props.category.name + ': ' + songTitle
        const icon = selectedSong ? faEdit : faPlus

        const dropdownStyle: Style = {
            color: 'black',
            marginBottom: 20,
        }

        const songDropdown = <VerticalStack style={dropdownStyle}>
            <Select
                value={this.state.selectedSong}
                onChange={this.onChangeSelection}
                options={this.props.model.songSelections}
                onInputKeyDown={this.onChangeSelection}
                components={{ DropdownIndicator: () => null }}
            />
        </VerticalStack>

        const modalFooter = <Modal.Footer>
            <Button variant="primary" onClick={this.onSaveSelection}>Save</Button>
            <Button variant="secondary" onClick={this.onHideModal}>Cancel</Button>
        </Modal.Footer>

        // NOTE: easier to use CSS classes than inline styles for React-Bootstrap modals
        return (
            <div>
                <Modal show={this.state.showModal} centered onHide={this.onHideModal} dialogClassName="modal-dialogue">
                    <Modal.Header className="modal-header" closeButton>
                    <Modal.Title>{this.props.category.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {songDropdown}
                    </Modal.Body>
                        {modalFooter}
                </Modal>
                <ButtonWithIcon text={buttonText} icon={icon} onClick={this.onShowModal}/>
            </div>
        )
    }
}

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
        // https://trello.com/c/IiDDdi9U/29-loading-indicator
        if (!this.model.predictionCategories) {
            return null
        }

        const predictionButtons = this.model.predictionCategories.map((predictionCategory) => {
            return <SongPredictionButton model={this.model} category={predictionCategory} />
        })

        const styles: StyleMap = {
            container: {
                marginTop: 10,
            },
            predictionButtons: {
                marginBottom: 10,
            },
        }

        return (
            <VerticalStack style={styles.container}>
                <div style={styles.predictionButtons}>{predictionButtons}</div>
                <SubmitButton onClick={this.model.submitPrediction}/>
            </VerticalStack>
        )
    }
}
