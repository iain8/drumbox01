import { Component, h } from 'preact';

export default class BaseModule extends Component<any, any> {
  public output: AudioNode;

  public render(props: any) : JSX.Element {
    return <div />;
  }

  public connect(node: any) {
    if (node.hasOwnProperty('input')) {
      this.output.connect(node.input);
    } else {
      this.output.connect(node);
    }
  }
}
