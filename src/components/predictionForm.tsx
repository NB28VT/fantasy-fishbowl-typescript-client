import { observable } from 'mobx'

// import React from 'react'
// import {
//     APIPredictionsClient, PredictionCategory, SongPrediction,
// } from 'services/APIPredictionsClient'
// import { APISongsFetcher, Song } from 'services/APISongFetcher'
// import { VerticalStack } from 'utils/styles'

// import { SubmitButton } from './concerts/concertPage'

// interface SongsDropdownOption {
//     value: number
//     label: string
// }


// // TODO: IT THINK THIS SHOULD BE DELETED OR THE IMPLEMENTATION ON CONCERT PAGE IMPLEMENTATION SHOULD BE MOVED HERE

// // Use presenter model for this dropdown option garbage?
// class ConcertPredictionModel {
//     /**
//      * Loads a list of prediction categories (such as "Set One Opener" etc.) and songs a user
//      * can select as their prediction.
//      *
//      * Note: I unfortunately have to keep track of three sets of song data here:
//      * songs: A list of all available songs retrieved from the API
//      * songPredictions: Which songs the user has selected for each category
//      * songsDropdownOptions: this is an array of value, label pairs required by the React-Select dropdown library
//      */

//     @observable predictionCategories: PredictionCategory[]
//     @observable songsDropdownOptions: SongsDropdownOption[]

//     private songPredictions: SongPrediction[]
//     private songs: Song[]
//     private predictionsClient: APIPredictionsClient
//     private songsFetcher: APISongsFetcher

//     constructor(public concertID: number) {
//         this.concertID = concertID

//         this.predictionCategories = []
//         this.songs = []
//         this.songPredictions = []
//         this.songsDropdownOptions = []

//         this.predictionsClient = new APIPredictionsClient()
//         this.songsFetcher = new APISongsFetcher()
//     }

//     preparePredictionOptions = async (): Promise<void> => {
//         this.predictionCategories = await this.predictionsClient.getPredictionCategories()
//         this.songs = await this.songsFetcher.fetchSongs()
//         this.setDefaultPredictions()
//         this.setSongSelections()
//     }

//     submitPrediction = async (): Promise<void> => {
//         // IMPLEMENT
//     }

//     /**
//      * Maps songs returned from the API to a format that can be used by
//      * the React-Select library's dropdown component
//      */
//     private setSongSelections = (): void => {
//          this.songsDropdownOptions = this.songs.map(song => ({value: song.id, label: song.name}))
//     }

//     private setDefaultPredictions = (): void => {
//         this.songPredictions = this.predictionCategories.map((category) => ({
//             prediction_category_id: category.id, song_id: null})
//         )
//     }
// }

// interface SongPredictionsProps {
//     model: ConcertPredictionModel
// }

// class SongPredictions extends React.Component<SongPredictionsProps> {
//     render(): JSX.Element {

//         const songPredictionDropdowns = this.props.model.predictionCategories.map((category) => {
//             return <SongDropdown
//                 selected={this.model.}
//                 songSelections={this.props.songSelections}
//                 predictionCategory={predictionCategory}
//                 onSelect={predictionModel.onSelect}
//             />
//         })

//         return (
//             {songPredictionDropdowns}
//         )
//     }
// }

// interface ConcertPredictionFormProps {
//     concertID: number
// }

// export class ConcertPredictionForm extends React.Component<ConcertPredictionFormProps> {
//     isLoading: boolean
//     predictionCategories: PredictionCategory[] = []
//     private predictionsModel: ConcertPredictionModel

//     constructor(props: ConcertPredictionFormProps) {
//         super(props)

//         this.isLoading = true
//         this.predictionsModel = new ConcertPredictionModel(props.concertID)
//     }

//     async componentDidMount(): Promise<void> {
//         await this.predictionsModel.preparePredictionOptions()
//         this.isLoading = false
//     }

//     render(): JSX.Element | null {
//         if (this.isLoading) {
//             return null
//         }

//         return (
//             <VerticalStack>
//                 <SongPredictions model={this.predictionsModel}/>
//                 <SubmitButton onClick={this.predictionsModel.submitPrediction}/>
//             </VerticalStack>
//         )
//     }
// }