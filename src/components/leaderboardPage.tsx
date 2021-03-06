import { observable } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { Table } from 'react-bootstrap'
import { Style, VerticalStack } from 'utils/styles'

import { APIUserFetcher, UserRanking } from '../services/APIUserFetcher'
import { MenuHeader } from './shared'

class LeaderboardPageModel {
    @observable isLoading: boolean
    @observable rankings: UserRanking[]
    private userFetcher: APIUserFetcher

    constructor() {
        this.isLoading = false
        this.rankings = []

        this.userFetcher = new APIUserFetcher()
    }

    loadRankings = async (): Promise<void> => {
        this.rankings  = await this.userFetcher.fetchLeaderBoard()
        this.isLoading = false
    }
}

function LeaderboardRankings(props: {users: UserRanking[]}): JSX.Element {
    const rankedRows = props.users.map((user, index) => {
        return (
            <tr>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.total_score}</td>
            </tr>
        )
    })

    return <tbody>{rankedRows}</tbody>
}

@observer
export class LeaderboardPage extends React.Component<{}> {
    model: LeaderboardPageModel

    constructor(props: {}) {
        super(props)

        this.model = new LeaderboardPageModel()
    }

    async componentDidMount(): Promise<void> {
        this.model.loadRankings()
    }

    render(): JSX.Element {
        const rankingData = this.model.rankings

        if (this.model.isLoading) {
            return <div>Loading</div>
        }

        if (!rankingData) {
            return <div>No users!</div>
        }

        // TODO: ADD TOUR NAME TO RANKINGS ENDPOINT
        // https://trello.com/c/C4qSzIrU/30-add-tour-model
        const header = 'Summer 2018 Rankings'

        const tableStyle: Style = {
            backgroundColor: 'white',
        }

        const containerStyle: Style = {
            paddingBottom: '100%',
        }

        return (
            <VerticalStack style={containerStyle}>
                <MenuHeader title={header}/>
                <Table striped bordered style={tableStyle}>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Points Total</th>
                        </tr>
                    </thead>
                    <LeaderboardRankings users={this.model.rankings}/>
                </Table>
            </VerticalStack>
        )
    }
}
