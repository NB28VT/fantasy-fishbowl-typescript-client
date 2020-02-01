import { BackButtonWithRouter, ConcertThumbnail, MenuHeader } from 'components/shared'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import Select from 'react-select'
import { APIConcertFetcher, Concert } from 'services/APIConcertFetcher'
import {
    APIPredictionsClient, PredictionCategoriesResponse, PredictionCategory, SongPrediction,
    SongSelection,
} from 'services/APIPredictionsClient'
import { APISongsFetcher, Song } from 'services/APISongFetcher'
import { HorizontalStack, Style, VerticalStack } from 'utils/styles'

// Song id and name with the properties a React-Select dropdown expects


// THIS MAY NOT BE NEEDED - USE PREDICTIONS MODEL INSTEAD
// class SongsModel {
//     // @observable songs: Song[]
//     // @observable songSelections: SongSelection[]
//     // Maybe move loading properties to prediction model
//     // @observable isLoading: boolean
//     // songsFetcher: APISongsFetcher

//     constructor() {
//         // this.isLoading = true
//         this.songSelections = []
//         this.songsFetcher = new APISongsFetcher()
//     }

    // loadSongs = async (): Promise<void> => {
    //     const songs = await this.songsFetcher.fetchSongs()
    //     // this.isLoading = false
    // }

    /**
     * Maps songs returned from the API to a format that can be used by
     * the React-Select library's dropdown component
     */
    // getSongSelections = async (): Promise<SongSelection[]> => {
    //     const songs = await this.songsFetcher.fetchSongs()
    //     return songs.map(song => ({value: song.id, label: song.name}))
    // }
// }

class ConcertPredictionModel {
    // TODO: form validation on submit or save
    // @observable concert: Concert
    // @observable setOneOpenerPrediction: SongSelection | null = null
    // @observable setOneCloserPrediction: SongSelection | null = null
    // @observable setTwoOpenerPrediction: SongSelection | null = null
    // @observable setTwoCloserPrediction: SongSelection | null = null
    // @observable encorePrediction: SongSelection | null = null

    @observable songPredictions: SongPrediction[]

    // songsModel: SongsModel
    @observable songSelections: SongSelection[]
    @observable predictionCategories: PredictionCategory[]
    private predictionsClient: APIPredictionsClient
    private songsFetcher: APISongsFetcher

    constructor(public concertID: number) {
        // Maybe these should be injected:
        // I don't think I need the concert fetcher
        // this.concertFetcher = new APIConcertFetcher()
        this.predictionsClient = new APIPredictionsClient()
        this.songsFetcher = new APISongsFetcher()
        // WE DON'T ACTUALLY NEED THE SONGSMODEL

        // this.songsModel = new SongsModel()
        this.predictionCategories = []
        this.songPredictions = []
        this.songSelections = []
    }

    // loadSongSelections = async (): Promise<void> => {
    //     await this.songsModel.getSongSelections()
        // this.songSelections = this.songsModel.getSongSelections()
    // }

    /**
     * Maps songs returned from the API to a format that can be used by
     * the React-Select library's dropdown component
     */
    getSongSelections = async (): Promise<SongSelection[]> => {
        const songs = await this.songsFetcher.fetchSongs()
        return songs.map(song => ({value: song.id, label: song.name}))
    }

    // TODO: update promises to include rejections
    // https://blog.bitsrc.io/keep-your-promises-in-typescript-using-async-await-7bdc57041308
    setDefaultPredictions = async (): Promise<void> => {
        this.predictionCategories = await this.predictionsClient.getPredictionCategories()
        this.songPredictions = this.predictionCategories.map((category) => ({
            prediction_category_id: category.id, songSelection: null})
        )
    }

    // TODO: IDEA 2/1/20: REFACTOR SONG PREDICTION TO HAVE A SONG SELECTION INSTEAD OF AN ID

    // Or null
    getSongSelectionForCategory = (category: PredictionCategory): SongSelection | null => {
        // const selected = this.predictionCategories.find(category => category === category)
        const predictionForCategory = this.songPredictions.find((prediction) => {
            return prediction.prediction_category_id === category.id
        })

        if (predictionForCategory === undefined) {
            throw Error(`No predictions exists for category ID ${category.id}`)
        }

        return predictionForCategory.songSelection
    }

    // meh undefined is baaaaad
    // See if you can avoid find

    // getPredictionForCategory = (categoryID: number): => {
    //     return = this.songPredictions.find(prediction => prediction.prediction_category_id === categoryID)
    // }

    onSelect = (songSelection: SongSelection, predictionCategoryID: number): void => {
        debugger;
        // Need to set song
        // I DUNNO WHAT THE HELL IS GOING ON HERE
        // const toUpdate = this.songPredictions.find((prediction: SongPrediction) => ({
        //     prediction.prediction_category_id === predictionCategory.id})
        // )
        // toUpdate.song_id = songSelection.value
    }

    // May be able to combine but this is probably better
    // onSelectFirstSetOpener = (songSelection: SongSelection): void => {
    //     this.setOneOpenerPrediction = songSelection
    // }

    // onSelectFirstSetCloser = (songSelection: SongSelection): void => {
    //     this.setOneCloserPrediction = songSelection
    // }

    // onSelectSecondSetOpener = (songSelection: SongSelection): void => {
    //     this.setTwoOpenerPrediction = songSelection
    // }

    // onSelectSecondSetCloser = (songSelection: SongSelection): void => {
    //     this.setTwoCloserPrediction = songSelection
    // }

    // onSelectEncore = (songSelection: SongSelection): void => {
    //     this.encorePrediction = songSelection
    // }

    submitPrediction = (): void => {
        // TODO: Submit prediction
        // https://trello.com/c/eG0f2Cym/18-api-client-post-put-routes
    }

    private getPredictionSubmission = (): void => {
        // Validate a song has been selected for each category, else raise validation error
        debugger;
        // Returns a ConcertPrediction

    }


    // private setDefaultSongPredictions = async (): Promise<void> => {
    //     this.predictionCategories = await this.predictionsClient.getPredictionCategories()
    //     // Initializes empty predictions for each category; user will select songs
    //     this.songPredictions = this.predictionCategories.map((category) => ({
    //         prediction_category_id: category.id, song_id: null})
    //     )
    // }
}

// NEW DESIGN:
// Pass prediciton category to each dropdown t get label and deal with on select

interface SongDropdownProps {
    // label: string
    selected: SongSelection | null
    songSelections: SongSelection[]
    predictionCategory: PredictionCategory
    onSelect(songSelection: SongSelection, predictionCategoryID: number): void
}

// @observer
class SongDropdown extends React.Component<SongDropdownProps> {
    /**
     * Arg type is "SongSelection" but cast as "any" because React-Select whines
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

        // TODO: move colors to constant
        const labelStyle: Style = {
            marginBottom: 5,
            color: '#F5ED13',
        }

        // const dropdownLabel = <VerticalStack style={labelStyle}>{this.props.label}</VerticalStack>
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

// TODO: moved to shared
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

// interface PredictionFormProps {
//     model: ConcertPredictionModel
//     songSelections: SongSelection[]
// }
interface PredictionFormProps {concertID: number}

@observer
class PredictionsForm extends React.Component<PredictionFormProps> {
    model: ConcertPredictionModel

    constructor(props: PredictionFormProps) {
        super(props)

        this.model = new ConcertPredictionModel(props.concertID)
    }

    async componentDidMount(): Promise<void> {
        await this.model.getSongSelections()
        await this.model.setDefaultPredictions()
    }

    render(): JSX.Element | null {
        // problem is here, return null fixes it
        // const predictionModel = this.model
        // const songSelections = this.model.songPredictions

        if (!this.model.predictionCategories) {
            console.log("null")
            return null
        }
        console.log("Not null")

        // This is gross too many conditionals
        // 2/1/20 THIS IS BREAKING HERE, OBSERVER RETURNED NOTHING FROM RENDER
        const songDropdowns = this.model.predictionCategories.map((predictionCategory) => {
            const selectedSong = this.model.getSongSelectionForCategory(predictionCategory)

            if (!selectedSong) {
                return null
            }

            const songSelection = this.model.songSelections.find(selection => selection.value === selectedSong.value)
            
            if (!songSelection) {
                return null
            }
            // const selectedSong = this.model.getSongSelectionForCategory(predictionCategory)

            // if (songSelection === undefined) {
            //     throw Error(`No song selection found with ID ${selectedSongID}`)
            // }

            // const selected = this.model.getSelectedForCategory(predictionCategory.id, songSelections)

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
                {songDropdowns}
                {/* <SongDropdown
                    songSelections={songSelections}
                    label="First Set Opener"
                    selected={this.model.setOneOpenerPrediction}
                    onSelect={this.model.onSelectFirstSetOpener}
                />
                <SongDropdown
                    songSelections={songSelections}
                    label="First Set Closer"
                    selected={this.model.setOneCloserPrediction}
                    onSelect={this.model.onSelectFirstSetCloser}
                />
                <SongDropdown
                    songSelections={songSelections}
                    label="Second Set Opener"
                    selected={this.model.setTwoOpenerPrediction}
                    onSelect={this.model.onSelectSecondSetOpener}
                />
                <SongDropdown
                    songSelections={songSelections}
                    label="Second Set Closer"
                    selected={this.model.setTwoCloserPrediction}
                    onSelect={this.model.onSelectSecondSetCloser}
                />
                <SongDropdown
                    songSelections={songSelections}
                    label="Encore" selected={
                    this.model.encorePrediction}
                    onSelect={this.model.onSelectEncore}
                /> */}
                <SubmitButton onClick={this.model.submitPrediction}/>
            </VerticalStack>
        )
    }
}

// LOOKS LIKE I NEED A CONCERT PAGE MODEL
class ConcertPageModel {
    @observable concert: Concert | null

    private concertFetcher: APIConcertFetcher

    constructor() {
        this.concert = null
        this.concertFetcher = new APIConcertFetcher()
    }

    async loadConcert(concertID: number): Promise<void> {
        this.concert = await this.concertFetcher.fetchConcert(concertID)
    }
}

interface ConcertPageRouterParams {
    id: string
}

interface ConcertPageProps extends RouteComponentProps<ConcertPageRouterParams> {
    concertID: number
}

@observer
export class ConcertPage extends React.Component<ConcertPageProps> {
    // predictionModel: ConcertPredictionModel
    model: ConcertPageModel
    concertID: number
    // concert: Concert | null
    // private songsModel: SongsModel

    constructor(props: ConcertPageProps) {
        super(props)

        this.concertID = parseInt(this.props.match.params.id, 10)
        this.model = new ConcertPageModel()
        // this.predictionModel = new ConcertPredictionModel(this.concertID)
        // this.songsModel = new SongsModel()
        // this.concertFetcher = new APIConcertFetcher()
        // this.concert = null
    }

    async componentDidMount(): Promise<void> {
        await this.model.loadConcert(this.concertID)

        // console.log("Fetching concert")
        // this.concert = await this.concertFetcher.fetchConcert(this.concertID)
        // await this.songsModel.loadSongs()
        // await this.predictionModel.setDefaultPredictions()
    }

    render(): JSX.Element | null {
        const headerStyle: Style = {
            justifyContent: 'flex-start',
            alignItems: 'center',
        }

        // const songSelections = this.songsModel.getSongSelections()

        // Don't show until concert is loaded
        if (!this.model.concert) {
            return null
        }

        return (
            <VerticalStack>
                <HorizontalStack style={headerStyle}>
                    <BackButtonWithRouter title="Back To Shows"/>
                    <MenuHeader title="My Prediction"/>
                </HorizontalStack>
                <ConcertThumbnail concert={this.model.concert}/>
                {/* <PredictionsForm model={this.predictionModel} songSelections={songSelections}/> */}
                <PredictionsForm concertID={this.model.concert.id}/>
            </VerticalStack>
        )
    }
}
