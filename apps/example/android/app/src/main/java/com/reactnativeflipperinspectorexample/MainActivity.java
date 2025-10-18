package com.reactnativeflipperinspectorexample;

import android.app.Activity;
import android.app.Dialog;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.graphics.Color;
import android.widget.FrameLayout;
import android.widget.ScrollView;
import android.view.MotionEvent;
import android.view.animation.ScaleAnimation;
import android.os.Vibrator;
import android.content.Context;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {
    
    private boolean overlayVisible = true;
    private Button floatingButton;
    private List<ApiCall> apiCalls = new ArrayList<>();
    
    private static class ApiCall {
        String method;
        String url;
        int status;
        long duration;
        String timestamp;
        String requestHeaders;
        String requestBody;
        String responseHeaders;
        String responseBody;
        String error;
        
        ApiCall(String method, String url, int status, long duration, 
                String requestHeaders, String requestBody, String responseHeaders, String responseBody, String error) {
            this.method = method;
            this.url = url;
            this.status = status;
            this.duration = duration;
            this.timestamp = java.text.DateFormat.getTimeInstance().format(new java.util.Date());
            this.requestHeaders = requestHeaders;
            this.requestBody = requestBody;
            this.responseHeaders = responseHeaders;
            this.responseBody = responseBody;
            this.error = error;
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Create main layout with gradient background
        LinearLayout mainLayout = new LinearLayout(this);
        mainLayout.setOrientation(LinearLayout.VERTICAL);
        
        // Create gradient background
        android.graphics.drawable.GradientDrawable gradient = new android.graphics.drawable.GradientDrawable(
            android.graphics.drawable.GradientDrawable.Orientation.TOP_BOTTOM,
            new int[]{Color.parseColor("#667eea"), Color.parseColor("#764ba2")}
        );
        mainLayout.setBackground(gradient);
        mainLayout.setPadding(24, 48, 24, 24);
        
        // Header card
        LinearLayout headerCard = new LinearLayout(this);
        headerCard.setOrientation(LinearLayout.VERTICAL);
        headerCard.setBackgroundColor(Color.WHITE);
        headerCard.setPadding(32, 32, 32, 32);
        LinearLayout.LayoutParams headerParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        headerParams.setMargins(0, 0, 0, 24);
        headerCard.setLayoutParams(headerParams);
        headerCard.setElevation(12);
        
        // Add rounded corners
        android.graphics.drawable.GradientDrawable cardBackground = new android.graphics.drawable.GradientDrawable();
        cardBackground.setColor(Color.WHITE);
        cardBackground.setCornerRadius(16);
        headerCard.setBackground(cardBackground);
        
        // Title
        TextView title = new TextView(this);
        title.setText("🔍 React Native Inspector");
        title.setTextSize(28);
        title.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        title.setTextColor(Color.parseColor("#1a202c"));
        title.setGravity(android.view.Gravity.CENTER_HORIZONTAL);
        title.setPadding(0, 0, 0, 8);
        headerCard.addView(title);
        
        // Subtitle
        TextView subtitle = new TextView(this);
        subtitle.setText("Professional API Monitoring Overlay");
        subtitle.setTextSize(18);
        subtitle.setTextColor(Color.parseColor("#4a5568"));
        subtitle.setGravity(android.view.Gravity.CENTER_HORIZONTAL);
        subtitle.setPadding(0, 0, 0, 16);
        headerCard.addView(subtitle);
        
        // Description
        TextView description = new TextView(this);
        description.setText("Advanced debugging tool for React Native applications. Monitor API calls, inspect requests/responses, and debug network issues with ease.");
        description.setTextSize(16);
        description.setTextColor(Color.parseColor("#2d3748"));
        description.setLineSpacing(0, 1.4f);
        description.setGravity(android.view.Gravity.CENTER_HORIZONTAL);
        headerCard.addView(description);
        
        mainLayout.addView(headerCard);
        
        // Features card
        LinearLayout featuresCard = new LinearLayout(this);
        featuresCard.setOrientation(LinearLayout.VERTICAL);
        featuresCard.setBackgroundColor(Color.WHITE);
        featuresCard.setPadding(24, 24, 24, 24);
        LinearLayout.LayoutParams featuresParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        featuresParams.setMargins(0, 0, 0, 24);
        featuresCard.setLayoutParams(featuresParams);
        featuresCard.setElevation(8);
        
        // Add rounded corners to features card
        android.graphics.drawable.GradientDrawable featuresBackground = new android.graphics.drawable.GradientDrawable();
        featuresBackground.setColor(Color.WHITE);
        featuresBackground.setCornerRadius(12);
        featuresCard.setBackground(featuresBackground);
        
        // Features title
        TextView featuresTitle = new TextView(this);
        featuresTitle.setText("🚀 Test API Calls");
        featuresTitle.setTextSize(20);
        featuresTitle.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        featuresTitle.setTextColor(Color.parseColor("#1a202c"));
        featuresTitle.setGravity(android.view.Gravity.CENTER_HORIZONTAL);
        featuresTitle.setPadding(0, 0, 0, 20);
        featuresCard.addView(featuresTitle);
        
        // Test buttons with improved styling
        Button testButton1 = createModernTestButton("📋 GET Users", "GET /api/users", Color.parseColor("#4299e1"));
        Button testButton2 = createModernTestButton("📄 GET Posts", "GET /api/posts", Color.parseColor("#48bb78"));
        Button testButton3 = createModernTestButton("📝 POST Create", "POST /api/create", Color.parseColor("#ed8936"));
        Button toggleButton = createModernToggleButton();
        
        featuresCard.addView(testButton1);
        featuresCard.addView(testButton2);
        featuresCard.addView(testButton3);
        featuresCard.addView(toggleButton);
        
        mainLayout.addView(featuresCard);
        
        // Create floating button container
        FrameLayout container = new FrameLayout(this);
        container.addView(mainLayout);
        
        // Create modern floating button
        floatingButton = new Button(this);
        floatingButton.setText("🔍");
        floatingButton.setTextSize(24);
        floatingButton.setTextColor(Color.WHITE);
        
        // Create gradient background for floating button
        android.graphics.drawable.GradientDrawable fabGradient = new android.graphics.drawable.GradientDrawable(
            android.graphics.drawable.GradientDrawable.Orientation.BL_TR,
            new int[]{Color.parseColor("#667eea"), Color.parseColor("#764ba2")}
        );
        fabGradient.setCornerRadius(56); // Make it circular
        floatingButton.setBackground(fabGradient);
        
        // Position floating button with better spacing
        FrameLayout.LayoutParams floatingParams = new FrameLayout.LayoutParams(112, 112);
        floatingParams.setMargins(0, 0, 32, 100);
        floatingParams.gravity = android.view.Gravity.BOTTOM | android.view.Gravity.END;
        floatingButton.setLayoutParams(floatingParams);
        floatingButton.setElevation(16);
        
        // Add draggable functionality with professional visual effects
        floatingButton.setOnTouchListener(new View.OnTouchListener() {
            private float dX = 0;
            private float dY = 0;
            private long downTime = 0;
            private static final long LONG_PRESS_THRESHOLD = 200; // ms
            private boolean isDragging = false;
            
            @Override
            public boolean onTouch(View view, MotionEvent event) {
                try {
                    FrameLayout.LayoutParams params = (FrameLayout.LayoutParams) floatingButton.getLayoutParams();
                    if (params == null) return false;
                    
                    switch (event.getAction()) {
                        case MotionEvent.ACTION_DOWN:
                            downTime = System.currentTimeMillis();
                            dX = event.getRawX() - params.leftMargin;
                            dY = event.getRawY() - params.topMargin;
                            isDragging = false;
                            return true;
                            
                        case MotionEvent.ACTION_MOVE:
                            long duration = System.currentTimeMillis() - downTime;
                            
                            // Activate drag mode after threshold
                            if (duration >= LONG_PRESS_THRESHOLD && !isDragging) {
                                isDragging = true;
                                
                                // Haptic feedback - simple vibration
                                try {
                                    Vibrator vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                                    if (vibrator != null && vibrator.hasVibrator()) {
                                        vibrator.vibrate(50);
                                    }
                                } catch (Exception e) {
                                    // Silently fail if vibrator not available
                                }
                                
                                // Visual feedback: increase shadow
                                floatingButton.setElevation(40f);
                                
                                // Visual feedback: change gradient to brighter color
                                android.graphics.drawable.GradientDrawable dragGradient = new android.graphics.drawable.GradientDrawable(
                                    android.graphics.drawable.GradientDrawable.Orientation.BL_TR,
                                    new int[]{Color.parseColor("#7c8ff5"), Color.parseColor("#9864d4")}
                                );
                                dragGradient.setCornerRadius(56);
                                floatingButton.setBackground(dragGradient);
                            }
                            
                            if (isDragging) {
                                int newX = (int) (event.getRawX() - dX);
                                int newY = (int) (event.getRawY() - dY);
                                
                                // Keep within bounds
                                int screenWidth = getWindow().getDecorView().getWidth();
                                int screenHeight = getWindow().getDecorView().getHeight();
                                
                                newX = Math.max(0, Math.min(newX, screenWidth - 112));
                                newY = Math.max(0, Math.min(newY, screenHeight - 112));
                                
                                params.leftMargin = newX;
                                params.topMargin = newY;
                                params.gravity = 0;
                                floatingButton.setLayoutParams(params);
                            }
                            return true;
                            
                        case MotionEvent.ACTION_UP:
                            long pressDuration = System.currentTimeMillis() - downTime;
                            
                            if (isDragging) {
                                // Reset to normal state
                                floatingButton.setElevation(16f);
                                
                                // Restore original gradient
                                android.graphics.drawable.GradientDrawable normalGradient = new android.graphics.drawable.GradientDrawable(
                                    android.graphics.drawable.GradientDrawable.Orientation.BL_TR,
                                    new int[]{Color.parseColor("#667eea"), Color.parseColor("#764ba2")}
                                );
                                normalGradient.setCornerRadius(56);
                                floatingButton.setBackground(normalGradient);
                                
                                isDragging = false;
                            } else if (pressDuration < LONG_PRESS_THRESHOLD) {
                                // Quick tap opens inspector
                                showApiInspectorOverlay();
                            }
                            return true;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                return false;
            }
        });
        
        container.addView(floatingButton);
        
        setContentView(container);
        
        // Automatically make a GET request on app startup
        makeInitialApiCall();
    }
    
    private void makeInitialApiCall() {
        // Wait a moment for UI to render, then make an API call
        new Thread(() -> {
            try {
                Thread.sleep(1000); // Wait 1 second for UI to be ready
                
                final long startTime = System.currentTimeMillis();
                final String method = "GET";
                final String url = "https://jsonplaceholder.typicode.com/users";
                final String requestHeaders = generateRequestHeaders();
                final String requestBody = generateRequestBody(method, url);
                
                // Simulate network delay
                Thread.sleep(800 + (int)(Math.random() * 400)); // 800-1200ms delay
                final long duration = System.currentTimeMillis() - startTime;
                
                // Generate response data
                final String responseHeaders = generateResponseHeaders(200);
                final String responseBody = generateResponseBody(method, url, 200, null);
                
                // Add to API calls list
                runOnUiThread(() -> {
                    apiCalls.add(0, new ApiCall(method, url, 200, duration, 
                        requestHeaders, requestBody, responseHeaders, responseBody, null));
                    Toast.makeText(this, "🚀 Initial API call completed automatically!", Toast.LENGTH_SHORT).show();
                });
                
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
    
    private Button createModernTestButton(String text, String apiCall, int color) {
        Button button = new Button(this);
        button.setText(text);
        button.setTextSize(16);
        button.setTextColor(Color.WHITE);
        button.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        
        // Create gradient background
        android.graphics.drawable.GradientDrawable gradient = new android.graphics.drawable.GradientDrawable();
        gradient.setColor(color);
        gradient.setCornerRadius(12);
        gradient.setStroke(0, Color.TRANSPARENT);
        button.setBackground(gradient);
        
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        params.setMargins(0, 8, 0, 8);
        button.setLayoutParams(params);
        button.setPadding(24, 16, 24, 16);
        button.setElevation(4);
        
        button.setOnClickListener(v -> {
            // Simulate API call tracking
            final long startTime = System.currentTimeMillis();
            final String finalApiCall = apiCall;
            final String finalText = text;

            // Generate realistic request data
            final String method = finalText.contains("POST") ? "POST" : "GET";
            final String requestHeaders = generateRequestHeaders();
            final String requestBody = generateRequestBody(method, finalApiCall);

            // Simulate network delay
            new Thread(() -> {
                try {
                    Thread.sleep(500 + (int)(Math.random() * 1000)); // Random delay 500-1500ms
                    final long duration = System.currentTimeMillis() - startTime;

                    // Simulate different status codes
                    int status = 200;
                    String error = null;
                    if (Math.random() < 0.1) {
                        status = 404;
                        error = "Not Found";
                    }
                    if (Math.random() < 0.05) {
                        status = 500;
                        error = "Internal Server Error";
                    }
                    final int finalStatus = status;
                    final String finalError = error;

                    // Generate response data
                    final String responseHeaders = generateResponseHeaders(finalStatus);
                    final String responseBody = generateResponseBody(method, finalApiCall, finalStatus, finalError);

                    // Add to API calls list
                    runOnUiThread(() -> {
                        apiCalls.add(0, new ApiCall(method, finalApiCall, finalStatus, duration,
                            requestHeaders, requestBody, responseHeaders, responseBody, finalError));
                        Toast.makeText(this, "✅ API Call tracked: " + finalApiCall + " (" + finalStatus + ")", Toast.LENGTH_SHORT).show();
                    });
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();

            Toast.makeText(this, "🚀 Making API call: " + apiCall, Toast.LENGTH_SHORT).show();
        });

        return button;
    }
    
    private Button createModernToggleButton() {
        Button button = new Button(this);
        button.setText("👁️ Toggle Floating Button");
        button.setTextSize(16);
        button.setTextColor(Color.WHITE);
        button.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        
        // Create gradient background
        android.graphics.drawable.GradientDrawable gradient = new android.graphics.drawable.GradientDrawable();
        gradient.setColor(Color.parseColor("#718096"));
        gradient.setCornerRadius(12);
        gradient.setStroke(0, Color.TRANSPARENT);
        button.setBackground(gradient);
        
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        params.setMargins(0, 8, 0, 8);
        button.setLayoutParams(params);
        button.setPadding(24, 16, 24, 16);
        button.setElevation(4);
        
        button.setOnClickListener(v -> {
            overlayVisible = !overlayVisible;
            floatingButton.setVisibility(overlayVisible ? View.VISIBLE : View.GONE);
            Toast.makeText(this, overlayVisible ? "👁️ Floating button shown" : "👁️ Floating button hidden", Toast.LENGTH_SHORT).show();
        });

        return button;
    }
    
    private Button createTestButton(String text, String apiCall) {
        Button button = new Button(this);
        button.setText(text);
        button.setBackgroundColor(Color.parseColor("#007bff"));
        button.setTextColor(Color.WHITE);
        button.setPadding(20, 20, 20, 20);
        
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        params.setMargins(0, 10, 0, 10);
        button.setLayoutParams(params);
        
        button.setOnClickListener(v -> {
            // Simulate API call tracking
            final long startTime = System.currentTimeMillis();
            final String finalApiCall = apiCall;
            final String finalText = text;
            
            // Generate realistic request data
            final String method = finalText.split(" ")[1];
            final String requestHeaders = generateRequestHeaders();
            final String requestBody = generateRequestBody(method, finalApiCall);
            
            // Simulate network delay
            new Thread(() -> {
                try {
                    Thread.sleep(500 + (int)(Math.random() * 1000)); // Random delay 500-1500ms
                    final long duration = System.currentTimeMillis() - startTime;
                    
                    // Simulate different status codes
                    int status = 200;
                    String error = null;
                    if (Math.random() < 0.1) {
                        status = 404;
                        error = "Not Found";
                    }
                    if (Math.random() < 0.05) {
                        status = 500;
                        error = "Internal Server Error";
                    }
                    final int finalStatus = status;
                    final String finalError = error;
                    
                    // Generate response data
                    final String responseHeaders = generateResponseHeaders(finalStatus);
                    final String responseBody = generateResponseBody(method, finalApiCall, finalStatus, finalError);
                    
                    // Add to API calls list
                    runOnUiThread(() -> {
                        apiCalls.add(0, new ApiCall(method, finalApiCall, finalStatus, duration, 
                            requestHeaders, requestBody, responseHeaders, responseBody, finalError));
                        Toast.makeText(this, "API Call tracked: " + finalApiCall + " (" + finalStatus + ")", Toast.LENGTH_SHORT).show();
                    });
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();
            
            Toast.makeText(this, "Making API call: " + apiCall, Toast.LENGTH_SHORT).show();
        });
        
        return button;
    }
    
    private Button createToggleButton() {
        Button button = new Button(this);
        button.setText("👁️ Toggle Floating Button");
        button.setBackgroundColor(Color.parseColor("#6c757d"));
        button.setTextColor(Color.WHITE);
        button.setPadding(20, 20, 20, 20);
        
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        params.setMargins(0, 20, 0, 0);
        button.setLayoutParams(params);
        
        button.setOnClickListener(v -> {
            overlayVisible = !overlayVisible;
            floatingButton.setVisibility(overlayVisible ? View.VISIBLE : View.GONE);
            Toast.makeText(this, "Floating button " + (overlayVisible ? "shown" : "hidden"), Toast.LENGTH_SHORT).show();
        });
        
        return button;
    }
    
    private String generateRequestHeaders() {
        return "Content-Type: application/json\n" +
               "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\n" +
               "User-Agent: React-Native-Inspector/1.0.0\n" +
               "Accept: application/json\n" +
               "Accept-Language: en-US,en;q=0.9\n" +
               "X-Request-ID: " + java.util.UUID.randomUUID().toString();
    }
    
    private String generateRequestBody(String method, String url) {
        if ("GET".equals(method)) {
            return null; // GET requests typically don't have body
        } else if ("POST".equals(method)) {
            return "{\n" +
                   "  \"title\": \"Sample Post\",\n" +
                   "  \"body\": \"This is a sample post created via API\",\n" +
                   "  \"userId\": 1,\n" +
                   "  \"timestamp\": \"" + java.text.DateFormat.getDateTimeInstance().format(new java.util.Date()) + "\"\n" +
                   "}";
        } else if ("PUT".equals(method)) {
            return "{\n" +
                   "  \"id\": 1,\n" +
                   "  \"title\": \"Updated Post\",\n" +
                   "  \"body\": \"This post has been updated\",\n" +
                   "  \"userId\": 1\n" +
                   "}";
        }
        return null;
    }
    
    private String generateResponseHeaders(int status) {
        String headers = "Content-Type: application/json\n" +
                        "Server: nginx/1.18.0\n" +
                        "Date: " + java.text.DateFormat.getDateTimeInstance().format(new java.util.Date()) + "\n" +
                        "Cache-Control: no-cache\n" +
                        "X-Response-Time: " + (int)(Math.random() * 100) + "ms\n";
        
        if (status >= 200 && status < 300) {
            headers += "X-Rate-Limit-Remaining: " + (1000 - (int)(Math.random() * 100)) + "\n";
        }
        
        return headers;
    }
    
    private String generateResponseBody(String method, String url, int status, String error) {
        if (status >= 400) {
            return "{\n" +
                   "  \"error\": {\n" +
                   "    \"code\": " + status + ",\n" +
                   "    \"message\": \"" + (error != null ? error : "Unknown error") + "\",\n" +
                   "    \"timestamp\": \"" + java.text.DateFormat.getDateTimeInstance().format(new java.util.Date()) + "\"\n" +
                   "  }\n" +
                   "}";
        }
        
        if (url.contains("/users")) {
            return "[\n" +
                   "  {\n" +
                   "    \"id\": 1,\n" +
                   "    \"name\": \"John Doe\",\n" +
                   "    \"email\": \"john@example.com\",\n" +
                   "    \"phone\": \"+1-555-0123\",\n" +
                   "    \"website\": \"johndoe.com\"\n" +
                   "  },\n" +
                   "  {\n" +
                   "    \"id\": 2,\n" +
                   "    \"name\": \"Jane Smith\",\n" +
                   "    \"email\": \"jane@example.com\",\n" +
                   "    \"phone\": \"+1-555-0456\",\n" +
                   "    \"website\": \"janesmith.com\"\n" +
                   "  }\n" +
                   "]";
        } else if (url.contains("/posts")) {
            if ("POST".equals(method)) {
                return "{\n" +
                       "  \"id\": 101,\n" +
                       "  \"title\": \"Sample Post\",\n" +
                       "  \"body\": \"This is a sample post created via API\",\n" +
                       "  \"userId\": 1,\n" +
                       "  \"createdAt\": \"" + java.text.DateFormat.getDateTimeInstance().format(new java.util.Date()) + "\"\n" +
                       "}";
            } else {
                return "{\n" +
                       "  \"id\": 1,\n" +
                       "  \"title\": \"Sample Post Title\",\n" +
                       "  \"body\": \"This is the body content of the sample post. It contains detailed information about the topic being discussed.\",\n" +
                       "  \"userId\": 1,\n" +
                       "  \"createdAt\": \"2024-01-15T10:30:00Z\",\n" +
                       "  \"updatedAt\": \"2024-01-15T10:30:00Z\"\n" +
                       "}";
            }
        }
        
        return "{\n" +
               "  \"success\": true,\n" +
               "  \"message\": \"Request completed successfully\",\n" +
               "  \"timestamp\": \"" + java.text.DateFormat.getDateTimeInstance().format(new java.util.Date()) + "\"\n" +
               "}";
    }
    
    private void showApiInspectorOverlay() {
        Dialog dialog = new Dialog(this, android.R.style.Theme_Black_NoTitleBar_Fullscreen);
        dialog.setContentView(createOverlayContent(dialog));
        dialog.show();
    }
    
    private String searchQuery = "";
    
    private View createOverlayContent(Dialog dialog) {
        // Main container with modern background
        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        container.setBackgroundColor(Color.parseColor("#f8fafc"));
        
        // Enhanced Header with better design
        LinearLayout header = new LinearLayout(this);
        header.setOrientation(LinearLayout.HORIZONTAL);
        
        // Create gradient background for header
        android.graphics.drawable.GradientDrawable headerGradient = new android.graphics.drawable.GradientDrawable(
            android.graphics.drawable.GradientDrawable.Orientation.LEFT_RIGHT,
            new int[]{Color.parseColor("#667eea"), Color.parseColor("#764ba2")}
        );
        header.setBackground(headerGradient);
        header.setPadding(20, 28, 20, 28);
        header.setElevation(12);
        
        TextView title = new TextView(this);
        title.setText("🔍 API Inspector");
        title.setTextSize(24);
        title.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        title.setTextColor(Color.WHITE);
        title.setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1));
        
        Button closeButton = new Button(this);
        closeButton.setText("✕");
        closeButton.setTextSize(20);
        closeButton.setTextColor(Color.WHITE);
        closeButton.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        
        // Create modern rounded close button
        android.graphics.drawable.GradientDrawable closeGradient = new android.graphics.drawable.GradientDrawable();
        closeGradient.setColor(Color.parseColor("#ef4444"));
        closeGradient.setCornerRadius(24);
        closeButton.setBackground(closeGradient);
        closeButton.setPadding(18, 14, 18, 14);
        closeButton.setElevation(6);
        closeButton.setOnClickListener(v -> dialog.dismiss());
        
        header.addView(title);
        header.addView(closeButton);
        container.addView(header);
        
        // Enhanced Search Section with Modern Design
        LinearLayout searchContainer = new LinearLayout(this);
        searchContainer.setOrientation(LinearLayout.VERTICAL);
        searchContainer.setBackgroundColor(Color.WHITE);
        searchContainer.setPadding(20, 20, 20, 20);
        LinearLayout.LayoutParams searchParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        searchParams.setMargins(16, 16, 16, 12);
        searchContainer.setLayoutParams(searchParams);
        searchContainer.setElevation(6);
        
        // Add rounded corners to search container
        android.graphics.drawable.GradientDrawable searchBackground = new android.graphics.drawable.GradientDrawable();
        searchBackground.setColor(Color.WHITE);
        searchBackground.setCornerRadius(16);
        searchBackground.setStroke(1, Color.parseColor("#e2e8f0"));
        searchContainer.setBackground(searchBackground);
        
        TextView searchLabel = new TextView(this);
        searchLabel.setText("🔍 Search API Calls");
        searchLabel.setTextSize(18);
        searchLabel.setTextColor(Color.parseColor("#1a202c"));
        searchLabel.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        searchLabel.setPadding(0, 0, 0, 12);
        
        android.widget.EditText searchInput = new android.widget.EditText(this);
        searchInput.setHint("Type to search in URLs, headers, response data...");
        searchInput.setText(searchQuery);
        searchInput.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        searchInput.setBackgroundColor(Color.parseColor("#f8f9fa"));
        searchInput.setPadding(16, 16, 16, 16);
        searchInput.setTextSize(16);
        searchInput.setTextColor(Color.parseColor("#2d3748"));
        searchInput.setHintTextColor(Color.parseColor("#6b7280"));
        
        // Add rounded corners to search input
        android.graphics.drawable.GradientDrawable inputBackground = new android.graphics.drawable.GradientDrawable();
        inputBackground.setColor(Color.parseColor("#f8f9fa"));
        inputBackground.setCornerRadius(12);
        inputBackground.setStroke(2, Color.parseColor("#e5e7eb"));
        searchInput.setBackground(inputBackground);
        
        searchInput.addTextChangedListener(new android.text.TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                searchQuery = s.toString();
                updateApiCallsList(container, dialog);
            }
            
            @Override
            public void afterTextChanged(android.text.Editable s) {}
        });
        
        searchContainer.addView(searchLabel);
        searchContainer.addView(searchInput);
        container.addView(searchContainer);
        
        // Enhanced Stats section
        LinearLayout statsContainer = new LinearLayout(this);
        statsContainer.setOrientation(LinearLayout.HORIZONTAL);
        statsContainer.setBackgroundColor(Color.WHITE);
        statsContainer.setPadding(24, 20, 24, 20);
        LinearLayout.LayoutParams statsParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        statsParams.setMargins(16, 0, 16, 12);
        statsContainer.setLayoutParams(statsParams);
        statsContainer.setElevation(4);
        
        // Add rounded corners to stats container
        android.graphics.drawable.GradientDrawable statsBackground = new android.graphics.drawable.GradientDrawable();
        statsBackground.setColor(Color.WHITE);
        statsBackground.setCornerRadius(12);
        statsBackground.setStroke(1, Color.parseColor("#e2e8f0"));
        statsContainer.setBackground(statsBackground);
        
        int totalCalls = apiCalls.size();
        int successCalls = 0;
        int errorCalls = 0;
        
        for (ApiCall call : apiCalls) {
            if (call.status >= 200 && call.status < 300) successCalls++;
            else errorCalls++;
        }
        
        statsContainer.addView(createEnhancedStatItem("Total", String.valueOf(totalCalls), Color.parseColor("#667eea")));
        statsContainer.addView(createEnhancedStatItem("Success", String.valueOf(successCalls), Color.parseColor("#10b981")));
        statsContainer.addView(createEnhancedStatItem("Errors", String.valueOf(errorCalls), Color.parseColor("#ef4444")));
        
        container.addView(statsContainer);
        
        // API calls list container
        ScrollView scrollView = new ScrollView(this);
        LinearLayout callsListContainer = new LinearLayout(this);
        callsListContainer.setOrientation(LinearLayout.VERTICAL);
        callsListContainer.setPadding(20, 20, 20, 20);
        
        // Store reference for updates
        callsListContainer.setTag("callsList");
        
        scrollView.addView(callsListContainer);
        container.addView(scrollView);
        
        // Update API calls list after container is added
        updateApiCallsList(container, dialog);
        
        return container;
    }
    
    private void updateApiCallsList(LinearLayout container, Dialog dialog) {
        LinearLayout callsList = container.findViewWithTag("callsList");
        if (callsList == null) {
            // If callsList not found, try to find it in the ScrollView
            ScrollView scrollView = (ScrollView) container.getChildAt(container.getChildCount() - 1);
            if (scrollView != null && scrollView.getChildCount() > 0) {
                callsList = (LinearLayout) scrollView.getChildAt(0);
            }
            if (callsList == null) return;
        }
        
        callsList.removeAllViews();
        
        List<ApiCall> filteredCalls = new ArrayList<>();
        if (searchQuery.isEmpty()) {
            filteredCalls.addAll(apiCalls);
        } else {
            String query = searchQuery.toLowerCase();
            for (ApiCall call : apiCalls) {
                if (call.url.toLowerCase().contains(query) ||
                    (call.requestHeaders != null && call.requestHeaders.toLowerCase().contains(query)) ||
                    (call.requestBody != null && call.requestBody.toLowerCase().contains(query)) ||
                    (call.responseHeaders != null && call.responseHeaders.toLowerCase().contains(query)) ||
                    (call.responseBody != null && call.responseBody.toLowerCase().contains(query))) {
                    filteredCalls.add(call);
                }
            }
        }
        
        if (filteredCalls.isEmpty()) {
            TextView emptyText = new TextView(this);
            if (searchQuery.isEmpty()) {
                emptyText.setText("No API calls yet.\nMake some API calls using the test buttons!");
            } else {
                emptyText.setText("No API calls match your search.\nTry a different search term.");
            }
            emptyText.setTextSize(16);
            emptyText.setTextColor(Color.parseColor("#666666"));
            emptyText.setPadding(20, 40, 20, 40);
            emptyText.setGravity(android.view.Gravity.CENTER);
            callsList.addView(emptyText);
        } else {
            for (ApiCall call : filteredCalls) {
                callsList.addView(createApiCallItem(call));
            }
        }
    }
    
    private LinearLayout createEnhancedStatItem(String label, String value, int color) {
        LinearLayout statItem = new LinearLayout(this);
        statItem.setOrientation(LinearLayout.VERTICAL);
        statItem.setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1));
        statItem.setPadding(8, 8, 8, 8);
        
        TextView valueText = new TextView(this);
        valueText.setText(value);
        valueText.setTextSize(28);
        valueText.setTextColor(color);
        valueText.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        valueText.setGravity(android.view.Gravity.CENTER);
        valueText.setPadding(0, 0, 0, 4);
        
        TextView labelText = new TextView(this);
        labelText.setText(label);
        labelText.setTextSize(14);
        labelText.setTextColor(Color.parseColor("#6b7280"));
        labelText.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        labelText.setGravity(android.view.Gravity.CENTER);
        
        statItem.addView(valueText);
        statItem.addView(labelText);
        
        return statItem;
    }
    
    private LinearLayout createStatItem(String label, String value) {
        LinearLayout statItem = new LinearLayout(this);
        statItem.setOrientation(LinearLayout.VERTICAL);
        statItem.setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1));
        
        TextView valueText = new TextView(this);
        valueText.setText(value);
        valueText.setTextSize(24);
        valueText.setTextColor(Color.parseColor("#333333"));
        valueText.setGravity(android.view.Gravity.CENTER);
        
        TextView labelText = new TextView(this);
        labelText.setText(label);
        labelText.setTextSize(12);
        labelText.setTextColor(Color.parseColor("#666666"));
        labelText.setGravity(android.view.Gravity.CENTER);
        
        statItem.addView(valueText);
        statItem.addView(labelText);
        
        return statItem;
    }
    
    private LinearLayout createApiCallItem(ApiCall call) {
        LinearLayout item = new LinearLayout(this);
        item.setOrientation(LinearLayout.VERTICAL);
        item.setBackgroundColor(Color.WHITE);
        item.setPadding(20, 20, 20, 20);
        item.setLayoutParams(new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        ));
        
        // Add margin between items and rounded corners
        LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) item.getLayoutParams();
        params.setMargins(16, 0, 16, 12);
        item.setLayoutParams(params);
        
        // Add rounded corners and elevation
        android.graphics.drawable.GradientDrawable itemBackground = new android.graphics.drawable.GradientDrawable();
        itemBackground.setColor(Color.WHITE);
        itemBackground.setCornerRadius(12);
        itemBackground.setStroke(1, Color.parseColor("#e5e7eb"));
        item.setBackground(itemBackground);
        item.setElevation(4);
        
        // Method and URL with enhanced design
        LinearLayout header = new LinearLayout(this);
        header.setOrientation(LinearLayout.HORIZONTAL);
        header.setPadding(0, 0, 0, 8);
        
        TextView methodText = new TextView(this);
        methodText.setText(call.method);
        methodText.setTextSize(14);
        methodText.setTextColor(Color.WHITE);
        methodText.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        
        // Create colored background for method based on type
        android.graphics.drawable.GradientDrawable methodBackground = new android.graphics.drawable.GradientDrawable();
        if ("GET".equals(call.method)) {
            methodBackground.setColor(Color.parseColor("#10b981")); // Green for GET
        } else if ("POST".equals(call.method)) {
            methodBackground.setColor(Color.parseColor("#f59e0b")); // Orange for POST
        } else if ("PUT".equals(call.method)) {
            methodBackground.setColor(Color.parseColor("#3b82f6")); // Blue for PUT
        } else if ("DELETE".equals(call.method)) {
            methodBackground.setColor(Color.parseColor("#ef4444")); // Red for DELETE
        } else {
            methodBackground.setColor(Color.parseColor("#6b7280")); // Gray for others
        }
        methodBackground.setCornerRadius(6);
        methodText.setBackground(methodBackground);
        methodText.setPadding(12, 8, 12, 8);
        
        TextView urlText = new TextView(this);
        urlText.setText(call.url);
        urlText.setTextSize(14);
        urlText.setTextColor(Color.parseColor("#1f2937"));
        urlText.setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1));
        urlText.setPadding(16, 0, 0, 0);
        urlText.setTypeface(android.graphics.Typeface.MONOSPACE);
        
        header.addView(methodText);
        header.addView(urlText);
        
        // Status and duration with enhanced design
        LinearLayout footer = new LinearLayout(this);
        footer.setOrientation(LinearLayout.HORIZONTAL);
        footer.setPadding(0, 8, 0, 0);
        
        TextView statusText = new TextView(this);
        statusText.setText("Status: " + call.status);
        statusText.setTextSize(13);
        statusText.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        statusText.setTextColor(call.status >= 200 && call.status < 300 ?
            Color.parseColor("#10b981") : Color.parseColor("#ef4444"));
        
        TextView durationText = new TextView(this);
        durationText.setText("Duration: " + call.duration + "ms");
        durationText.setTextSize(13);
        durationText.setTextColor(Color.parseColor("#6b7280"));
        durationText.setPadding(20, 0, 0, 0);
        
        TextView timeText = new TextView(this);
        timeText.setText(call.timestamp);
        timeText.setTextSize(12);
        timeText.setTextColor(Color.parseColor("#9ca3af"));
        timeText.setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1));
        timeText.setPadding(20, 0, 0, 0);
        timeText.setGravity(android.view.Gravity.END);
        
        footer.addView(statusText);
        footer.addView(durationText);
        footer.addView(timeText);
        
        item.addView(header);
        item.addView(footer);
        
        // Add click listener for details
        item.setOnClickListener(v -> {
            showApiCallDetails(call);
        });
        
        // Add long press listener to copy URL
        item.setOnLongClickListener(v -> {
            android.content.ClipboardManager clipboard = (android.content.ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
            android.content.ClipData clip = android.content.ClipData.newPlainText("API URL", call.url);
            clipboard.setPrimaryClip(clip);
            Toast.makeText(this, "🔗 URL copied: " + call.url, Toast.LENGTH_SHORT).show();
            return true;
        });
        
        return item;
    }
    
    private static String detailSearchQuery = ""; // Make static so it persists across different API calls
    private static int currentMatchIndex = 0;
    private static int totalMatches = 0;
    
    private void showApiCallDetails(ApiCall call) {
        Dialog detailDialog = new Dialog(this, android.R.style.Theme_Black_NoTitleBar_Fullscreen);
        
        ScrollView scrollView = new ScrollView(this);
        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        container.setBackgroundColor(Color.parseColor("#f5f5f5"));
        
        // Enhanced Header with gradient
        LinearLayout header = new LinearLayout(this);
        header.setOrientation(LinearLayout.HORIZONTAL);
        
        // Create gradient background for header
        android.graphics.drawable.GradientDrawable headerGradient = new android.graphics.drawable.GradientDrawable(
            android.graphics.drawable.GradientDrawable.Orientation.LEFT_RIGHT,
            new int[]{Color.parseColor("#667eea"), Color.parseColor("#764ba2")}
        );
        header.setBackground(headerGradient);
        header.setPadding(20, 28, 20, 28);
        header.setElevation(12);
        
        TextView title = new TextView(this);
        title.setText("🔍 API Call Details");
        title.setTextSize(24);
        title.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        title.setTextColor(Color.WHITE);
        title.setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1));
        
        Button closeButton = new Button(this);
        closeButton.setText("✕");
        closeButton.setTextSize(20);
        closeButton.setTextColor(Color.WHITE);
        closeButton.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        
        // Create modern rounded close button
        android.graphics.drawable.GradientDrawable closeGradient = new android.graphics.drawable.GradientDrawable();
        closeGradient.setColor(Color.parseColor("#ef4444"));
        closeGradient.setCornerRadius(24);
        closeButton.setBackground(closeGradient);
        closeButton.setPadding(18, 14, 18, 14);
        closeButton.setElevation(6);
        closeButton.setOnClickListener(v -> detailDialog.dismiss());
        
        header.addView(title);
        header.addView(closeButton);
        container.addView(header);
        
        // Enhanced Search Section with Modern Design
        LinearLayout searchContainer = new LinearLayout(this);
        searchContainer.setOrientation(LinearLayout.VERTICAL);
        searchContainer.setBackgroundColor(Color.WHITE);
        searchContainer.setPadding(20, 20, 20, 20);
        LinearLayout.LayoutParams searchParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        searchParams.setMargins(16, 16, 16, 12);
        searchContainer.setLayoutParams(searchParams);
        searchContainer.setElevation(6);
        
        // Add rounded corners to search container
        android.graphics.drawable.GradientDrawable searchBackground = new android.graphics.drawable.GradientDrawable();
        searchBackground.setColor(Color.WHITE);
        searchBackground.setCornerRadius(16);
        searchBackground.setStroke(1, Color.parseColor("#e2e8f0"));
        searchContainer.setBackground(searchBackground);
        
        // Search Header Row
        LinearLayout searchHeader = new LinearLayout(this);
        searchHeader.setOrientation(LinearLayout.HORIZONTAL);
        searchHeader.setPadding(0, 0, 0, 16);
        
        TextView searchLabel = new TextView(this);
        searchLabel.setText("🔍 Search in Details");
        searchLabel.setTextSize(18);
        searchLabel.setTextColor(Color.parseColor("#1a202c"));
        searchLabel.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        searchLabel.setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1));
        
        // Clear search button (will be set up after input is created)
        Button clearButton = new Button(this);
        clearButton.setText("✕ Clear");
        clearButton.setTextSize(12);
        clearButton.setTextColor(Color.parseColor("#718096"));
        clearButton.setBackgroundColor(Color.TRANSPARENT);
        clearButton.setPadding(12, 8, 12, 8);
        
        searchHeader.addView(searchLabel);
        searchHeader.addView(clearButton);
        
        // Enhanced Search Input
        android.widget.EditText detailSearchInput = new android.widget.EditText(this);
        detailSearchInput.setHint("Type to search in headers, body, URLs...");
        detailSearchInput.setText(detailSearchQuery); // This will now show the persistent search query
        detailSearchInput.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        detailSearchInput.setBackgroundColor(Color.parseColor("#f8f9fa"));
        detailSearchInput.setPadding(16, 16, 16, 16);
        detailSearchInput.setTextSize(16);
        detailSearchInput.setTextColor(Color.parseColor("#2d3748"));
        detailSearchInput.setHintTextColor(Color.parseColor("#6b7280"));
        
        // Create modern input background
        android.graphics.drawable.GradientDrawable inputBackground = new android.graphics.drawable.GradientDrawable();
        inputBackground.setColor(Color.parseColor("#f8f9fa"));
        inputBackground.setCornerRadius(12);
        inputBackground.setStroke(2, Color.parseColor("#e5e7eb"));
        detailSearchInput.setBackground(inputBackground);
        
        detailSearchInput.addTextChangedListener(new android.text.TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                detailSearchQuery = s.toString();
                currentMatchIndex = 0;
                updateDetailSections(container, call, detailSearchQuery);
            }
            
            @Override
            public void afterTextChanged(android.text.Editable s) {}
        });
        
        // Set up clear button click listener now that input is created
        clearButton.setOnClickListener(v -> {
            detailSearchInput.setText("");
            detailSearchQuery = "";
            currentMatchIndex = 0;
            totalMatches = 0;
            updateDetailSections(container, call, "");
        });
        
        // Enhanced Navigation Section
        LinearLayout navContainer = new LinearLayout(this);
        navContainer.setOrientation(LinearLayout.HORIZONTAL);
        navContainer.setBackgroundColor(Color.parseColor("#f8f9fa"));
        navContainer.setPadding(16, 14, 16, 14);
        navContainer.setPadding(0, 16, 0, 0);
        
        // Add rounded corners to navigation
        android.graphics.drawable.GradientDrawable navBackground = new android.graphics.drawable.GradientDrawable();
        navBackground.setColor(Color.parseColor("#f8f9fa"));
        navBackground.setCornerRadius(12);
        navContainer.setBackground(navBackground);
        
        Button prevButton = new Button(this);
        prevButton.setText("◀ Previous");
        prevButton.setTextSize(14);
        prevButton.setTextColor(Color.WHITE);
        prevButton.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        
        // Create gradient background for navigation buttons
        android.graphics.drawable.GradientDrawable prevGradient = new android.graphics.drawable.GradientDrawable();
        prevGradient.setColor(Color.parseColor("#667eea"));
        prevGradient.setCornerRadius(10);
        prevButton.setBackground(prevGradient);
        prevButton.setPadding(18, 14, 18, 14);
        prevButton.setElevation(4);
        prevButton.setOnClickListener(v -> navigateToMatch(-1, container, call));
        
        TextView matchCountText = new TextView(this);
        matchCountText.setText("No matches");
        matchCountText.setTextSize(14);
        matchCountText.setTextColor(Color.parseColor("#4a5568"));
        matchCountText.setPadding(20, 14, 20, 14);
        matchCountText.setGravity(android.view.Gravity.CENTER);
        matchCountText.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        matchCountText.setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1));
        
        Button nextButton = new Button(this);
        nextButton.setText("Next ▶");
        nextButton.setTextSize(14);
        nextButton.setTextColor(Color.WHITE);
        nextButton.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        
        // Create gradient background for navigation buttons
        android.graphics.drawable.GradientDrawable nextGradient = new android.graphics.drawable.GradientDrawable();
        nextGradient.setColor(Color.parseColor("#667eea"));
        nextGradient.setCornerRadius(10);
        nextButton.setBackground(nextGradient);
        nextButton.setPadding(18, 14, 18, 14);
        nextButton.setElevation(4);
        nextButton.setOnClickListener(v -> navigateToMatch(1, container, call));
        
        navContainer.addView(prevButton);
        navContainer.addView(matchCountText);
        navContainer.addView(nextButton);
        
        // Store references for updates
        searchContainer.setTag("searchContainer");
        matchCountText.setTag("matchCountText");
        prevButton.setTag("prevButton");
        nextButton.setTag("nextButton");
        
        searchContainer.addView(searchHeader);
        searchContainer.addView(detailSearchInput);
        searchContainer.addView(navContainer);
        container.addView(searchContainer);
        
        // Enhanced Copy Actions Section
        LinearLayout copySection = new LinearLayout(this);
        copySection.setOrientation(LinearLayout.VERTICAL);
        copySection.setBackgroundColor(Color.WHITE);
        copySection.setPadding(24, 20, 24, 20);
        LinearLayout.LayoutParams copyParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        copyParams.setMargins(16, 0, 16, 12);
        copySection.setLayoutParams(copyParams);
        copySection.setElevation(4);
        
        // Add rounded corners to copy section
        android.graphics.drawable.GradientDrawable copyBackground = new android.graphics.drawable.GradientDrawable();
        copyBackground.setColor(Color.WHITE);
        copyBackground.setCornerRadius(12);
        copyBackground.setStroke(1, Color.parseColor("#e2e8f0"));
        copySection.setBackground(copyBackground);
        
        TextView copyTitle = new TextView(this);
        copyTitle.setText("📋 Copy Actions");
        copyTitle.setTextSize(18);
        copyTitle.setTextColor(Color.parseColor("#1a202c"));
        copyTitle.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        copyTitle.setPadding(0, 0, 0, 16);
        copyTitle.setGravity(android.view.Gravity.CENTER);
        
        copySection.addView(copyTitle);
        
        // First row of buttons
        LinearLayout buttonRow1 = new LinearLayout(this);
        buttonRow1.setOrientation(LinearLayout.HORIZONTAL);
        buttonRow1.setPadding(0, 0, 0, 8);
        
        Button copyCurlButton = createActionButton("📋 cURL", Color.parseColor("#007bff"), v -> {
            String curl = generateCurlCommand(call);
            android.content.ClipboardManager clipboard = (android.content.ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
            android.content.ClipData clip = android.content.ClipData.newPlainText("cURL", curl);
            clipboard.setPrimaryClip(clip);
            Toast.makeText(this, "cURL copied!", Toast.LENGTH_SHORT).show();
        });
        
        Button copyEndpointButton = createActionButton("🔗 Endpoint", Color.parseColor("#6f42c1"), v -> {
            android.content.ClipboardManager clipboard = (android.content.ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
            android.content.ClipData clip = android.content.ClipData.newPlainText("Endpoint", call.url);
            clipboard.setPrimaryClip(clip);
            Toast.makeText(this, "Endpoint copied!", Toast.LENGTH_SHORT).show();
        });
        
        buttonRow1.addView(copyCurlButton);
        buttonRow1.addView(copyEndpointButton);
        
        // Second row of buttons
        LinearLayout buttonRow2 = new LinearLayout(this);
        buttonRow2.setOrientation(LinearLayout.HORIZONTAL);
        buttonRow2.setPadding(0, 0, 0, 8);
        
        Button copyRequestBodyButton = createActionButton("📤 Request Body", Color.parseColor("#fd7e14"), v -> {
            if (call.requestBody != null) {
                android.content.ClipboardManager clipboard = (android.content.ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
                android.content.ClipData clip = android.content.ClipData.newPlainText("Request Body", call.requestBody);
                clipboard.setPrimaryClip(clip);
                Toast.makeText(this, "Request body copied!", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "No request body to copy", Toast.LENGTH_SHORT).show();
            }
        });
        
        Button copyResponseButton = createActionButton("📥 Response Body", Color.parseColor("#28a745"), v -> {
            if (call.responseBody != null) {
                android.content.ClipboardManager clipboard = (android.content.ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
                android.content.ClipData clip = android.content.ClipData.newPlainText("Response Body", call.responseBody);
                clipboard.setPrimaryClip(clip);
                Toast.makeText(this, "Response body copied!", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "No response body to copy", Toast.LENGTH_SHORT).show();
            }
        });
        
        buttonRow2.addView(copyRequestBodyButton);
        buttonRow2.addView(copyResponseButton);
        
        // Third row of buttons
        LinearLayout buttonRow3 = new LinearLayout(this);
        buttonRow3.setOrientation(LinearLayout.HORIZONTAL);
        
        Button copyHeadersButton = createActionButton("📋 Headers", Color.parseColor("#20c997"), v -> {
            String headers = "Request Headers:\n" + (call.requestHeaders != null ? call.requestHeaders : "None") + 
                           "\n\nResponse Headers:\n" + (call.responseHeaders != null ? call.responseHeaders : "None");
            android.content.ClipboardManager clipboard = (android.content.ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
            android.content.ClipData clip = android.content.ClipData.newPlainText("Headers", headers);
            clipboard.setPrimaryClip(clip);
            Toast.makeText(this, "Headers copied!", Toast.LENGTH_SHORT).show();
        });
        
        Button copyRawButton = createActionButton("📄 Raw Data", Color.parseColor("#dc3545"), v -> {
            String rawData = generateRawApiData(call);
            android.content.ClipboardManager clipboard = (android.content.ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
            android.content.ClipData clip = android.content.ClipData.newPlainText("Raw API Data", rawData);
            clipboard.setPrimaryClip(clip);
            Toast.makeText(this, "Raw data copied!", Toast.LENGTH_SHORT).show();
        });
        
        buttonRow3.addView(copyHeadersButton);
        buttonRow3.addView(copyRawButton);
        
        copySection.addView(buttonRow1);
        copySection.addView(buttonRow2);
        copySection.addView(buttonRow3);
        container.addView(copySection);
        
        // Store reference for updates
        container.setTag("detailContainer");

        // Initial update of detail sections (after all sections are added)
        // This will apply the persistent search query if there is one
        updateDetailSections(container, call, detailSearchQuery);

        scrollView.addView(container);
        detailDialog.setContentView(scrollView);
        detailDialog.show();
    }
    
    private void updateDetailSections(LinearLayout container, ApiCall call, String searchQuery) {
        // Remove existing detail sections (keep header, search, and copy sections)
        int childCount = container.getChildCount();
        for (int i = childCount - 1; i >= 0; i--) {
            View child = container.getChildAt(i);
            if (child.getTag() != null && child.getTag().equals("detailSection")) {
                container.removeViewAt(i);
            }
        }
        
        // Always count matches for the current search query
        totalMatches = 0;
        if (searchQuery != null && !searchQuery.isEmpty()) {
            String allContent = "";
            if (call.method != null) allContent += call.method + " ";
            if (call.url != null) allContent += call.url + " ";
            if (call.status > 0) allContent += call.status + " ";
            if (call.duration > 0) allContent += call.duration + " ";
            if (call.timestamp != null) allContent += call.timestamp + " ";
            if (call.requestHeaders != null) allContent += call.requestHeaders + " ";
            if (call.requestBody != null) allContent += call.requestBody + " ";
            if (call.responseHeaders != null) allContent += call.responseHeaders + " ";
            if (call.responseBody != null) allContent += call.responseBody + " ";
            if (call.error != null) allContent += call.error + " ";
            
            totalMatches = countMatchesInText(allContent, searchQuery);
        }
        
        // Reset current match index if this is a new search
        if (detailSearchQuery == null || !detailSearchQuery.equals(searchQuery)) {
            currentMatchIndex = 0;
            detailSearchQuery = searchQuery;
        }
        
        // Ensure currentMatchIndex is within bounds
        if (totalMatches > 0) {
            if (currentMatchIndex >= totalMatches) currentMatchIndex = totalMatches - 1;
            if (currentMatchIndex < 0) currentMatchIndex = 0;
        }
        
        // Find insertion point (after search section)
        int insertIndex = 2; // Default after header and search
        for (int i = 0; i < container.getChildCount(); i++) {
            View child = container.getChildAt(i);
            if (child.getTag() != null && child.getTag().equals("searchContainer")) {
                insertIndex = i + 1;
                break;
            }
        }
        
        // Create sections with simple highlighting
        if (call.method != null || call.url != null || call.status > 0) {
            LinearLayout basicSection = createSimpleDetailSection("📋 Basic Information", call, searchQuery);
            basicSection.setTag("detailSection");
            container.addView(basicSection, insertIndex++);
        }
        
        if (call.requestHeaders != null || call.requestBody != null) {
            LinearLayout requestSection = createSimpleDetailSection("📤 Request", call, searchQuery);
            requestSection.setTag("detailSection");
            container.addView(requestSection, insertIndex++);
        }
        
        if (call.responseHeaders != null || call.responseBody != null) {
            LinearLayout responseSection = createSimpleDetailSection("📥 Response", call, searchQuery);
            responseSection.setTag("detailSection");
            container.addView(responseSection, insertIndex++);
        }
        
        if (call.error != null) {
            LinearLayout errorSection = createSimpleDetailSection("❌ Error", call, searchQuery);
            errorSection.setTag("detailSection");
            container.addView(errorSection, insertIndex++);
        }
        
        // Update navigation
        updateMatchNavigation(container);
    }
    
    private LinearLayout createSimpleDetailSection(String title, ApiCall call, String searchQuery) {
        LinearLayout section = new LinearLayout(this);
        section.setOrientation(LinearLayout.VERTICAL);
        section.setBackgroundColor(Color.WHITE);
        section.setPadding(24, 20, 24, 20);
        section.setLayoutParams(new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        ));
        
        // Add margin between sections and rounded corners
        LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) section.getLayoutParams();
        params.setMargins(16, 8, 16, 12);
        section.setLayoutParams(params);
        
        // Add rounded corners and elevation
        android.graphics.drawable.GradientDrawable sectionBackground = new android.graphics.drawable.GradientDrawable();
        sectionBackground.setColor(Color.WHITE);
        sectionBackground.setCornerRadius(12);
        sectionBackground.setStroke(1, Color.parseColor("#e5e7eb"));
        section.setBackground(sectionBackground);
        section.setElevation(4);
        
        TextView titleText = new TextView(this);
        titleText.setText(title);
        titleText.setTextSize(18);
        titleText.setTextColor(Color.parseColor("#1a202c"));
        titleText.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        titleText.setPadding(0, 0, 0, 16);
        section.addView(titleText);
        
        // Create content based on section type
        final String content;
        if (title.contains("Basic")) {
            content = createDetailRow("Method", call.method) +
                     createDetailRow("URL", call.url) +
                     createDetailRow("Status", String.valueOf(call.status)) +
                     createDetailRow("Duration", call.duration + "ms") +
                     createDetailRow("Timestamp", call.timestamp);
        } else if (title.contains("Request")) {
            String requestContent = "";
            if (call.requestHeaders != null) {
                requestContent += createDetailRow("Headers", call.requestHeaders);
            }
            if (call.requestBody != null) {
                requestContent += createDetailRow("Body", call.requestBody);
            }
            content = requestContent;
        } else if (title.contains("Response")) {
            String responseContent = "";
            if (call.responseHeaders != null) {
                responseContent += createDetailRow("Headers", call.responseHeaders);
            }
            if (call.responseBody != null) {
                responseContent += createDetailRow("Body", call.responseBody);
            }
            content = responseContent;
        } else if (title.contains("Error")) {
            content = createDetailRow("Error", call.error);
        } else {
            content = "";
        }
        
        TextView contentText = new TextView(this);
        contentText.setTextSize(13);
        contentText.setTypeface(android.graphics.Typeface.MONOSPACE);
        contentText.setPadding(16, 16, 16, 16);
        contentText.setBackgroundColor(Color.parseColor("#f8f9fa"));
        
        // Add rounded corners to content background with enhanced styling for JSON
        android.graphics.drawable.GradientDrawable contentBackground = new android.graphics.drawable.GradientDrawable();
        if (isJsonContent(content)) {
            // Special styling for JSON content
            contentBackground.setColor(Color.parseColor("#1a1a2e")); // Dark background for JSON
            contentBackground.setCornerRadius(8);
            contentBackground.setStroke(2, Color.parseColor("#16213e"));
            contentText.setTextColor(Color.parseColor("#e94560")); // Default text color for JSON
        } else {
            // Regular styling for non-JSON content
            contentBackground.setColor(Color.parseColor("#f8f9fa"));
            contentBackground.setCornerRadius(8);
            contentBackground.setStroke(1, Color.parseColor("#e5e7eb"));
        }
        contentText.setBackground(contentBackground);
        
        // Apply highlighting if search query exists
        if (searchQuery != null && !searchQuery.isEmpty()) {
            android.text.SpannableString highlightedText = highlightText(content, searchQuery);
            contentText.setText(highlightedText);
        } else {
            // Check if content is JSON and apply syntax highlighting
            if (isJsonContent(content)) {
                contentText.setText(createHighlightedJsonText(content));
            } else {
                contentText.setText(content);
                contentText.setTextColor(Color.parseColor("#666666"));
            }
        }
        
        // Add long press listener to copy content
        contentText.setOnLongClickListener(v -> {
            android.content.ClipboardManager clipboard = (android.content.ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
            android.content.ClipData clip = android.content.ClipData.newPlainText(title, content);
            clipboard.setPrimaryClip(clip);
            Toast.makeText(this, "📋 " + title + " copied!", Toast.LENGTH_SHORT).show();
            return true;
        });
        
        section.addView(contentText);
        return section;
    }
    
    private android.text.SpannableString highlightText(String text, String searchQuery) {
        android.text.SpannableString spannable = new android.text.SpannableString(text);
        
        if (searchQuery == null || searchQuery.isEmpty()) {
            spannable.setSpan(new android.text.style.ForegroundColorSpan(Color.parseColor("#666666")), 0, text.length(), 0);
            return spannable;
        }
        
        String lowerText = text.toLowerCase();
        String lowerQuery = searchQuery.toLowerCase();
        int index = 0;
        int matchCount = 0;
        
        while ((index = lowerText.indexOf(lowerQuery, index)) != -1) {
            // Highlight match with different colors based on whether it's the current match
            int highlightColor = (matchCount == currentMatchIndex) ? 
                Color.parseColor("#ff5722") : // Orange for current match
                Color.parseColor("#ffeb3b");  // Yellow for other matches
            
            android.text.style.BackgroundColorSpan highlightSpan = new android.text.style.BackgroundColorSpan(highlightColor);
            spannable.setSpan(highlightSpan, index, index + searchQuery.length(), 0);
            
            // Add bold style for current match
            if (matchCount == currentMatchIndex) {
                spannable.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD), index, index + searchQuery.length(), 0);
            }
            
            matchCount++;
            index += searchQuery.length();
        }
        
        // Set default text color for non-highlighted parts
        spannable.setSpan(new android.text.style.ForegroundColorSpan(Color.parseColor("#666666")), 0, text.length(), 0);
        
        return spannable;
    }
    
    private int countMatchesInText(String text, String searchQuery) {
        if (searchQuery == null || searchQuery.isEmpty()) return 0;
        
        String lowerText = text.toLowerCase();
        String lowerQuery = searchQuery.toLowerCase();
        int count = 0;
        int index = 0;
        
        while ((index = lowerText.indexOf(lowerQuery, index)) != -1) {
            count++;
            index += searchQuery.length();
        }
        
        return count;
    }
    
    private LinearLayout createHighlightedDetailSection(String title, String content, String searchQuery) {
        LinearLayout section = new LinearLayout(this);
        section.setOrientation(LinearLayout.VERTICAL);
        section.setBackgroundColor(Color.WHITE);
        section.setPadding(20, 20, 20, 20);
        section.setLayoutParams(new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        ));
        
        // Add margin between sections
        LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) section.getLayoutParams();
        params.setMargins(16, 8, 16, 8);
        section.setLayoutParams(params);
        
        TextView titleText = new TextView(this);
        titleText.setText(title);
        titleText.setTextSize(16);
        titleText.setTextColor(Color.parseColor("#333333"));
        titleText.setPadding(0, 0, 0, 16);
        
        TextView contentText = new TextView(this);
        contentText.setTextSize(12);
        contentText.setTypeface(android.graphics.Typeface.MONOSPACE);
        contentText.setPadding(12, 12, 12, 12);
        contentText.setBackgroundColor(Color.parseColor("#f8f9fa"));
        
        // Check if content is JSON and apply syntax highlighting
        if (isJsonContent(content)) {
            android.text.SpannableString highlightedJson = createHighlightedJsonText(content);
            if (searchQuery != null && !searchQuery.isEmpty()) {
                highlightedJson = highlightSearchInSpannable(highlightedJson, searchQuery);
            }
            contentText.setText(highlightedJson);
        } else {
            if (searchQuery != null && !searchQuery.isEmpty()) {
                android.text.SpannableString highlightedText = highlightSearchInText(content, searchQuery);
                contentText.setText(highlightedText);
            } else {
                contentText.setText(content);
                contentText.setTextColor(Color.parseColor("#666666"));
            }
        }
        
        // Add long press listener to copy content
        contentText.setOnLongClickListener(v -> {
            android.content.ClipboardManager clipboard = (android.content.ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
            android.content.ClipData clip = android.content.ClipData.newPlainText(title, content);
            clipboard.setPrimaryClip(clip);
            Toast.makeText(this, "📋 " + title + " copied!", Toast.LENGTH_SHORT).show();
            return true;
        });
        
        section.addView(titleText);
        section.addView(contentText);
        
        return section;
    }
    
    private android.text.SpannableString highlightSearchInText(String text, String searchQuery) {
        android.text.SpannableString spannable = new android.text.SpannableString(text);
        
        if (searchQuery == null || searchQuery.isEmpty()) {
            spannable.setSpan(new android.text.style.ForegroundColorSpan(Color.parseColor("#666666")), 0, text.length(), 0);
            return spannable;
        }
        
        String lowerText = text.toLowerCase();
        String lowerQuery = searchQuery.toLowerCase();
        int index = 0;
        
        while ((index = lowerText.indexOf(lowerQuery, index)) != -1) {
            // Highlight match
            android.text.style.BackgroundColorSpan highlightSpan = new android.text.style.BackgroundColorSpan(Color.parseColor("#ffeb3b"));
            spannable.setSpan(highlightSpan, index, index + searchQuery.length(), 0);
            totalMatches++;
            
            // Set text color for non-highlighted parts
            if (index > 0) {
                spannable.setSpan(new android.text.style.ForegroundColorSpan(Color.parseColor("#666666")), 0, index, 0);
            }
            if (index + searchQuery.length() < text.length()) {
                spannable.setSpan(new android.text.style.ForegroundColorSpan(Color.parseColor("#666666")), index + searchQuery.length(), text.length(), 0);
            }
            
            index += searchQuery.length();
        }
        
        return spannable;
    }
    
    private android.text.SpannableString highlightSearchInSpannable(android.text.SpannableString spannable, String searchQuery) {
        if (searchQuery == null || searchQuery.isEmpty()) {
            return spannable;
        }
        
        String text = spannable.toString();
        String lowerText = text.toLowerCase();
        String lowerQuery = searchQuery.toLowerCase();
        int index = 0;
        
        while ((index = lowerText.indexOf(lowerQuery, index)) != -1) {
            // Highlight match
            android.text.style.BackgroundColorSpan highlightSpan = new android.text.style.BackgroundColorSpan(Color.parseColor("#ffeb3b"));
            spannable.setSpan(highlightSpan, index, index + searchQuery.length(), 0);
            totalMatches++;
            
            index += searchQuery.length();
        }
        
        return spannable;
    }
    
    private void updateMatchNavigation(LinearLayout container) {
        TextView matchCountText = container.findViewWithTag("matchCountText");
        Button prevButton = container.findViewWithTag("prevButton");
        Button nextButton = container.findViewWithTag("nextButton");
        
        if (matchCountText != null) {
            if (totalMatches > 0) {
                matchCountText.setText((currentMatchIndex + 1) + " of " + totalMatches + " matches");
            } else {
                matchCountText.setText("No matches");
            }
        }
        
        if (prevButton != null) {
            prevButton.setEnabled(totalMatches > 0 && currentMatchIndex > 0);
            prevButton.setAlpha(prevButton.isEnabled() ? 1.0f : 0.5f);
        }
        
        if (nextButton != null) {
            nextButton.setEnabled(totalMatches > 0 && currentMatchIndex < totalMatches - 1);
            nextButton.setAlpha(nextButton.isEnabled() ? 1.0f : 0.5f);
        }
    }
    
    private void navigateToMatch(int direction, LinearLayout container, ApiCall call) {
        if (totalMatches == 0) return;
        
        currentMatchIndex += direction;
        if (currentMatchIndex < 0) currentMatchIndex = totalMatches - 1;
        if (currentMatchIndex >= totalMatches) currentMatchIndex = 0;
        
        // Refresh the sections to show current match (without resetting counters)
        updateDetailSections(container, call, detailSearchQuery);
        
        // Update navigation UI
        updateMatchNavigation(container);
        
        // Show toast for current match
        Toast.makeText(this, "Match " + (currentMatchIndex + 1) + " of " + totalMatches, Toast.LENGTH_SHORT).show();
    }
    
    private boolean shouldShowSection(String content, String searchQuery) {
        if (searchQuery == null || searchQuery.isEmpty()) {
            return true;
        }
        return content.toLowerCase().contains(searchQuery.toLowerCase());
    }
    
    private LinearLayout createDetailSection(String title, String content) {
        LinearLayout section = new LinearLayout(this);
        section.setOrientation(LinearLayout.VERTICAL);
        section.setBackgroundColor(Color.WHITE);
        section.setPadding(20, 20, 20, 20);
        section.setLayoutParams(new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        ));
        
        // Add margin between sections
        LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) section.getLayoutParams();
        params.setMargins(16, 8, 16, 8);
        section.setLayoutParams(params);
        
        TextView titleText = new TextView(this);
        titleText.setText(title);
        titleText.setTextSize(16);
        titleText.setTextColor(Color.parseColor("#333333"));
        titleText.setPadding(0, 0, 0, 16);
        
        TextView contentText = new TextView(this);
        contentText.setTextSize(12);
        contentText.setTypeface(android.graphics.Typeface.MONOSPACE);
        contentText.setPadding(12, 12, 12, 12);
        contentText.setBackgroundColor(Color.parseColor("#f8f9fa"));
        
        // Check if content is JSON and apply syntax highlighting
        if (isJsonContent(content)) {
            contentText.setText(createHighlightedJsonText(content));
        } else {
            contentText.setText(content);
            contentText.setTextColor(Color.parseColor("#666666"));
        }
        
        // Add long press listener to copy content
        contentText.setOnLongClickListener(v -> {
            android.content.ClipboardManager clipboard = (android.content.ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
            android.content.ClipData clip = android.content.ClipData.newPlainText(title, content);
            clipboard.setPrimaryClip(clip);
            Toast.makeText(this, "📋 " + title + " copied!", Toast.LENGTH_SHORT).show();
            return true;
        });
        
        section.addView(titleText);
        section.addView(contentText);
        
        return section;
    }
    
    private boolean isJsonContent(String content) {
        if (content == null || content.trim().isEmpty()) return false;
        String trimmed = content.trim();
        return (trimmed.startsWith("{") && trimmed.endsWith("}")) || 
               (trimmed.startsWith("[") && trimmed.endsWith("]"));
    }
    
    private android.text.SpannableString createHighlightedJsonText(String json) {
        android.text.SpannableString spannable = new android.text.SpannableString(json);
        
        // Enhanced JSON highlighting with vibrant colors optimized for dark background
        highlightJsonPattern(spannable, "\"(\\w+)\"\\s*:", Color.parseColor("#FFD700"), true); // Keys - Gold
        highlightJsonPattern(spannable, ":\\s*\"([^\"]+)\"", Color.parseColor("#00FF7F"), false); // String values - Spring Green
        highlightJsonPattern(spannable, ":\\s*(true|false)", Color.parseColor("#FFA500"), true); // Booleans - Orange
        highlightJsonPattern(spannable, ":\\s*(\\d+)", Color.parseColor("#00BFFF"), false); // Numbers - Deep Sky Blue
        highlightJsonPattern(spannable, ":\\s*(null)", Color.parseColor("#FF69B4"), true); // Null values - Hot Pink
        highlightJsonPattern(spannable, "[{}]", Color.parseColor("#9370DB"), true); // Braces - Medium Purple
        highlightJsonPattern(spannable, "[\\[\\]]", Color.parseColor("#9370DB"), true); // Brackets - Medium Purple
        highlightJsonPattern(spannable, ",", Color.parseColor("#FF1493"), true); // Commas - Deep Pink
        highlightJsonPattern(spannable, ":", Color.parseColor("#00CED1"), true); // Colons - Dark Turquoise
        
        return spannable;
    }
    
    private void highlightJsonPattern(android.text.SpannableString spannable, String pattern, int color, boolean bold) {
        java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern);
        java.util.regex.Matcher m = p.matcher(spannable);
        
        while (m.find()) {
            spannable.setSpan(new android.text.style.ForegroundColorSpan(color), m.start(), m.end(), 0);
            if (bold) {
                spannable.setSpan(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD), m.start(), m.end(), 0);
            }
        }
    }
    
    private String createDetailRow(String label, String value) {
        return label + ": " + value + "\n\n";
    }
    
    private Button createActionButton(String text, int color, View.OnClickListener listener) {
        Button button = new Button(this);
        button.setText(text);
        button.setTextColor(Color.WHITE);
        button.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        button.setPadding(20, 16, 20, 16);
        button.setTextSize(14);
        button.setOnClickListener(listener);
        
        // Create gradient background
        android.graphics.drawable.GradientDrawable gradient = new android.graphics.drawable.GradientDrawable();
        gradient.setColor(color);
        gradient.setCornerRadius(10);
        gradient.setStroke(0, Color.TRANSPARENT);
        button.setBackground(gradient);
        
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1);
        params.setMargins(8, 0, 8, 0);
        button.setLayoutParams(params);
        button.setElevation(4);
        
        return button;
    }
    
    private String generateCurlCommand(ApiCall call) {
        StringBuilder curl = new StringBuilder();
        curl.append("curl -X ").append(call.method).append(" \\\n");
        curl.append("  \"").append(call.url).append("\"");
        
        if (call.requestHeaders != null) {
            String[] headers = call.requestHeaders.split("\n");
            for (String header : headers) {
                if (!header.trim().isEmpty()) {
                    curl.append(" \\\n  -H \"").append(header).append("\"");
                }
            }
        }
        
        if (call.requestBody != null) {
            curl.append(" \\\n  -d '").append(call.requestBody.replace("'", "\\'")).append("'");
        }
        
        return curl.toString();
    }
    
    private String generateRawApiData(ApiCall call) {
        StringBuilder raw = new StringBuilder();
        raw.append("=== API CALL RAW DATA ===\n\n");
        
        raw.append("METHOD: ").append(call.method).append("\n");
        raw.append("URL: ").append(call.url).append("\n");
        raw.append("STATUS: ").append(call.status).append("\n");
        raw.append("DURATION: ").append(call.duration).append("ms\n");
        raw.append("TIMESTAMP: ").append(call.timestamp).append("\n\n");
        
        if (call.requestHeaders != null) {
            raw.append("REQUEST HEADERS:\n").append(call.requestHeaders).append("\n\n");
        }
        
        if (call.requestBody != null) {
            raw.append("REQUEST BODY:\n").append(call.requestBody).append("\n\n");
        }
        
        if (call.responseHeaders != null) {
            raw.append("RESPONSE HEADERS:\n").append(call.responseHeaders).append("\n\n");
        }
        
        if (call.responseBody != null) {
            raw.append("RESPONSE BODY:\n").append(call.responseBody).append("\n\n");
        }
        
        if (call.error != null) {
            raw.append("ERROR:\n").append(call.error).append("\n\n");
        }
        
        raw.append("=== END RAW DATA ===");
        return raw.toString();
    }
    
    private void addDetailRow(LinearLayout parent, String label, String value) {
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setPadding(0, 8, 0, 8);
        
        TextView labelText = new TextView(this);
        labelText.setText(label + ": ");
        labelText.setTextSize(14);
        labelText.setTextColor(Color.parseColor("#333333"));
        labelText.setLayoutParams(new LinearLayout.LayoutParams(200, LinearLayout.LayoutParams.WRAP_CONTENT));
        
        TextView valueText = new TextView(this);
        valueText.setText(value);
        valueText.setTextSize(14);
        valueText.setTextColor(Color.parseColor("#666666"));
        
        row.addView(labelText);
        row.addView(valueText);
        parent.addView(row);
    }
}