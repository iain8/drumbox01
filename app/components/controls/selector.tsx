import { Component, h } from 'preact';

interface ISelectorProps {
  onNext: () => void;
  onPrev: () => void;
  options: string[];
  selected: any;
}

export default class Selector extends Component<ISelectorProps, any> {
  constructor(props: ISelectorProps) {
    super(props);

    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePrevClick = this.handlePrevClick.bind(this);
  }

  public render(props: ISelectorProps) {
    const { options, selected } = props;

    return (
      <div class='selector'>
        <a onClick={ this.handlePrevClick } class='prev'></a>
        <ul>
          {
            options.map((option) => {
              return (
                <li class={ selected === option ? 'active' : '' }>
                  { option }
                </li>
              );
            })
          }
        </ul>
        <a onClick={ this.handleNextClick } class='next'></a>
      </div>
    );
  }

  private handlePrevClick() {
    this.props.onPrev();
  }

  private handleNextClick() {
    this.props.onNext();
  }
}
