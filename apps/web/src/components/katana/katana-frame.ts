export type KatanaFrame = { progress: number; width: number; height: number };
export type KatanaFrameSink = React.RefObject<((frame: KatanaFrame) => void) | null>;
