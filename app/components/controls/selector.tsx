import { Component, h } from 'preact';

interface ISelectorProps {
  onChange: Function,
  options: {};
  selected: any;
}

export default class Selector extends Component<ISelectorProps, any> {
  constructor(props) {
    super(props);

    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePrevClick = this.handlePrevClick.bind(this);
  }

  public render() {
    return (
      <div class="selector">
        <a onClick={ this.handlePrevClick } class="prev"></a>
        <ul>
          {
            Object.keys(this.props.options).map((key) => {
              return (
                <li class={ this.props.selected === key ? 'active' : '' }>
                  { this.props.options[key] }
                </li>
              );
            })
          }
        </ul>
        <a onClick={ this.handleNextClick } class="next"></a>
      </div>
    );
  }

  private handlePrevClick() {

  }

  private handleNextClick() {

  }
}
