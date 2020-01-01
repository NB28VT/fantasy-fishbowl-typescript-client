import { BackButtonWithRouter, ConcertThumbnail, MenuHeader } from 'components/shared'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import Select from 'react-select'
import { APIConcertFetcher, Concert } from 'services/APIConcertFetcher'
import { APISongsFetcher, Song } from 'services/APISongFetcher'
import { HorizontalStack, Style, VerticalStack } from 'utils/styles'

// Song id and name with the properties a React-Select dropdown expects
interface SongSelection {
    value: number
    label: string
}

class SongsModel {
    @observable songs: Song[]
    @observable isLoading: boolean
    songsFetcher: APISongsFetcher

    constructor() {
        this.isLoading = true
        this.songs = []
        this.songsFetcher = new APISongsFetcher()
    }

    loadSongs = async(): Promise<void> => {
        this.songs = await this.songsFetcher.fetchSongs()
        this.isLoading = false
    }

    /**
     * Maps songs returned from the API to a format that can be used by
     * the React-Select library's dropdown component
     */
    getSongSelections = (): SongSelection[] => {
        return this.songs.map(song => ({value: song.id, label: song.name}))
    }
}

class ConcertPredictionModel {
    // TODO: form validation on submit or save
    private concertFetcher: APIConcertFetcher

    @observable concert: Concert
    @observable setOneOpenerPrediction: SongSelection | null = null
    @observable setOneCloserPrediction: SongSelection | null = null
    @observable setTwoOpenerPrediction: SongSelection | null = null
    @observable setTwoCloserPrediction: SongSelection | null = null
    @observable encorePrediction: SongSelection | null = null

    constructor(public concertID: number) {
        this.concertFetcher = new APIConcertFetcher()
        this.concert = this.concertFetcher.fetchConcert(concertID)
    }

    // May be able to combine but this is probably better
    onSelectFirstSetOpener = (songSelection: SongSelection): void => {
        this.setOneOpenerPrediction = songSelection
    }

    onSelectFirstSetCloser = (songSelection: SongSelection): void => {
        this.setOneCloserPrediction = songSelection
    }

    onSelectSecondSetOpener = (songSelection: SongSelection): void => {
        this.setTwoOpenerPrediction = songSelection
    }

    onSelectSecondSetCloser = (songSelection: SongSelection): void => {
        this.setTwoCloserPrediction = songSelection
    }

    onSelectEncore = (songSelection: SongSelection): void => {
        this.encorePrediction = songSelection
    }

    submitPrediction = (): void => {
        console.log('Submitted prediction')
    }
}

interface SongDropdownProps {
    label: string
    selected: SongSelection | null
    songSelections: SongSelection[]
    onSelect(songSelection: SongSelection): void
}

@observer
class SongDropdown extends React.Component<SongDropdownProps> {
    /**
     * Arg type is "SongSelection" but cast as "any" because React-Select whines
     * prefer this to jumping through hoops with the typing for React-Select's benefit
     */
    handleChange = (selectedOption: any)   => {
        this.props.onSelect(selectedOption)
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

        const dropdownLabel = <VerticalStack style={labelStyle}>{this.props.label}</VerticalStack>
        return (
            <VerticalStack style={style}>
                {dropdownLabel}
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

interface PredictionFormProps {
    model: ConcertPredictionModel
    songSelections: SongSelection[]
}

@observer
class PredictionForm extends React.Component<PredictionFormProps> {
    render(): JSX.Element {
        const predictionModel = this.props.model
        const songSelections = this.props.songSelections
        return (
            <VerticalStack>
                <SongDropdown songSelections={songSelections} label="First Set Opener" selected={predictionModel.setOneOpenerPrediction} onSelect={predictionModel.onSelectFirstSetOpener}/>
                <SongDropdown songSelections={songSelections} label="First Set Closer" selected={predictionModel.setOneCloserPrediction} onSelect={predictionModel.onSelectFirstSetCloser}/>
                <SongDropdown songSelections={songSelections} label="Second Set Opener" selected={predictionModel.setTwoOpenerPrediction} onSelect={predictionModel.onSelectSecondSetOpener}/>
                <SongDropdown songSelections={songSelections} label="Second Set Closer" selected={predictionModel.setTwoCloserPrediction} onSelect={predictionModel.onSelectSecondSetCloser}/>
                <SongDropdown songSelections={songSelections} label="Encore" selected={predictionModel.encorePrediction} onSelect={predictionModel.onSelectEncore}/>
                <SubmitButton onClick={predictionModel.submitPrediction}/>
            </VerticalStack>
        )
    }
}

type ConcertPageRouterParams = {id: string}

interface ConcertPageProps extends RouteComponentProps<ConcertPageRouterParams> {
    concertID: number
}

@observer
export class ConcertPage extends React.Component<ConcertPageProps> {
    predictionModel: ConcertPredictionModel
    private songsModel: SongsModel

    constructor(props: ConcertPageProps) {
        super(props)

        const concertID = parseInt(this.props.match.params.id)
        this.predictionModel = new ConcertPredictionModel(concertID)
        this.songsModel = new SongsModel()
    }

    async componentDidMount() {
        await this.songsModel.loadSongs()
    }

    render(): JSX.Element {
        const headerStyle: Style = {
            justifyContent: 'flex-start',
            alignItems: 'center',
        }

        const songSelections = this.songsModel.getSongSelections()

        return (
            <VerticalStack>
                <HorizontalStack style={headerStyle}>
                    <BackButtonWithRouter title="Back To Shows"/>
                    <MenuHeader title="My Prediction"/>
                </HorizontalStack>
                <ConcertThumbnail concert={this.predictionModel.concert}/>
                <PredictionForm model={this.predictionModel} songSelections={songSelections}/>
            </VerticalStack>
        )
    }
}
