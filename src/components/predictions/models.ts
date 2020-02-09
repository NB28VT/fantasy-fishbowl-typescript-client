import { observable } from 'mobx'
import { toast } from 'react-toastify'
import {
    APIPredictionsClient, ConcertPredictionParams, PredictionCategory, SongPrediction,
    SongSelection,
} from 'services/APIPredictionsClient'
import { APISongsFetcher } from 'services/APISongFetcher'

export class ConcertPredictionModel {
    @observable songPredictions: SongPrediction[]
    @observable songSelections: SongSelection[]
    @observable predictionCategories: PredictionCategory[]

    private isCompletePrediction: boolean
    private predictionsClient: APIPredictionsClient
    private songsFetcher: APISongsFetcher

    constructor(public concertID: number, public token: string) {
        this.predictionsClient = new APIPredictionsClient(token)
        this.songsFetcher = new APISongsFetcher()

        this.isCompletePrediction = false

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
            predictionCategoryID: category.id, songSelection: null})
        )
    }

    getSongSelectionForCategory = (category: PredictionCategory): SongSelection | null => {
        const predictionForCategory = this.songPredictions.find((prediction) => {
            return prediction.predictionCategoryID === category.id
        })

        if (predictionForCategory === undefined) {
            return null
        }

        return predictionForCategory.songSelection
    }

    onSelect = (songSelection: SongSelection, predictionCategoryID: number): void => {
        const predictionForCategory = this.songPredictions.find((prediction: SongPrediction) => (
            prediction.predictionCategoryID === predictionCategoryID)
        )
        if (!predictionForCategory) {
            throw Error(`No default prediction set for ${predictionCategoryID}`)
        }

        predictionForCategory.songSelection = songSelection
    }

    submitPrediction = async (): Promise<void> => {
        this.validateSelectionForAllCategories()
        if (!this.isCompletePrediction) {
            toast.error('You must select a song for each category', {
                hideProgressBar: true,
                closeOnClick: true,
            })
        } else {
            // TODO: Display Submitted Prediction
            // https://trello.com/c/UQI9aPNp/5-pages-load-and-edit-existing-prediction
            await this.predictionsClient.submitPrediction(this.predictionSubmission())
        }
    }

    private validateSelectionForAllCategories = (): void => {
        this.isCompletePrediction =  this.songPredictions.every(prediction => prediction.songSelection !== null)
    }

    private predictionSubmission = (): ConcertPredictionParams => {
        return {
            concert_id: this.concertID,
            concert_prediction: {
                song_predictions: this.songPredictions,
            },
        }
    }
}
