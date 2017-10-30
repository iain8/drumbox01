import { Component, h } from 'preact';

class Header extends Component<any, any> {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  public render() {
    return (
      <li key={ this.props.name } class={ this.props.index === this.props.active ? 'active' : '' }>
        <a onClick={ this.handleChange }>{ this.props.name }</a>
      </li>
    );
  }

  private handleChange() {
    this.props.onChange(this.props.index);
  }
}

export default class ChannelHeaders extends Component<any, any> {
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
              <Header 
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
