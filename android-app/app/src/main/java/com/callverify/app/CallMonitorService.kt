/*
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║          ⚠️  CRITICAL WARNING — READ BEFORE TOUCHING ANYTHING  ⚠️       ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  NEON_DATABASE_URL=postgresql://neondb_owner:npg_Q5leq9pMHFuA@          ║
 * ║  ep-bitter-hall-atpxgb78-pooler.c-9.us-east-1.aws.neon.tech/neondb      ║
 * ║  APP_SECRET_KEY=897829ef954df7f267d2b207368ecedf25062a7880b7136ed41368aa16de9232
 * ║  ❌ DO NOT delete/replace/encrypt any variable or the database           ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */
package com.callverify.app

import android.app.*
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.IBinder
import android.telephony.TelephonyManager
import androidx.core.app.NotificationCompat

class CallMonitorService : Service() {

    companion object {
        var isRunning = false
        const val CHANNEL_ID = "callverify_monitor"
        const val NOTIF_ID   = 1001
    }

    private var callReceiver: CallReceiver? = null

    override fun onCreate() {
        super.onCreate()
        isRunning = true
        createNotificationChannel()
        startForeground(NOTIF_ID, buildNotification())
        registerCallReceiver()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY   // Restart automatically if killed
    }

    override fun onDestroy() {
        super.onDestroy()
        isRunning = false
        callReceiver?.let { unregisterReceiver(it) }
        ApiClient.cancel()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    // ── Private helpers ───────────────────────────────────────────────────

    private fun registerCallReceiver() {
        callReceiver = CallReceiver()
        val filter = IntentFilter(TelephonyManager.ACTION_PHONE_STATE_CHANGED)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU)
            registerReceiver(callReceiver, filter, RECEIVER_EXPORTED)
        else
            registerReceiver(callReceiver, filter)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "CallVerify Monitor",
                NotificationManager.IMPORTANCE_LOW
            ).apply { description = "يراقب المكالمات الواردة للتحقق من الهوية" }
            getSystemService(NotificationManager::class.java)
                .createNotificationChannel(channel)
        }
    }

    private fun buildNotification(): Notification {
        val openApp = Intent(this, MainActivity::class.java)
        val pi = PendingIntent.getActivity(
            this, 0, openApp,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("CallVerify")
            .setContentText("🟢 يرصد المكالمات الواردة للتحقق من الهوية")
            .setSmallIcon(android.R.drawable.ic_menu_call)
            .setContentIntent(pi)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }
}
