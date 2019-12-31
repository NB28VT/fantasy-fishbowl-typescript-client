import { APIGet } from './RequestClient'

export enum SongsEndpoint {
    allSongs = '/songs',
}

export interface Song {
    id: number
    name: string
}

export interface SongsResponse {
    songs: Song[]
}

export class APISongsFetcher {
    fetchSongs = async(): Promise<Song[]> => {
        const response: SongsResponse = await APIGet(SongsEndpoint.allSongs)
        return response.songs
    }
}
