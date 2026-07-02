package com.callverify.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Hide action bar for full-screen WebView experience
        supportActionBar?.hide()

        webView = findViewById(R.id.webView)
        webView.settings.apply {
            javaScriptEnabled      = true
            domStorageEnabled      = true
            loadWithOverviewMode   = true
            useWideViewPort        = true
            setSupportZoom(false)
            cacheMode              = WebSettings.LOAD_DEFAULT
            mixedContentMode       = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
            userAgentString        = userAgentString + " CallVerifyApp/1.0"
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView,
                request: WebResourceRequest
            ): Boolean = false
        }

        webView.loadUrl("https://0d14faae-8cfa-4346-8c5d-b4cf899b7730-00-gnqh8v7u88h8.spock.replit.dev")
    }

    @Suppress("OVERRIDE_DEPRECATION")
    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack()
        else super.onBackPressed()
    }
}
