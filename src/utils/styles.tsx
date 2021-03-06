import React, { ReactChild } from 'react'

export type Style = React.CSSProperties

export interface StyleMap { [name: string]: Style }

interface StackProps {
    children?: ReactChild | ReactChild[]
    style?: Style
    onClick?(): void
}

export function VerticalStack(props: StackProps): JSX.Element {
    const style = Object.assign({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
    }, props.style)

    return <div style={style} onClick={props.onClick}>{props.children}</div>
}

export function HorizontalStack(props: StackProps): JSX.Element {
    const style = Object.assign({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
    }, props.style)

    return <div style={style} onClick={props.onClick}>{props.children}</div>
}
