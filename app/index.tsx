import { h, render } from 'preact';
import MainPanel from './components/main-panel';
import './sass/base.scss';

render(
  <MainPanel />,
  document.getElementById('app'),
);
