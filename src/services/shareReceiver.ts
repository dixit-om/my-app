import { registerPlugin } from '@capacitor/core';

export type SharedPayload = {
  text?: string;
  subject?: string;
};

export interface ShareReceiverPlugin {
  /**
   * Returns any pending shared payload from a cold start (where the OS launched
   * the app via ACTION_SEND). Single-consume: subsequent calls return an empty
   * object until a new share arrives.
   */
  getPendingShare(): Promise<SharedPayload>;

  /**
   * Listen for shares that arrive while the app is already running (warm start).
   * The native side fires "shareReceived" after handling onNewIntent.
   */
  addListener(
    eventName: 'shareReceived',
    listener: (payload: SharedPayload) => void
  ): Promise<{ remove: () => Promise<void> }>;
}

const ShareReceiver = registerPlugin<ShareReceiverPlugin>('ShareReceiver', {
  // Web fallback — no shares on the web build.
  web: () => ({
    getPendingShare: async () => ({}),
    addListener: async () => ({ remove: async () => undefined }),
  }),
});

export default ShareReceiver;
