interface MediaRecorderErrorEventInit extends EventInit {
  error: DOMException;
}

declare class MediaRecorderErrorEvent extends Event {
  constructor(type: string, eventInitDict: MediaRecorderErrorEventInit);
  readonly error: DOMException;
}

interface BlobEventInit extends EventInit {
  data: Blob;
  timecode?: number;
}

declare class BlobEvent extends Event {
  constructor(type: string, eventInitDict: BlobEventInit);
  readonly data: Blob;
  readonly timecode: number;
}

interface MediaRecorderOptions {
  mimeType?: string;
  audioBitsPerSecond?: number;
  videoBitsPerSecond?: number;
  bitsPerSecond?: number;
}

type RecordingState = 'inactive' | 'recording' | 'paused';

declare class MediaRecorder extends EventTarget {
  readonly stream: MediaStream;
  readonly mimeType: string;
  readonly state: RecordingState;
  readonly videoBitsPerSecond: number;
  readonly audioBitsPerSecond: number;

  ondataavailable: (event: BlobEvent) => void;
  onerror: (event: MediaRecorderErrorEvent) => void;
  onpause: EventListener;
  onresume: EventListener;
  onstart: EventListener;
  onstop: EventListener;

  constructor(stream: MediaStream, options?: MediaRecorderOptions);

  start(timeslice?: number): void;
  stop(): void;
  resume(): void;
  pause(): void;
  requestData(): void;

  static isTypeSupported(type: string): boolean;
}

interface Window {
  MediaRecorder: typeof MediaRecorder;
  BlobEvent: typeof BlobEvent;
  MediaRecorderErrorEvent: typeof MediaRecorderErrorEvent;
}
