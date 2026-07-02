package com.callverify.app

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    private val permissionsLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { startMonitorService() }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Pre-configure credentials so CallReceiver works automatically
        getSharedPreferences("callverify", MODE_PRIVATE).edit()
            .putString("api_url", "https://0d14faae-8cfa-4346-8c5d-b4cf899b7730-00-gnqh8v7u88h8.spock.replit.dev")
            .putString("app_secret_key", "897829ef954df7f267d2b207368ecedf25062a7880b7136ed41368aa16de9232")
            .apply()

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

        // Request phone permissions and start background call monitoring
        requestPermissionsAndStart()
    }

    @Suppress("OVERRIDE_DEPRECATION")
    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack()
        else super.onBackPressed()
    }

    private fun requestPermissionsAndStart() {
        val needed = mutableListOf(
            Manifest.permission.READ_PHONE_STATE,
            Manifest.permission.READ_CALL_LOG
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU)
            needed.add(Manifest.permission.POST_NOTIFICATIONS)

        val missing = needed.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        if (missing.isEmpty()) startMonitorService()
        else permissionsLauncher.launch(missing.toTypedArray())
    }

    private fun startMonitorService() {
        val intent = Intent(this, CallMonitorService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            startForegroundService(intent)
        else
            startService(intent)
    }
}
