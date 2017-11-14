import { h } from 'preact';

export default ({ down, up, value }) => (
  <div className='tempo'>
    <div className='value'>{ value }</div>
    <div
      className='control increase'
      onClick={ up } />
    <div
      className='control decrease'
      onClick={ down } />
  </div>
)
