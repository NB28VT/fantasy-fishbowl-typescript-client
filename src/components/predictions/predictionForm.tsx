import 'App.css'

import { BorderedButton, ButtonStandard } from 'components/shared'
import { observer } from 'mobx-react'
import React from 'react'
import { Modal } from 'react-bootstrap'
import Select from 'react-select'
import { APIPredictionsClient, SongSelection } from 'services/APIPredictionsClient'
import { APISongsFetcher } from 'services/APISongFetcher'
import { ToastService } from 'services/ToastService'
import { Style, StyleMap, VerticalStack } from 'utils/styles'

import { faEdit, faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { CategoryPredictionModel, ConcertPredictionModel } from './models'

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
interface PredictionCategoryButtonProps {
    buttonText: string
    icon: IconDefinition
    highlightMissing: boolean
    onClick(): void
}

function PredictionCategoryButton(props: PredictionCategoryButtonProps): JSX.Element {
    return (
        <BorderedButton onClick={props.onClick} flashOnClick={true} errorHighlight={props.highlightMissing}>
            {props.buttonText}
        <FontAwesomeIcon icon={props.icon}/>
    </BorderedButton>
    )
}

interface CategoryPredictionProps {
    songSelections: SongSelection[]
    model: CategoryPredictionModel
    displayValidations: boolean
}

interface CategoryPredictionState {
    showModal: boolean
}

@observer
class CategoryPrediction extends React.Component<CategoryPredictionProps, CategoryPredictionState> {
    constructor(props: CategoryPredictionProps) {
        super(props)
        this.state = {showModal: false}
    }

    onShowModal = () => {
        this.setState({showModal: true})
    }

    onHideModal = () => {
        this.setState({showModal: false})
    }

    onSaveSelection = () => {
        this.props.model.onSaveSelection()
        this.onHideModal()
    }

    render(): JSX.Element {
        const model = this.props.model
        const songTitle = model.saved ? model.saved.label : 'N/A'
        const buttonText = model.category.name + ': ' + songTitle
        const icon = model.saved ? faEdit : faPlus

        const styles: StyleMap = {
            dropdown: {
                color: 'black',
                marginBottom: 20,
            },
            footer: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
            },
        }

        const songDropdown = <VerticalStack style={styles.dropdown}>
            <Select
                value={model.displayed}
                onChange={model.onChangeSelection}
                options={this.props.songSelections}
                onInputKeyDown={model.onChangeSelection}
                components={{ DropdownIndicator: () => null }}
            />
        </VerticalStack>

        const isSubmitDisabled = !(model.displayed)
        const modalFooter = <Modal.Footer style={styles.footer}>
            <ButtonStandard onClick={this.onSaveSelection} fontSize={20} disabled={isSubmitDisabled}>
                Save
            </ButtonStandard>
            <ButtonStandard onClick={this.onHideModal} fontSize={20}>Cancel</ButtonStandard>
        </Modal.Footer>

        const displayValidations = !(model.saved) &&  this.props.displayValidations
        return (
            <div>
                <Modal show={this.state.showModal} centered onHide={this.onHideModal} dialogClassName="modal-dialogue">
                    <Modal.Header className="modal-header" closeButton>
                    <Modal.Title>{model.category.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {songDropdown}
                    </Modal.Body>
                        {modalFooter}
                </Modal>

                <PredictionCategoryButton
                    buttonText={buttonText}
                    onClick={this.onShowModal}
                    highlightMissing={displayValidations}
                    icon={icon}
                />
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

        this.model = new ConcertPredictionModel(
            new APIPredictionsClient(this.props.token),
            new APISongsFetcher(),
            new ToastService(),
            props.concertID,
        )
    }

    async componentDidMount(): Promise<void> {
        await this.model.loadPredictionSelections()
    }

    render(): JSX.Element | null {
        // TODO: this can be slow, fill in a loading indicator
        // https://trello.com/c/IiDDdi9U/29-loading-indicator
        if (!this.model.isLoaded) {
            return null
        }

        const predictionButtons = this.model.categoryPredictionModels.map(categoryPredictionModel => {
            return (
                <CategoryPrediction
                    songSelections={this.model.songSelections}
                    model={categoryPredictionModel}
                    displayValidations={this.model.displayValidations}
                />
            )
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
                <SubmitButton onClick={this.model.onPredictionSubmit}/>
            </VerticalStack>
        )
    }
}
