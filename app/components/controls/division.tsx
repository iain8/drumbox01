import { Component, h } from 'preact';

export default class Division extends Component<any, any> {
  render(props) {
    const { division, divisions, onChange } = props;

    return (
      <select
        class='division'
        onChange={ onChange }
        value={ division }>
        {
          Object.keys(divisions).map((val) => {
            return (
              <option value={ val }>
                { divisions[val] }
              </option>
            );
          })
        }
      </select>
    );
  }
}
