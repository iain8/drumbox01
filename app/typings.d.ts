declare module "*.json" {
  const value: any;
  export default value;
}

declare const webkitAudioContext: { new (): AudioContext };
