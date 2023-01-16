import { ButtonStandard, Logo } from 'components/shared'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Style, VerticalStack } from 'utils/styles'

const DemoInstructions = (): JSX.Element => {
  const styles: Style = {
    fontSize: 18,
    margin: "0 5vw",
  }

  return(
    <VerticalStack style={styles}>
      <p>
        Fantasy Fishbowl is a fantasy sports-style prediction game for forecasting songs the band Phish will play in an upcoming concert, and where those songs will sit in the setlist. 
      </p>
      <p>
        For each concert, players predict a song for each category - for example, the first song of the first set. Players are awarded one point if the song is played by the band that night, and three points if they correctly guessed where the song will sit in the setlist.
      </p>
      <p>
        Click the start button below to try and retroactively guess the setlist of the band's most recent show (no peaking!)
      </p>

      
    </VerticalStack>
  )
}

interface DemoStartPageProps extends RouteComponentProps<any> {}

export default class DemoStartPage extends React.Component<DemoStartPageProps> {
  constructor(props: DemoStartPageProps) {
    super(props)
  }

  render(): JSX.Element {
    const onStartDemo = (): void => {
      this.props.history.push('/demo/prediction')
    }

    return (
      <VerticalStack>
        <Logo/>
        <DemoInstructions/>
          <ButtonStandard onClick={onStartDemo}>
            Play
          </ButtonStandard>
      </VerticalStack>
    )
  }
}
