package com.reactnativeflipperinspector;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

/**
 * Minimal native module for React Native Flipper Inspector
 * Provides device info and basic native functionality
 */
public class ReactNativeFlipperInspectorModule extends ReactContextBaseJavaModule {

    public ReactNativeFlipperInspectorModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "ReactNativeFlipperInspector";
    }

    @ReactMethod
    public void getDeviceInfo(Promise promise) {
        try {
            WritableMap deviceInfo = Arguments.createMap();
            
            // Basic device information
            deviceInfo.putString("platform", "android");
            deviceInfo.putString("version", android.os.Build.VERSION.RELEASE);
            deviceInfo.putString("model", android.os.Build.MODEL);
            deviceInfo.putString("manufacturer", android.os.Build.MANUFACTURER);
            
            // Runtime information
            Runtime runtime = Runtime.getRuntime();
            deviceInfo.putDouble("totalMemory", runtime.totalMemory());
            deviceInfo.putDouble("freeMemory", runtime.freeMemory());
            deviceInfo.putDouble("maxMemory", runtime.maxMemory());
            
            promise.resolve(deviceInfo);
        } catch (Exception e) {
            promise.reject("DEVICE_INFO_ERROR", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void isFlipperAvailable(Promise promise) {
        try {
            // Check if Flipper is available in the current build
            boolean isAvailable = false;
            
            try {
                Class.forName("com.facebook.flipper.android.FlipperClient");
                isAvailable = true;
            } catch (ClassNotFoundException e) {
                isAvailable = false;
            }
            
            promise.resolve(isAvailable);
        } catch (Exception e) {
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void getAppInfo(Promise promise) {
        try {
            WritableMap appInfo = Arguments.createMap();
            
            // Application information
            String packageName = getReactApplicationContext().getPackageName();
            appInfo.putString("packageName", packageName);
            
            // Try to get version info
            try {
                String versionName = getReactApplicationContext()
                    .getPackageManager()
                    .getPackageInfo(packageName, 0)
                    .versionName;
                appInfo.putString("version", versionName);
            } catch (Exception e) {
                appInfo.putString("version", "unknown");
            }
            
            promise.resolve(appInfo);
        } catch (Exception e) {
            promise.reject("APP_INFO_ERROR", e.getMessage(), e);
        }
    }
}
