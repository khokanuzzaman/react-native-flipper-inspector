#import "ReactNativeFlipperInspector.h"
#import <React/RCTLog.h>
#import <sys/utsname.h>
#import <mach/mach.h>

@implementation ReactNativeFlipperInspector

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getDeviceInfo:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        NSMutableDictionary *deviceInfo = [NSMutableDictionary dictionary];
        
        // Basic device information
        deviceInfo[@"platform"] = @"ios";
        deviceInfo[@"version"] = [[UIDevice currentDevice] systemVersion];
        deviceInfo[@"model"] = [[UIDevice currentDevice] model];
        deviceInfo[@"name"] = [[UIDevice currentDevice] name];
        
        // Get device model identifier
        struct utsname systemInfo;
        uname(&systemInfo);
        deviceInfo[@"modelIdentifier"] = [NSString stringWithCString:systemInfo.machine
                                                            encoding:NSUTF8StringEncoding];
        
        // Memory information
        struct mach_task_basic_info info;
        mach_msg_type_number_t size = MACH_TASK_BASIC_INFO_COUNT;
        kern_return_t kerr = task_info(mach_task_self(),
                                     MACH_TASK_BASIC_INFO,
                                     (task_info_t)&info,
                                     &size);
        
        if (kerr == KERN_SUCCESS) {
            deviceInfo[@"residentMemory"] = @(info.resident_size);
            deviceInfo[@"virtualMemory"] = @(info.virtual_size);
        }
        
        resolve(deviceInfo);
    } @catch (NSException *exception) {
        reject(@"DEVICE_INFO_ERROR", exception.reason, nil);
    }
}

RCT_EXPORT_METHOD(isFlipperAvailable:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        // Check if Flipper is available in the current build
        BOOL isAvailable = NO;
        
        @try {
            Class flipperClientClass = NSClassFromString(@"FlipperClient");
            isAvailable = (flipperClientClass != nil);
        } @catch (NSException *exception) {
            isAvailable = NO;
        }
        
        resolve(@(isAvailable));
    } @catch (NSException *exception) {
        resolve(@(NO));
    }
}

RCT_EXPORT_METHOD(getAppInfo:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        NSMutableDictionary *appInfo = [NSMutableDictionary dictionary];
        
        // Application information
        NSBundle *bundle = [NSBundle mainBundle];
        appInfo[@"bundleIdentifier"] = [bundle bundleIdentifier];
        appInfo[@"version"] = [bundle objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
        appInfo[@"buildNumber"] = [bundle objectForInfoDictionaryKey:@"CFBundleVersion"];
        appInfo[@"displayName"] = [bundle objectForInfoDictionaryKey:@"CFBundleDisplayName"];
        
        resolve(appInfo);
    } @catch (NSException *exception) {
        reject(@"APP_INFO_ERROR", exception.reason, nil);
    }
}

@end
