
import { observable } from 'mobx'
import { RouteComponentProps } from 'react-router'
import { APIConcertFetcher, Concert, ConcertListEndpoint } from 'services/APIConcertFetcher'

export class ConcertPageModel {
    @observable concert: Concert | null

    private concertFetcher: APIConcertFetcher

    constructor() {
        this.concert = null
        this.concertFetcher = new APIConcertFetcher()
    }

    async loadConcert(concertID: number): Promise<void> {
        this.concert = await this.concertFetcher.fetchConcert(concertID)
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