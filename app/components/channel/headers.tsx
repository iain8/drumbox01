import { h } from 'preact';
import ChannelHeader from './header';

export default ({ ...props }) => (
  <ul className='channel-headers'>
    {
      props.channels.map((name, i) => {
        return (
          <ChannelHeader
            active={ props.active }
            index={ i }
            name={ name }
            onChange={ props.onChange } />
        );
      })
    }
  </ul>
);
