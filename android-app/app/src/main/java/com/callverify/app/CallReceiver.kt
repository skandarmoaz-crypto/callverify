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

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.telephony.TelephonyManager
import android.util.Log

class CallReceiver : BroadcastReceiver() {

    companion object {
        private const val TAG = "CallVerify"
        private var lastState = TelephonyManager.CALL_STATE_IDLE
        private var lastIncomingNumber = ""
    }

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != TelephonyManager.ACTION_PHONE_STATE_CHANGED) return

        val state = intent.getStringExtra(TelephonyManager.EXTRA_STATE) ?: return
        val incomingNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER) ?: ""

        Log.d(TAG, "Phone state: $state, number: $incomingNumber")

        when (state) {
            TelephonyManager.EXTRA_STATE_RINGING -> {
                // Incoming call detected
                lastState = TelephonyManager.CALL_STATE_RINGING
                if (incomingNumber.isNotEmpty()) {
                    lastIncomingNumber = incomingNumber
                }
                Log.d(TAG, "📞 Incoming call from: $lastIncomingNumber")
                reportIncomingCall(context, lastIncomingNumber)
            }
            TelephonyManager.EXTRA_STATE_OFFHOOK -> {
                lastState = TelephonyManager.CALL_STATE_OFFHOOK
            }
            TelephonyManager.EXTRA_STATE_IDLE -> {
                lastState = TelephonyManager.CALL_STATE_IDLE
                lastIncomingNumber = ""
            }
        }
    }

    private fun reportIncomingCall(context: Context, phoneNumber: String) {
        if (phoneNumber.isEmpty()) {
            Log.w(TAG, "Empty phone number — skipping report")
            return
        }
        val prefs = context.getSharedPreferences("callverify", Context.MODE_PRIVATE)
        val apiUrl   = prefs.getString("api_url", "") ?: ""
        val secretKey = prefs.getString("app_secret_key", "") ?: ""

        if (apiUrl.isEmpty() || secretKey.isEmpty()) {
            Log.w(TAG, "API URL or secret key not configured")
            return
        }

        ApiClient.reportIncomingCall(apiUrl, secretKey, phoneNumber)
    }
}
