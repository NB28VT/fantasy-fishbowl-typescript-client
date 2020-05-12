import 'App.css'

import { ButtonWithIcon } from 'components/shared'
import { observer } from 'mobx-react'
import React from 'react'
import { Button, Modal } from 'react-bootstrap'
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
    // openRef: React.RefObject<any>
    // selectRef: ElementRef
    // private selectRef: any = React.createRef<HTMLDivElement>()
    private selectRef: any

    // private selectRef = React.createRef()

    // React.createRef<HTMLDivElement>()
    /**
     * Arg type is "SongSelection" but cast as "any" because React-Select whines;
     * prefer this to jumping through hoops with the typing for React-Select's benefit
     */

    constructor(props: SongDropdownProps) {
        super(props)

        this.selectRef = React.createRef<HTMLDivElement>()
    }
    // This is probably bad
    componentDidMount = () => {
        console.log(this.selectRef.current)

        const ref = this.selectRef.current

        if (ref) {
            console.log("should focus")
            ref.focus()
        }
    }

    // componentDidUpdate = () => {
    //     const ref = this.selectRef.current

    //     if (ref) {
    //         console.log("should focus")
    //         ref.focus()
    //     }
    // }

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
                {/* <HorizontalStack style={styles.label}>
                    {this.props.predictionCategory.name}
                </HorizontalStack> */}
                <Select
                    value={this.props.selected}
                    onChange={this.handleChange}
                    options={this.props.songSelections}
                    onInputKeyDown={this.handleChange}
                    components={{ DropdownIndicator: () => null }}
                    // autoFocus={true}
                    ref={this.selectRef}
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
        backgroundColor: '#A10AC7',
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


interface SongSelectionModalProps {
    model: ConcertPredictionModel
    category: PredictionCategory
}

@observer
class SongSelectionModal extends React.Component<SongSelectionModalProps, {showModal: boolean}> {
    // Going to use state for the modals here
    constructor(props: SongSelectionModalProps) {
        super(props)
        this.state = {
            showModal: false,
        }

    }

    onShowModal = () => {
        this.setState({showModal: true})
    }

    onHideModal = () => {
        this.setState({showModal: false})
    }

    onSelectSong = (songSelection: SongSelection, predictionCategoryID: number) => {
        this.props.model.onSelect(songSelection, predictionCategoryID)
        this.onHideModal()
    }

    onClick = () => {
        // Opens modal - need to pass onSelect off of ConcertPredictionModel

    }

    render(): JSX.Element {
        const selectedSong = this.props.model.getSongSelectionForCategory(this.props.category)
        const songTitle = selectedSong ? selectedSong.label : 'N/A'
        const buttonText = this.props.category.name + ': ' + songTitle
        const icon = selectedSong ? faEdit : faPlus

        // NOTE: To alter the CSS properties of a React-Select modal, it's easier to use CSS classes than inline styles.
        return (
            <div>
                <Modal show={this.state.showModal} centered onHide={this.onHideModal} dialogClassName="modal-dialogue">
                    <Modal.Header className="modal-header" closeButton>
                    <Modal.Title>{this.props.category.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <SongDropdown
                            selected={selectedSong}
                            songSelections={this.props.model.songSelections}
                            predictionCategory={this.props.category}
                            onSelect={this.onSelectSong}
                        />
                    </Modal.Body>
                    {/* <Modal.Footer>
                        <Button variant="secondary" onClick={this.onHideModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.onHideModal}>
                            Save Changes
                        </Button>
                    </Modal.Footer> */}
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

    onClickCategory = (predictionCategory: PredictionCategory): void => {
        console.log("Category", predictionCategory)
        console.log("Ah yeah clickkked")
    }

    render(): JSX.Element | null {
        // TODO: this can be slow, fill in a loading indicator
        // https://trello.com/c/IiDDdi9U/29-loading-indicator
        if (!this.model.predictionCategories) {
            return null
        }

        const predictionButtons = this.model.predictionCategories.map((predictionCategory) => {
            // const selectedSong = this.model.getSongSelectionForCategory(predictionCategory)

            // const songTitle = selectedSong ? selectedSong.label : 'N/A'
            // const buttonText = predictionCategory.name + ': ' + songTitle
            // const icon = selectedSong ? faEdit : faPlus

            // Let's try passing the model down a level, I think it's unavoidable
            return <SongSelectionModal model={this.model} category={predictionCategory} />


            // todo: Incorporate this in the popup
            {/* <SongDropdown
                selected={selectedSong}
                songSelections={this.model.songSelections}
                predictionCategory={predictionCategory}
                onSelect={this.model.onSelect}
            /> */}

        })

        const styles: StyleMap = {
            container: {
                marginTop: 10,
            },
            predictionButtons: {
                marginBottom: 10,
            }
        }

        return (
            <VerticalStack style={styles.container}>
                <div style={styles.predictionButtons}>{predictionButtons}</div>
                <SubmitButton onClick={this.model.submitPrediction}/>
            </VerticalStack>
        )
    }
}
