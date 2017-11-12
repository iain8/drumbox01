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

  public render(props) {
    const { active, index, name } = props;

    return (
      <li
        class={ index === active ? 'active' : '' }
        key={ name }>
        <a onClick={ this.handleChange }>
          { name }
        </a>
      </li>
    );
  }

  private handleChange() {
    this.props.onChange(this.props.index);
  }
}
