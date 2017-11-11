import { h } from 'preact';

export default ({ ...props }) => (
  <select
    className='division'
    onChange={ props.onChange }
    value={ props.division }>
    {
      Object.keys(props.divisions).map((val) => (
        <option value={ val }>
          { props.divisions[val] }
        </option>
      ))
    }
  </select>
);
