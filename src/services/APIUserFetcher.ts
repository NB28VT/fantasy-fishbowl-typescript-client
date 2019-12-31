import { APIGet } from './RequestClient'

export enum UsersEndpoint {
    userRankings = '/users/prediction_rankings',
}

export interface UserRanking {
    name: string
    total_score: number
}

export interface LeaderboardResponse {
    users: UserRanking[]
}

export class APIUserFetcher {
    fetchLeaderBoard =  async(): Promise<UserRanking[]> => {
        const response: LeaderboardResponse = await APIGet(UsersEndpoint.userRankings)
        return response.users
    }
}
