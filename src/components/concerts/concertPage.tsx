import { ConcertThumbnail, MenuHeader, BackButtonWithRouter } from 'components/shared';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import Select from 'react-select';
import { APIConcertFetcher, Concert } from 'services/APIConcertFetcher';
import { HorizontalStack, Style, VerticalStack } from 'utils/styles';
import { RouteComponentProps } from 'react-router';
import { APISongsFetcher, Song } from 'services/APISongFetcher';

// This is a very unfortunate intermediate step between the Song type and the value, label pairing React-select requires
// Songs loaded from the API must be cast in this manner
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
}

class ConcertPredictionModel {
    // TODO: form validation on submit or save
    private concertFetcher: APIConcertFetcher

    @observable concert: Concert

    // meh
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
        console.log("Submitted prediction")
    }
}

interface SongDropdownProps {
    label: string
    selected: SongSelection | null
    songs: Song[]
    onSelect(songSelection: SongSelection): void
}

@observer
class SongDropdown extends React.Component<SongDropdownProps> {
    //TODO: this should get strongly typed, unclear how to do this in current version of react-select. 
    handleChange = (selectedOption: any)   => {
        this.props.onSelect(selectedOption)
    };

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
        // Maps songs returned from API to the format React-Select expects
        const dropdownOptions = this.props.songs.map(song=>({value: song.id, label: song.name}))
        return (
            <VerticalStack style={style}>
                {dropdownLabel}
                <Select
                    value={this.props.selected}
                    onChange={this.handleChange}
                    options={dropdownOptions}
                />
            </VerticalStack>
        );
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
    songs: Song[]
}

@observer
class PredictionForm extends React.Component<PredictionFormProps> {
    render(): JSX.Element {
        const predictionModel = this.props.model
        const songs = this.props.songs
        return (
            <VerticalStack>
                <SongDropdown songs={songs} label="First Set Opener" selected={predictionModel.setOneOpenerPrediction} onSelect={predictionModel.onSelectFirstSetOpener}/>
                <SongDropdown songs={songs} label="First Set Closer" selected={predictionModel.setOneCloserPrediction} onSelect={predictionModel.onSelectFirstSetCloser}/>
                <SongDropdown songs={songs} label="Second Set Opener" selected={predictionModel.setTwoOpenerPrediction} onSelect={predictionModel.onSelectSecondSetOpener}/>
                <SongDropdown songs={songs} label="Second Set Closer" selected={predictionModel.setTwoCloserPrediction} onSelect={predictionModel.onSelectSecondSetCloser}/>
                <SongDropdown songs={songs} label="Encore" selected={predictionModel.encorePrediction} onSelect={predictionModel.onSelectEncore}/>
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

        return (
            <VerticalStack>
                <HorizontalStack style={headerStyle}>
                    <BackButtonWithRouter title="Back To Shows"/>
                    <MenuHeader title="My Prediction"/>
                </HorizontalStack>
                <ConcertThumbnail concert={this.predictionModel.concert}/>
                <PredictionForm model={this.predictionModel} songs={this.songsModel.songs}/>
            </VerticalStack>
        )
    }
}
