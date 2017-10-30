import { Component, h } from 'preact';

export default class Division extends Component<any, any> {
  render() {
    return (
      <select class='division' onChange={ this.props.onChange }>
        {
          Object.keys(this.props.divisions).map((val) => {
            return (
              // TODO: fix selected
              <option value={ val } selected={ val === this.props.division }>
                { this.props.divisions[val] }
              </option>
            );
          })
        }
      </select>
    );
  }
}
