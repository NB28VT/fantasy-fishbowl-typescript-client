// TODO: configure tslint for absolute imports
import mockConcertResponse from '../mockData/concert.json'
// Get absolute imports set up
import mockConcertsResponse from '../mockData/concertList.json'
import { APIGet } from './RequestClient'

export enum ConcertListEndpoint {
    upcomingConcerts = '/concerts/upcoming',
    allConcerts = '/concerts',
}

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
    fetchConcerts = async(concertsURL: ConcertListEndpoint): Promise<Concert[]> => {
        const response: ConcertResponse = await APIGet(concertsURL)
        return response.concerts
    }

    fetchConcert = (concertID: number): Concert => {
        return mockConcertResponse
    }
}
