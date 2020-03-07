import { APIGet, APIPost } from './RequestClient'

enum PredictionsEndpoints {
    prediction_categories = '/prediction_categories',
}

export interface PredictionCategoriesResponse {
    prediction_categories: PredictionCategory[]
}

export interface PredictionCategory {
    id: number
    name: string
    set_number: number
    setlist_position: number
}

export interface ConcertPredictionParams {
    concert_id: number
    concert_prediction: ConcertPredictionSubmission
}

interface ConcertPrediction {
    id?: number
    song_predictions: SongPrediction[]
}

interface ConcertPredictionSubmission {
    song_predictions_attributes: SongPredictionSubmission[] | []
}

// Song formatted for React-Select dropdown
export interface SongSelection {
    value: number
    label: string
}

export interface SongPrediction {
    songSelection: SongSelection | null
    predictionCategoryID: number
}

// SongPrediction serialized for the backend
interface SongPredictionSubmission {
    song_id: number
    prediction_category_id: number
}

// For the update route
interface SongPredictionUpdate extends SongPrediction {
    id: number
}

interface SubmitPredictionResponse {
    concert_prediction: ConcertPrediction
}

export class APIPredictionsClient {
    constructor(public authToken: string) {}

    submitPrediction = async (
        predictionParams: ConcertPredictionParams, concertID: number): Promise<SubmitPredictionResponse> => {
        const url = `/concerts/${concertID}/predictions`
        return APIPost(url, predictionParams, this.authToken)
    }

    getPredictionCategories = async (): Promise<PredictionCategory[]> => {
        const response = await APIGet<PredictionCategoriesResponse>(PredictionsEndpoints.prediction_categories)
        return response.prediction_categories
    }
}
