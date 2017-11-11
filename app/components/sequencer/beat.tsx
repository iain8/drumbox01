import { Component, h } from 'preact';

interface IBeatProps {
  index: number;
  on: boolean;
  onClick: (beatIndex: number) => void;
}

export default class Beat extends Component<IBeatProps, any> {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  public render(props) {
    return <li class={ `beat ${props.on ? 'on' : ''}` } onClick={ this.handleClick } />;
  }

  private handleClick() {
    this.props.onClick(this.props.index);
  }
}
