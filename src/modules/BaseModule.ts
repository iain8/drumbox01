/**
 * Base module class that defines the minimum to be a connectable module
 */
export default class BaseModule {
  public output: AudioNode;

  /**
   * Connect a node depending on i/o configuration
   */
  public connect(node: any) {
    if (node.hasOwnProperty('input')) {
      this.output.connect(node.input);
    } else {
      this.output.connect(node);
    }
  }
}
