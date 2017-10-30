import { Component, h } from 'preact';

interface IChannelHeaderProps {
  active: number;
  index: number;
  name: string;
  onChange: (index: number) => void;
}

export default class ChannelHeader extends Component<IChannelHeaderProps, any> {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  public render() {
    return (
      <li
        class={ this.props.index === this.props.active ? 'active' : '' }
        key={ this.props.name }>
        <a onClick={ this.handleChange }>
          { this.props.name }
        </a>
      </li>
    );
  }

  private handleChange() {
    this.props.onChange(this.props.index);
  }
}
