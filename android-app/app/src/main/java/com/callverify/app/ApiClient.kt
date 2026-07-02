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

import android.util.Log
import kotlinx.coroutines.*
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

object ApiClient {

    private const val TAG = "CallVerify.API"
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    /**
     * POST /api/incoming-call
     * Header: X-App-Secret: <secretKey>
     * Body:   { "phone": "<phoneNumber>" }
     */
    fun reportIncomingCall(baseUrl: String, secretKey: String, phoneNumber: String) {
        scope.launch {
            var attempt = 0
            val maxAttempts = 3
            while (attempt < maxAttempts) {
                attempt++
                try {
                    val url = URL("$baseUrl/api/incoming-call")
                    val conn = (url.openConnection() as HttpURLConnection).apply {
                        requestMethod = "POST"
                        setRequestProperty("Content-Type", "application/json")
                        setRequestProperty("X-App-Secret", secretKey)
                        connectTimeout = 10_000
                        readTimeout    = 10_000
                        doOutput = true
                    }
                    val body = """{"phone":"$phoneNumber"}"""
                    OutputStreamWriter(conn.outputStream).use { it.write(body) }

                    val code = conn.responseCode
                    val response = conn.inputStream.bufferedReader().readText()
                    conn.disconnect()

                    if (code in 200..299) {
                        Log.i(TAG, "✅ Reported call [$phoneNumber] → $code: $response")
                        return@launch
                    } else {
                        Log.w(TAG, "⚠️ Attempt $attempt — HTTP $code: $response")
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "❌ Attempt $attempt failed: ${e.message}")
                }
                if (attempt < maxAttempts) delay(2_000L * attempt)
            }
            Log.e(TAG, "All $maxAttempts attempts failed for call [$phoneNumber]")
        }
    }

    fun cancel() = scope.cancel()
}
