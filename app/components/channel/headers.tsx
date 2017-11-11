import { Component, h } from 'preact';
import ChannelHeader from './header';

interface IChannelHeadersProps {
  active: number;
  data: any[]; // TODO: channel def
  onChange: (index: number) => void;
}

export default class ChannelHeaders extends Component<IChannelHeadersProps, any> {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  public render() {
    return (
      <ul class='channel-headers'>
        {
          this.props.data.map((channel, i) => {
            return (
              <ChannelHeader
                active={ this.props.active }
                index={ i }
                name={ channel.name }
                onChange={ this.handleChange } />
            );
          })
        }
      </ul>
    );
  }

  private handleChange(index: number) {
    this.props.onChange(index);
  }
}
