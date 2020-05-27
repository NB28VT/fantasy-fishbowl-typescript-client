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

// Alternative: pass the state all the way down:
// interface SongDropdownProps {
//     model: ConcertPredictionModel
//     // selected: SongSelection | null
//     songSelections: SongSelection[]
//     predictionCategory: PredictionCategory
//     onSelect(songSelection: SongSelection, predictionCategoryID: number): void
// }

// interface SongDropdownState {
//     isFocused: boolean
// }

// @observer
// class SongDropdown extends React.Component<SongDropdownProps, SongDropdownState> {
//     // openRef: React.RefObject<any>
//     // selectRef: ElementRef
//     // private selectRef: any = React.createRef<HTMLDivElement>()
//     private selectRef: any

//     // private selectRef = React.createRef()

//     // React.createRef<HTMLDivElement>()
//     /**
//      * Arg type is "SongSelection" but cast as "any" because React-Select whines;
//      * prefer this to jumping through hoops with the typing for React-Select's benefit
//      */

//     constructor(props: SongDropdownProps) {
//         super(props)

//         this.state = {
//             isFocused: false,
//         }

//         // this.selectRef = React.createRef<HTMLDivElement>()
//     }
//     // This is probably bad
//     componentDidMount = () => {
//         // console.log(this.selectRef.current)

//         // const ref = this.selectRef.current

//         // if (ref) {
//         //     debugger;
//         //     console.log("should focus")
//         //     ref.focus()
//         // }

//         // Remember we will need to handle closing the modal as well
//         // console.log("Mounted")
//         console.log("Setting state")
//         console.log(this.state)
//         this.setState({isFocused: true})
//         // IMPORTANT: THIS ISN'T GOING TO WORK BECAUSE SETSTATE IS ASYNC, IT TAKES TIME

//         // setState() does not immediately mutate this.state but creates a pending state transition. Accessing this.state after calling this method can potentially return the existing value. There is no guarantee of synchronous operation of calls to setState and calls may be batched for performance gains.
//         // console.log("is focused?", this.state.isFocused)
//     }

//     // componentDidUpdate = () => {
//     //     const ref = this.selectRef.current

//     //     if (ref) {
//     //         console.log("should focus")
//     //         ref.focus()
//     //     }
//     // }

//     handleChange = (selectedOption: any)   => {
//         // TODO: NEW APROACH. DON'T WORRY ABOUT AUTO FOCUS, HOOK UP SAVE AND CANCEL BUTTONS INSTEAD



//         this.props.onSelect(selectedOption, this.props.predictionCategory.id)
//     }

//     render(): JSX.Element {
//         const styles: StyleMap = {
//             container: {
//                 color: 'black',
//                 marginBottom: 20,
//             },
//             label: {
//                 marginBottom: 5,
//                 color: '#F5ED13',
//             },
//         }

//         // console.log("STATE FOCUSED?", this.state.isFocused)
//         return (
//             <VerticalStack style={styles.container}>
//                 {/* <HorizontalStack style={styles.label}>
//                     {this.props.predictionCategory.name}
//                 </HorizontalStack> */}
//                 <Select
//                     value={this.props.selected}
//                     onChange={this.handleChange}
//                     options={this.props.songSelections}
//                     onInputKeyDown={this.handleChange}
//                     components={{ DropdownIndicator: () => null }}
//                     // autoFocus={this.state.isFocused}
//                     // autoFocus={true}
//                     // ref={this.selectRef}
//                 />
//             </VerticalStack>
//         )
//     }
// }

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


// REDESIGNED MODAL WITH SELECT INCORPATED; SEE IF THIS IS CLEANER

interface SongSelectionModalProps {
    model: ConcertPredictionModel
    category: PredictionCategory
}

interface SongSelectionModalState {
    showModal: boolean
    selectedSong: SongSelection | null
}

@observer
class SongSelectionModal extends React.Component<SongSelectionModalProps, SongSelectionModalState> {
    // Going to use state for the modals here
    constructor(props: SongSelectionModalProps) {
        super(props)

        const selectedSong = this.props.model.getSongSelectionForCategory(this.props.category)

        this.state = {
            showModal: false,
            selectedSong,
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

    // This has to be "any" cause react-select sucks
    onChangeSelection = (selectedSong: any) => {
        this.setState({selectedSong})
    }

    onSaveSelection = () => {
        this.props.model.onSelect(this.state.selectedSong, this.props.category.id)
    }


    handleChange = (selectedOption: any)   => {
        // TODO: NEW APROACH. DON'T WORRY ABOUT AUTO FOCUS, HOOK UP SAVE AND CANCEL BUTTONS INSTEAD



        // this.props.onSelect(selectedOption, this.props.predictionCategory.id)
    }

    // This will be on submission:
    // onSelectSong = (songSelection: SongSelection, predictionCategoryID: number) => {
        // this.props.model.onSelect(songSelection, predictionCategoryID)
        // this.onHideModal()
    // }

    onClick = () => {
        // Opens modal - need to pass onSelect off of ConcertPredictionModel

    }

    render(): JSX.Element {
        // const selectedSong = this.props.model.getSongSelectionForCategory(this.props.category)
        const songTitle = this.state.selectedSong ? this.state.selectedSong.label : 'N/A'
        const buttonText = this.props.category.name + ': ' + songTitle
        const icon = this.state.selectedSong ? faEdit : faPlus

        // Eliminate modal to see if this solves the react-select autofocus issues
        // No autoFocus=true doesn't work
        // return (
        //     <div>
        //         <Select autoFocus={true}/>
        //         {/* <SongDropdown
        //             selected={selectedSong}
        //             songSelections={this.props.model.songSelections}
        //             predictionCategory={this.props.category}
        //             onSelect={this.onSelectSong}
        //         /> */}
        //     </div>
        // )

        // NOTE: To alter the CSS properties of a React-Select modal, it's easier to use CSS classes than inline styles.

        const styles: StyleMap = {
            dropdownContainer: {
                color: 'black',
                marginBottom: 20,
            },
            dropDownLabel: {
                marginBottom: 5,
                color: '#F5ED13',
            },
        }



        const songDropdown = <VerticalStack style={styles.dropdownContainer}>
                {/* <HorizontalStack style={styles.dropdownLabel}>
                    {this.props.predictionCategory.name}
                </HorizontalStack> */}
                <Select
                    value={this.state.selectedSong}
                    onChange={this.onChangeSelection}
                    options={this.props.model.songSelections}
                    onInputKeyDown={this.onChangeSelection}
                    components={{ DropdownIndicator: () => null }}
                    // autoFocus={this.state.isFocused}
                    // autoFocus={true}
                    // ref={this.selectRef}
                />
            </VerticalStack>

        return (
            <div>
                <Modal
                    show={this.state.showModal}
                    centered onHide={this.onHideModal}
                    dialogClassName="modal-dialogue"
                    // Tried these and they don't seem to work
                    // autoFocus={true}
                    // enforceFocus={false}
                >
                    <Modal.Header className="modal-header" closeButton>
                    <Modal.Title>{this.props.category.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {songDropdown}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.onHideModal}>
                            Save
                        </Button>
                        <Button variant="secondary" onClick={this.onHideModal}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
                <ButtonWithIcon text={buttonText} icon={icon} onClick={this.onShowModal}/>
            </div>
        )
    }
}






























// interface SongSelectionModalProps {
//     model: ConcertPredictionModel
//     category: PredictionCategory
// }

// @observer
// class SongSelectionModal extends React.Component<SongSelectionModalProps, {showModal: boolean}> {
//     // Going to use state for the modals here
//     constructor(props: SongSelectionModalProps) {
//         super(props)
//         this.state = {
//             showModal: false,
//         }

//     }

//     onShowModal = () => {
//         this.setState({showModal: true})
//     }

//     onHideModal = () => {
//         this.setState({showModal: false})
//     }

//     onSelectSong = (songSelection: SongSelection, predictionCategoryID: number) => {
//         // this.props.model.onSelect(songSelection, predictionCategoryID)
//         // this.onHideModal()
//     }

//     onClick = () => {
//         // Opens modal - need to pass onSelect off of ConcertPredictionModel

//     }

//     render(): JSX.Element {
//         const selectedSong = this.props.model.getSongSelectionForCategory(this.props.category)
//         const songTitle = selectedSong ? selectedSong.label : 'N/A'
//         const buttonText = this.props.category.name + ': ' + songTitle
//         const icon = selectedSong ? faEdit : faPlus

//         // Eliminate modal to see if this solves the react-select autofocus issues
//         // No autoFocus=true doesn't work
//         // return (
//         //     <div>
//         //         <Select autoFocus={true}/>
//         //         {/* <SongDropdown
//         //             selected={selectedSong}
//         //             songSelections={this.props.model.songSelections}
//         //             predictionCategory={this.props.category}
//         //             onSelect={this.onSelectSong}
//         //         /> */}
//         //     </div>
//         // )

//         // NOTE: To alter the CSS properties of a React-Select modal, it's easier to use CSS classes than inline styles.
//         return (
//             <div>
//                 <Modal
//                     show={this.state.showModal}
//                     centered onHide={this.onHideModal}
//                     dialogClassName="modal-dialogue"
//                     // Tried these and they don't seem to work
//                     // autoFocus={true}
//                     // enforceFocus={false}
//                 >
//                     <Modal.Header className="modal-header" closeButton>
//                     <Modal.Title>{this.props.category.name}</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         <SongDropdown
//                             model={this.props.model}
//                             // selected={selectedSong}
//                             songSelections={this.props.model.songSelections}
//                             predictionCategory={this.props.category}
//                             onSelect={this.onSelectSong}
//                         />
//                     </Modal.Body>
//                     <Modal.Footer>
//                         <Button variant="primary" onClick={this.onHideModal}>
//                             Save
//                         </Button>
//                         <Button variant="secondary" onClick={this.onHideModal}>
//                             Cancel
//                         </Button>
//                     </Modal.Footer>
//                 </Modal>
//                 <ButtonWithIcon text={buttonText} icon={icon} onClick={this.onShowModal}/>
//             </div>
//         )
//     }
// }


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


        // THESE MODALS ARE GETTING RENDERED ALL AT ONCE, TRY JUST ONE AND SEE IF IT FIXES AUTOFOCUS ISSUE
        // const predictionButtons = <SongSelectionModal model={this.model} category={this.model.predictionCategories[0]} />
        // const predictionButtons = this.model.predictionCategories.slice(0,1).map((predictionCategory) => {
        const predictionButtons = this.model.predictionCategories.map((predictionCategory) => {
            const selectedSong = this.model.getSongSelectionForCategory(predictionCategory)

            // const songTitle = selectedSong ? selectedSong.label : 'N/A'
            // const buttonText = predictionCategory.name + ': ' + songTitle
            // const icon = selectedSong ? faEdit : faPlus

            // Let's try passing the model down a level, I think it's unavoidable
            return <SongSelectionModal model={this.model} category={predictionCategory} />


            // todo: Incorporate this in the popup
            // return <SongDropdown
            //     selected={selectedSong}
            //     songSelections={this.model.songSelections}
            //     predictionCategory={predictionCategory}
            //     onSelect={this.model.onSelect}
            //     key={predictionCategory.id}
            // />

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
                {/* <Select autoFocus={true}/> */}
                <div style={styles.predictionButtons}>{predictionButtons}</div>
                <SubmitButton onClick={this.model.submitPrediction}/>
            </VerticalStack>
        )
    }
}
