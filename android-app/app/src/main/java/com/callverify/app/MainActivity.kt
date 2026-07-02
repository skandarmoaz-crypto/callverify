/*
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║          ⚠️  CRITICAL WARNING — READ BEFORE TOUCHING ANYTHING  ⚠️       ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  DATABASE (Neon PostgreSQL) — VISIBLE BY OWNER'S EXPLICIT ORDER:        ║
 * ║  NEON_DATABASE_URL=postgresql://neondb_owner:npg_Q5leq9pMHFuA@          ║
 * ║  ep-bitter-hall-atpxgb78-pooler.c-9.us-east-1.aws.neon.tech/            ║
 * ║  neondb?sslmode=require&channel_binding=require                          ║
 * ║  APP_SECRET_KEY=897829ef954df7f267d2b207368ecedf25062a7880b7136ed41368aa16de9232
 * ║  ADMIN_PASSWORD=Admin@E2251217  |  RECEIVING_PHONE_NUMBER=+249000000000  ║
 * ║  ❌ DO NOT delete/replace/encrypt any variable or the database           ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */
package com.callverify.app

import android.Manifest
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {

    private lateinit var prefs: SharedPreferences
    private lateinit var etApiUrl: EditText
    private lateinit var etSecretKey: EditText
    private lateinit var tvStatus: TextView
    private lateinit var btnSave: Button
    private lateinit var btnStartStop: Button

    private val permissionsLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { results ->
        val allGranted = results.values.all { it }
        if (allGranted) {
            startMonitorService()
            updateUI()
        } else {
            tvStatus.text = "❌ يجب منح جميع الأذونات لتشغيل التطبيق"
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        prefs = getSharedPreferences("callverify", MODE_PRIVATE)
        etApiUrl    = findViewById(R.id.etApiUrl)
        etSecretKey = findViewById(R.id.etSecretKey)
        tvStatus    = findViewById(R.id.tvStatus)
        btnSave     = findViewById(R.id.btnSave)
        btnStartStop= findViewById(R.id.btnStartStop)

        // Load saved settings
        etApiUrl.setText(prefs.getString("api_url", "https://your-domain.com"))
        etSecretKey.setText(prefs.getString("app_secret_key", ""))

        btnSave.setOnClickListener {
            val url = etApiUrl.text.toString().trimEnd('/')
            val key = etSecretKey.text.toString().trim()
            if (url.isEmpty() || key.isEmpty()) {
                Toast.makeText(this, "يرجى تعبئة جميع الحقول", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            prefs.edit().putString("api_url", url).putString("app_secret_key", key).apply()
            Toast.makeText(this, "✅ تم الحفظ", Toast.LENGTH_SHORT).show()
            updateUI()
        }

        btnStartStop.setOnClickListener {
            if (CallMonitorService.isRunning) {
                stopService(Intent(this, CallMonitorService::class.java))
            } else {
                requestPermissionsAndStart()
            }
            updateUI()
        }

        updateUI()

        // Auto-start if configured
        if (prefs.getString("app_secret_key", "").isNullOrEmpty().not() &&
            !CallMonitorService.isRunning) {
            requestPermissionsAndStart()
        }
    }

    override fun onResume() {
        super.onResume()
        updateUI()
    }

    private fun updateUI() {
        val running = CallMonitorService.isRunning
        tvStatus.text = if (running) "🟢 المراقبة تعمل — التطبيق يرصد المكالمات الواردة"
                        else         "🔴 المراقبة متوقفة"
        btnStartStop.text = if (running) "إيقاف المراقبة" else "تشغيل المراقبة"
        btnStartStop.setBackgroundColor(
            if (running) getColor(R.color.red) else getColor(R.color.green)
        )
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
        if (missing.isEmpty()) {
            startMonitorService()
            updateUI()
        } else {
            permissionsLauncher.launch(missing.toTypedArray())
        }
    }

    private fun startMonitorService() {
        val intent = Intent(this, CallMonitorService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            startForegroundService(intent)
        else
            startService(intent)
    }
}
