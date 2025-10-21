#!/bin/bash

echo "🧪 Testing v1.0.13 Stack Overflow Fix"
echo "======================================"
echo ""

# Get your project path
read -p "Enter your project path (e.g., /path/to/jotno-patient): " PROJECT_PATH

if [ -z "$PROJECT_PATH" ]; then
    echo "❌ No project path provided"
    exit 1
fi

if [ ! -d "$PROJECT_PATH" ]; then
    echo "❌ Project path does not exist: $PROJECT_PATH"
    exit 1
fi

echo "✅ Project found: $PROJECT_PATH"
echo ""

# Install from local
echo "📦 Installing local package..."
cd "$PROJECT_PATH"
npm install /Users/jotnosqh/Desktop/npm-packages/react-native-flipper-inspector/packages/react-native-flipper-inspector

echo ""
echo "🧹 Cleaning builds..."
rm -rf node_modules/.cache
cd android && ./gradlew clean && cd ..

echo ""
echo "🚀 Starting Metro bundler..."
echo "   (This will run in the background)"
npx react-native start --reset-cache &
METRO_PID=$!

echo ""
echo "⏳ Waiting 10 seconds for Metro to start..."
sleep 10

echo ""
echo "📱 Building and installing Android app..."
npx react-native run-android

echo ""
echo "✅ App should be running now!"
echo ""
echo "📋 Next steps:"
echo "   1. Make an Axios request in your app"
echo "   2. Check if you see these logs:"
echo "      [NetworkInterceptor] Constructor - stored original methods"
echo "      [NetworkInterceptor] Creating new interceptor instance"
echo "      [NetworkInterceptor] Starting interception..."
echo "   3. Open the floating inspector"
echo "   4. Verify requests appear without 'Maximum call stack size exceeded' error"
echo ""
echo "💡 To stop Metro: kill $METRO_PID"
echo ""
