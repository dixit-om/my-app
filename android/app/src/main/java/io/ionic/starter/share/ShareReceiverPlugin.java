package io.ionic.starter.share;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Bridges Android ACTION_SEND (text/plain) shares into the JS layer.
 *
 * MainActivity reads Intent.EXTRA_TEXT on incoming shares and stashes it via
 * {@link #setPendingShare(String, String)}. The JS layer then either reads it
 * via {@link #getPendingShare(PluginCall)} on app boot or listens for the
 * "shareReceived" event for warm-start shares.
 */
@CapacitorPlugin(name = "ShareReceiver")
public class ShareReceiverPlugin extends Plugin {

    private static String pendingText;
    private static String pendingSubject;
    private static ShareReceiverPlugin instance;

    @Override
    public void load() {
        instance = this;
    }

    public static void setPendingShare(String text, String subject) {
        pendingText = text;
        pendingSubject = subject;
    }

    /** Called by MainActivity after a warm-start onNewIntent has stashed new data. */
    public static void notifyShareReceived() {
        if (instance != null && pendingText != null) {
            JSObject data = new JSObject();
            data.put("text", pendingText);
            if (pendingSubject != null) {
                data.put("subject", pendingSubject);
            }
            instance.notifyListeners("shareReceived", data);
        }
    }

    @PluginMethod
    public void getPendingShare(PluginCall call) {
        JSObject ret = new JSObject();
        if (pendingText != null) {
            ret.put("text", pendingText);
            if (pendingSubject != null) {
                ret.put("subject", pendingSubject);
            }
            // Single-consume: clear after read so a refresh doesn't keep re-prefilling.
            pendingText = null;
            pendingSubject = null;
        }
        call.resolve(ret);
    }
}
