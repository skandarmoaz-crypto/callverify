/*
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  NEON_DATABASE_URL=postgresql://neondb_owner:npg_Q5leq9pMHFuA@          ║
 * ║  ep-bitter-hall-atpxgb78-pooler.c-9.us-east-1.aws.neon.tech/neondb      ║
 * ║  APP_SECRET_KEY=897829ef954df7f267d2b207368ecedf25062a7880b7136ed41368aa16de9232
 * ║  ❌ DO NOT delete/replace/encrypt any variable or the database           ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */
package com.callverify.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build

/** Restarts CallMonitorService after device reboot */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED &&
            intent.action != "android.intent.action.QUICKBOOT_POWERON") return

        val prefs = context.getSharedPreferences("callverify", Context.MODE_PRIVATE)
        val hasKey = !prefs.getString("app_secret_key", "").isNullOrEmpty()
        if (!hasKey) return   // Not configured yet

        val serviceIntent = Intent(context, CallMonitorService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            context.startForegroundService(serviceIntent)
        else
            context.startService(serviceIntent)
    }
}
