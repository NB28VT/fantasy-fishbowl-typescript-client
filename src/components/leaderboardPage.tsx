import React from 'react'
import { VerticalStack, Style } from 'utils/styles';
import { MenuHeader } from './shared';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Table } from 'react-bootstrap';

interface UserRanking {
    rank: number
    user_name: string
    score: number
}

interface RankingsResponse {
    tour_name: string
    rankings: UserRanking[]
}

class LeaderboardPageModel {
    @observable isLoading: boolean
    @observable rankings: RankingsResponse | null


    constructor() {
        this.isLoading = false
        this.rankings = null
    }

    loadRankings = (): void => {
        // TODO: need an endpoint for this
        const fakeRankings = {
            tour_name: "Summer 2018",
            "rankings": [
            {rank: 1,
            "user_name": "Kashka8675309",
            score: 555},
            {rank: 2,
            "user_name": "TheBobs1234",
            score: 324},
            {rank: 3,
            "user_name": "RustyShackleford802",
            score: 15}
            ]
        }

        this.isLoading = false
        this.rankings = fakeRankings
    }
}

function LeaderboardRankings(props: {users: UserRanking[]}): JSX.Element {
    const rankedRows = props.users.map(user => {
        return (
            <tr>
                <td>{user.rank}</td>
                <td>{user.user_name}</td>
                <td>{user.score}</td>
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
        this.model.loadRankings()
    }

    render(): JSX.Element {
        const rankingData = this.model.rankings

        if (this.model.isLoading || !rankingData) {
            return <div>Loading</div>
        }

        const header = `${rankingData.tour_name} Rankings`

        const tableStyle: Style = {
            backgroundColor: 'white',
        }

        const containerStyle: Style = {
            paddingBottom:'100%',
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
                    <LeaderboardRankings users={rankingData.rankings}/>
                </Table>
            </VerticalStack>
        )
    }
}
