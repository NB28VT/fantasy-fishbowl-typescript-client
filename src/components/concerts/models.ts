
import { observable } from 'mobx'
import {
    APIConcertFetcher, Concert, ConcertEndpoint, ConcertListEndpoint,
} from 'services/APIConcertFetcher'

export class ConcertPageModel {
    @observable concert: Concert | null
    private concertURL: ConcertEndpoint = ConcertEndpoint.concert

    private concertFetcher: APIConcertFetcher

    constructor() {
        this.concert = null
        this.concertFetcher = new APIConcertFetcher()
    }

    async loadConcert(concertID: number): Promise<void> {
        const url = this.concertURL + concertID
        this.concert = await this.concertFetcher.fetchConcert(url)
    }
}

export class ConcertsModel {
    @observable isLoading: boolean
    @observable concertList: Concert[]
    private concertFetcher: APIConcertFetcher

    constructor() {
        this.isLoading = true
        this.concertFetcher = new APIConcertFetcher()
        this.concertList = []
    }

    loadConcerts = async (concertsUrl: ConcertListEndpoint): Promise<void> => {
        this.concertList = await this.concertFetcher.fetchConcerts(concertsUrl)
        this.isLoading = false
    }
}
