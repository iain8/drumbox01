import { Component, h } from 'preact';

export default class Beat extends Component<any, any> {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  public render() {
    return <li class={ `beat ${this.props.on ? 'on' : ''}` } onClick={ this.handleClick } />;
  }

  private handleClick() {
    this.props.onClick(this.props.index);
  }
}
