import { observable } from 'mobx'
import {
    APIPredictionsClient, ConcertPredictionParams, PredictionCategory, SongSelection,
} from 'services/APIPredictionsClient'
import { APISongsFetcher } from 'services/APISongFetcher'
import { ToastService } from 'services/ToastService'

export class CategoryPredictionModel {
    @observable displayed: SongSelection | null
    @observable saved: SongSelection | null

    category: PredictionCategory

    constructor(category: PredictionCategory, displayed: SongSelection | null, saved: SongSelection | null) {
        this.category = category
        this.displayed = displayed
        this.saved = saved
    }

    // Cast as "any" for now; problems with React Select
    onChangeSelection = (selectedSong: any) => {
        this.displayed = selectedSong
    }

    onSaveSelection = () => {
        this.saved = this.displayed
    }

    isValidPrediction = (): boolean => {
        return !!(this.saved)
    }
}

export class ConcertPredictionModel {
    @observable isLoaded: boolean
    @observable displayValidations: boolean
    @observable categoryPredictionModels: CategoryPredictionModel[]
    @observable songSelections: SongSelection[]

    // Dependency injection
    constructor(
        private predictionsClient: APIPredictionsClient,
        private songsFetcher: APISongsFetcher,
        private toastService: ToastService,
        private concertID: number,
    ) {
        this.isLoaded = false
        this.displayValidations = false
        this.categoryPredictionModels = []
        this.songSelections = []
    }

    loadPredictionSelections = async (): Promise<void> => {
        await this.getSongSelections()
        await this.setPredictions()

        this.isLoaded = true
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
    setPredictions = async (): Promise<void> => {
        const predictionCategories = await this.predictionsClient.getPredictionCategories()
        // TODO: this is where we load existing predictions so they can be edited
        // https://trello.com/c/UQI9aPNp/5-pages-load-and-edit-existing-prediction
        this.categoryPredictionModels = predictionCategories.map((category) => {
            return new CategoryPredictionModel(category, null, null)
        })
    }

    onPredictionSubmit = async (): Promise<void> => {
        this.displayValidations = false
        if (this.isValidPrediction()) {
            try {
                await this.submitPrediction()
                // TODO: Display Submitted Prediction on successful submission
                // https://trello.com/c/UQI9aPNp/5-pages-load-and-edit-existing-prediction
                alert('Prediction submitted')
            } catch (e) {
                this.toastService.displayError('There was a problem submitting your subscription')
            }
        } else {
            this.displayValidations = true
            this.toastService.displayError('You must select a song for each category')
        }
    }

    private submitPrediction = async (): Promise<void> => {
        const predictionSubmission = this.buildPredictionSubmission()

        await this.predictionsClient.submitPrediction(predictionSubmission, this.concertID)

    }

    private buildPredictionSubmission = (): ConcertPredictionParams => {
        const predictionAttributes = this.categoryPredictionModels.map((predictionModel: CategoryPredictionModel) => {
            if (!predictionModel.saved) {
                throw Error(`Prediction submitted without songSelection ${predictionModel.category}`)
            }
            return {
                song_id: predictionModel.saved.value,
                prediction_category_id: predictionModel.category.id,
            }
        })
        return {
            concert_id: this.concertID,
            concert_prediction: {song_predictions_attributes: predictionAttributes},
        }

    }

    private isValidPrediction = (): boolean => {
        return this.categoryPredictionModels.every((model => model.isValidPrediction()))
    }
}
