import { h } from 'preact';
import ChannelHeader from './header';

export default ({ ...props }) => (
  <ul className='channel-headers'>
    {
      props.data.map((channel, i) => {
        return (
          <ChannelHeader
            active={ props.active }
            index={ i }
            name={ channel.name }
            onChange={ props.onChange } />
        );
      })
    }
  </ul>
);
