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
    concert_prediction: ConcertPrediction
}

interface ConcertPrediction {
    id?: number
    song_predictions: SongPrediction[]
}

// Song formatted for React-Select dropdown
export interface SongSelection {
    value: number
    label: string
}

export interface SongPrediction {
    // song_id: number | null
    songSelection: SongSelection | null
    // Could use enum here but prefer frontend doesn't know about it
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
    submitPrediction = async (predictionParams: ConcertPredictionParams): Promise<SubmitPredictionResponse> => {
        // TODO: see if you can get this into an enum?
        // try and catch error handling? (Let model do this?)
        const url = `/concerts/${predictionParams.concert_id}/predictions`
        return APIPost(url, predictionParams.concert_prediction)
    }

    getPredictionCategories = async (): Promise<PredictionCategory[]> => {
        // TODO: try catch
        const response = await APIGet<PredictionCategoriesResponse>(PredictionsEndpoints.prediction_categories)
        return response.prediction_categories
    }
}
