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

class ConcertPredictionModel {
    @observable songPredictions: SongPrediction[]
    @observable songSelections: SongSelection[]
    @observable predictionCategories: PredictionCategory[]

    private isValidPrediction: boolean
    private predictionsClient: APIPredictionsClient
    private songsFetcher: APISongsFetcher

    constructor(public concertID: number) {
        this.predictionsClient = new APIPredictionsClient()
        this.songsFetcher = new APISongsFetcher()

        this.isValidPrediction = false

        this.predictionCategories = []
        this.songPredictions = []
        this.songSelections = []
    }

    /**
     * Maps songs returned from the API to a format that can be used by
     * the React-Select library's dropdown component
     */
    getSongSelections = async (): Promise<void> => {
        const songs = await this.songsFetcher.fetchSongs()
        this.songSelections = songs.map(song => ({value: song.id, label: song.name}))
    }

    // TODO: update promises to include rejections
    // https://blog.bitsrc.io/keep-your-promises-in-typescript-using-async-await-7bdc57041308
    setDefaultPredictions = async (): Promise<void> => {
        this.predictionCategories = await this.predictionsClient.getPredictionCategories()
        this.songPredictions = this.predictionCategories.map((category) => ({
            prediction_category_id: category.id, songSelection: null})
        )
    }

    getSongSelectionForCategory = (category: PredictionCategory): SongSelection | null => {
        const predictionForCategory = this.songPredictions.find((prediction) => {
            return prediction.prediction_category_id === category.id
        })

        if (predictionForCategory === undefined) {
            return null
        }

        return predictionForCategory.songSelection
    }

    onSelect = (songSelection: SongSelection, predictionCategoryID: number): void => {
        const predictionForCategory = this.songPredictions.find((prediction: SongPrediction) => (
            prediction.prediction_category_id === predictionCategoryID)
        )
        if (!predictionForCategory) {
            throw Error(`No default prediction set for ${predictionCategoryID}`)
        }

        predictionForCategory.songSelection = songSelection
    }

    submitPrediction = (): void => {
        // TODO: Validate all categories have a selection
        this.validateSelectionForAllCategories()
        // TODO: Submit prediction
        // https://trello.com/c/eG0f2Cym/18-api-client-post-put-routes
    }

    private validateSelectionForAllCategories = (): void => {
        this.isValidPrediction =  this.songPredictions.every(prediction => prediction.songSelection !== null)
    }
}


interface SongDropdownProps {
    selected: SongSelection | null
    songSelections: SongSelection[]
    predictionCategory: PredictionCategory
    onSelect(songSelection: SongSelection, predictionCategoryID: number): void
}

@observer
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

// TODO: move to shared
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
        const headerStyle: Style = {
            justifyContent: 'flex-start',
            alignItems: 'center',
        }

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
                <PredictionsForm concertID={this.model.concert.id}/>
            </VerticalStack>
        )
    }
}
