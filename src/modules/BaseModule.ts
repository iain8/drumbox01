class BaseModule {
	output: AudioNode;
	
	connect(node: any) {
		if (node.hasOwnProperty('input')) {
			this.output.connect(node.input);
		} else {
			this.output.connect(node);
		}
	}
}