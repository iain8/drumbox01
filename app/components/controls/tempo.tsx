import { Component, h } from 'preact';

export default class Tempo extends Component<any, any> {
  public render(props) {
    return (
      <div className='tempo'>
        <div className='value'>{ props.tempo }</div>
        <div
          className='control increase'
          onClick={ () => props.onClick(props.tempo + 1) } />
        <div
          className='control decrease'
          onClick={ () => props.onClick(props.tempo - 1) } />
      </div>
    );
  }
}