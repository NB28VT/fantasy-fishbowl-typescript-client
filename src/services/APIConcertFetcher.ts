// TODO: configure tslint for absolute imports
// Get absolute imports set up
import mockConcertsResponse from '../mockData/concertList.json'
import mockConcertResponse from '../mockData/concert.json'

// TODO: FLESH OUT THE SET DATA
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
        return mockConcertsResponse["concerts"]
    }

    fetchConcert = (concertID: number): Concert => {
        this.isLoading = true

        this.isLoading = false        
        return mockConcertResponse
    }
}