import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { APIConcertFetcher, Concert } from "services/APIConcertFetcher";
import { VerticalStack } from "utils/styles";

class DemoPredictionModel {
  @observable concert: Concert | null

  private concertFetcher: APIConcertFetcher

  constructor() {
    this.concert = null
    this.concertFetcher = new APIConcertFetcher()
  }

  // Will update when this route is added in the backend
  // async loadLatestConcert(): Promise<void> {
  loadLatestConcert(): void {
    this.concert = this.concertFetcher.fetchLatestConcert()
  }
}

@observer
export default class LatestConcertPredictionPage extends React.Component {
  model: DemoPredictionModel
  concert: Concert | null

  constructor(props: {}) {
    super(props)

    this.model = new DemoPredictionModel()
    this.concert = null
  }

  async componentDidMount(): Promise<void> {
    // TODO: implement when latest concert endpoint is available on the back end
    // this.concert = await this.model.loadLatestConcert()
  }

  render(): JSX.Element {
    return(
      <VerticalStack>
        PLACEHOLDER: Demo Predictions form
        {/* <DemoPredictionsForm concertID={this.concert.id}}/> */}
      </VerticalStack>
    )
  }
}