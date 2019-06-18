import React from 'react'
import Select from 'react-select';
import { observable } from 'mobx';
import { Style, VerticalStack } from 'utils/styles';
import { MenuHeader, ConcertThumbnail } from 'components/shared';
import { observer } from 'mobx-react';
import { Concert, APIConcertFetcher } from 'services/APIConcertFetcher';

// DON'T LIKE HOW REACT-SELECT FORCES THIS TYPE (ID AND NAME IS MORE APPROPRIATE FOR SONG)
interface Song {
    value: number
    label: string
}

class ConcertPredictionModel {
    // TODO: form validation on submit or save
    private concertFetcher: APIConcertFetcher

    @observable concert: Concert

    // meh
    @observable setOneOpenerPrediction: Song | null = null
    @observable setOneCloserPrediction: Song | null = null
    @observable setTwoOpenerPrediction: Song | null = null
    @observable setTwoCloserPrediction: Song | null = null
    @observable encorePrediction: Song | null = null

    @observable songList: Song[]
    
    constructor(public concertID: number) {
        // TODO: these will be async on load
        this.concertFetcher = new APIConcertFetcher()
        this.concert = this.concertFetcher.fetchConcert(concertID)

        this.songList = []
    }

    // May be able to combine but this is probably better
    onSelectFirstSetOpener = (song: Song): void => {
        this.setOneOpenerPrediction = song
    }

    onSelectFirstSetCloser = (song: Song): void => {
        this.setOneCloserPrediction = song
    }

    onSelectSecondSetOpener = (song: Song): void => {
        this.setTwoOpenerPrediction = song
    }

    onSelectSecondSetCloser = (song: Song): void => {
        this.setTwoCloserPrediction = song
    }

    onSelectEncore = (song: Song): void => {
        this.encorePrediction = song
    }

    submitPrediction = (): void => {
        console.log("Submitted prediction")
    }
}

interface SongDropdownProps {
    label: string
    selected: Song | null
    onSelect(song: Song): void
}

@observer
class SongDropdown extends React.Component<SongDropdownProps> {
    state = {
        selectedOption: null,
      };

    //TODO: this should get strongly typed, unclear how to do this in current version of react-select. 
    handleChange = (selectedOption: any)   => {
        this.props.onSelect(selectedOption)
    };

    render(): JSX.Element {
        // TODO: remove when actual data is loaded
        const options = [
            {value: 1, label: 'A Song I Heard The Ocean Sing'},
            {value: 2, label: 'Theme From The Bottom'},
            {value: 3, label: 'Waves'},
        ];

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
                    options={options}
                />
            </VerticalStack>
        );
    }
}


interface SubmitButtonProps {
    onClick(): void
}

function SubmitButton(props: SubmitButtonProps): JSX.Element {
    const style: Style = {
        padding: '10px 30px',
        backgroundColor: 'rgba(203, 13, 250, 0.7)',
        borderRadius: '10px',
        alignItems: 'center',
        fontSize: 25,
        fontWeight: 600,

    }

    return <VerticalStack style={style}>Submit</VerticalStack>
}

@observer
class PredictionForm extends React.Component<{model: ConcertPredictionModel}> {
    render(): JSX.Element {
        const model = this.props.model

        return (
            <VerticalStack>
                <SongDropdown label="First Set Opener" selected={model.setOneOpenerPrediction} onSelect={model.onSelectFirstSetOpener}/>
                <SongDropdown label="First Set Closer" selected={model.setOneCloserPrediction} onSelect={model.onSelectFirstSetCloser}/>
                <SongDropdown label="Second Set Opener" selected={model.setTwoOpenerPrediction} onSelect={model.onSelectSecondSetOpener}/>
                <SongDropdown label="Second Set Closer" selected={model.setTwoCloserPrediction} onSelect={model.onSelectSecondSetCloser}/>
                <SongDropdown label="Encore" selected={model.encorePrediction} onSelect={model.onSelectEncore}/>
                <SubmitButton onClick={model.submitPrediction}/>
            </VerticalStack>
        )
    }
}

interface ConcertPageProps {
    concertID: number
}

@observer
export class ConcertPage extends React.Component<ConcertPageProps> {
    model: ConcertPredictionModel
    
    constructor(props: ConcertPageProps) {
        super(props)

        this.model = new ConcertPredictionModel(props.concertID)
    }

    // Handle null ID/move over to using React-Router
    render(): JSX.Element {
        const model = this.model

        return (
            <VerticalStack>
                <MenuHeader title="My Prediction"/>
                <ConcertThumbnail concert={model.concert}/>
                <PredictionForm model={model}/>
            </VerticalStack>
        )
    }
}
