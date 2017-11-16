import { h } from 'preact';

export default ({ down, up, value }) => (
  <div className='selector'>
    <div className='value'>{ value }</div>
    <div
      className='control increase'
      onClick={ up } />
    <div
      className='control decrease'
      onClick={ down } />
  </div>
)
