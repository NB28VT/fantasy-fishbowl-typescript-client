import React from 'react'

export class ConcertPage extends React.Component<{concertID: number | null}> {
    // TODO: load concert shpw route data here

    // Handle null ID/move over to using React-Router
    render(): JSX.Element {
        const placeholder = `Concert ${this.props.concertID}`
        return <div>{placeholder}</div>
    }
}
