// TODO: configure tslint for absolute imports
// Get absolute imports set up
import mockConcertResponse from '../mockData/concertList.json'

export interface Concert {
    id: number
    show_time: string
    venue_name: string
}

export interface ConcertResponse {
    concerts: Concert[]
}

export class APIConcertFetcher {
    public isLoading: boolean = false


    fetchConcerts = (): Concert[] => {
        this.isLoading = true

        this.isLoading = false
        return mockConcertResponse["concerts"]
    }

}