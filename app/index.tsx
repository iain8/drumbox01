import { h, render } from 'preact';
import { Provider } from 'preact-redux';
import configureStore from './state/configure-store';
import MainPanel from './components/main-panel';
import './sass/base.scss';

const store = configureStore();

render(
  <Provider store={ store }>
    <MainPanel />
  </Provider>,
  document.getElementById('app'),
);
