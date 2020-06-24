import { APIGet } from './RequestClient'

export enum ConcertListEndpoint {
    upcomingConcerts = '/concerts/upcoming',
    allConcerts = '/concerts',
}

export enum ConcertEndpoint {
    concert = '/concerts/',
}

export interface Concert {
    id: number
    show_time: string
    venue_name: string
    venue_image_src: string
}

export interface ConcertsResponse {
    concerts: Concert[]
}

export interface ConcertResponse {
    concert: Concert
}

export class APIConcertFetcher {
    fetchConcerts = async (concertsURL: ConcertListEndpoint): Promise<Concert[]> => {
        const response: ConcertsResponse = await APIGet(concertsURL)
        return response.concerts
    }

    fetchConcert = async (concertURL: string): Promise<Concert> => {
        const response: ConcertResponse = await APIGet(concertURL)
        return response.concert
    }
}
