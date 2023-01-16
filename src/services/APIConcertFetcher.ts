import { APIGet } from './RequestClient'
import demoVenueImage from 'images/alpharetta-venue-image.jpg'

export enum ConcertListEndpoint {
    upcomingConcerts = '/concerts/upcoming',
    allConcerts = '/concerts',
    latestConcert = '/concerts/latest',
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

    // Temporary; will become an async fetch call when a most recent concert endpoint is implemented
    fetchLatestConcert = (): Concert => {
        return(
            {
                id: 345,
                show_time: "12/31/22",
                venue_name: "Madison Square Garden",
                venue_image_src: demoVenueImage,
            }
        )
    }
}
