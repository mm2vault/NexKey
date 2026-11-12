const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withNexKeyKeyboard(config) {
  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    const application = manifest.application?.[0];
    if (!application) throw new Error('NexKey: Android application node was not found.');
    const serviceName = '.keyboard.NexKeyInputMethodService';
    application.service = application.service || [];
    const alreadyAdded = application.service.some((service) => service.$?.['android:name'] === serviceName);
    if (!alreadyAdded) {
      application.service.push({
        $: {
          'android:name': serviceName,
          'android:label': 'NexKey',
          'android:permission': 'android.permission.BIND_INPUT_METHOD',
          'android:exported': 'true'
        },
        'intent-filter': [{ action: [{ $: { 'android:name': 'android.view.InputMethod' } }] }],
        'meta-data': [{ $: { 'android:name': 'android.view.im', 'android:resource': '@xml/nexkey_input_method' } }]
      });
    }
    return config;
  });

  config = withDangerousMod(config, ['android', async (config) => {
    const projectRoot = config.modRequest.platformProjectRoot;
    const packageName = config.android?.package || 'com.mm2vault.nexkey';
    const packagePath = packageName.replace(/\./g, '/');
    const javaRoot = path.join(projectRoot, 'app/src/main/java', packagePath, 'keyboard');
    const xmlRoot = path.join(projectRoot, 'app/src/main/res/xml');
    fs.mkdirSync(javaRoot, { recursive: true });
    fs.mkdirSync(xmlRoot, { recursive: true });
    fs.writeFileSync(path.join(javaRoot, 'NexKeyInputMethodService.kt'), kotlinSource(packageName));
    fs.writeFileSync(path.join(xmlRoot, 'nexkey_input_method.xml'), inputMethodXml);
    return config;
  }]);
  return config;
}

const inputMethodXml = `<?xml version="1.0" encoding="utf-8"?>
<input-method xmlns:android="http://schemas.android.com/apk/res/android">
    <subtype android:label="@string/app_name" android:imeSubtypeLocale="en_US" android:imeSubtypeMode="keyboard" />
    <subtype android:label="@string/app_name" android:imeSubtypeLocale="tr_TR" android:imeSubtypeMode="keyboard" />
    <subtype android:label="@string/app_name" android:imeSubtypeLocale="az_AZ" android:imeSubtypeMode="keyboard" />
</input-method>
`;

function kotlinSource(packageName) {
  return `package ${packageName}.keyboard

import android.inputmethodservice.InputMethodService
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import android.view.View
import android.view.inputmethod.InputConnection
import android.widget.Button
import android.widget.LinearLayout

/**
 * First native NexKey IME prototype.
 * Text is committed directly through the active InputConnection and is not uploaded.
 */
class NexKeyInputMethodService : InputMethodService() {
    private var shifted = false
    private val rows = listOf("qwertyuiop", "asdfghjkl", "zxcvbnm")

    override fun onCreateInputView(): View {
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(5), dp(8), dp(5), dp(8))
            setBackgroundColor(Color.rgb(18, 20, 31))
        }

        rows.forEachIndexed { index, row ->
            val line = LinearLayout(this).apply {
                gravity = Gravity.CENTER
                orientation = LinearLayout.HORIZONTAL
            }
            if (index == 2) line.addView(makeKey("⇧", 0xFF7560C8.toInt()) { shifted = !shifted; refreshKeys(root) }, weight(1.15f))
            row.forEach { character ->
                line.addView(makeKey(character.toString(), 0xFF303346.toInt()) {
                    val value = if (shifted) character.uppercaseChar().toString() else character.toString()
                    currentInputConnection?.commitText(value, 1)
                    if (shifted) { shifted = false; refreshKeys(root) }
                }, weight(1f))
            }
            if (index == 2) line.addView(makeKey("⌫", 0xFF7560C8.toInt()) {
                currentInputConnection?.deleteSurroundingText(1, 0)
            }, weight(1.15f))
            root.addView(line)
        }

        val bottom = LinearLayout(this).apply { gravity = Gravity.CENTER; orientation = LinearLayout.HORIZONTAL }
        bottom.addView(makeKey("?123", 0xFF303346.toInt()) { currentInputConnection?.commitText("123", 1) }, weight(1.3f))
        bottom.addView(makeKey("☺", 0xFF303346.toInt()) { currentInputConnection?.commitText("☺", 1) }, weight(1f))
        bottom.addView(makeKey("English", 0xFF303346.toInt()) { currentInputConnection?.commitText(" ", 1) }, weight(4.2f))
        bottom.addView(makeKey(".", 0xFF303346.toInt()) { currentInputConnection?.commitText(".", 1) }, weight(1f))
        bottom.addView(makeKey("↵", 0xFF7560C8.toInt()) { currentInputConnection?.commitText("\\n", 1) }, weight(1.3f))
        root.addView(bottom)
        return root
    }

    private fun refreshKeys(root: LinearLayout) {
        // Shift state is applied to the next committed character; the next view rebuild reflects it.
        root.invalidate()
    }

    private fun makeKey(label: String, color: Int, action: () -> Unit): Button =
        Button(this).apply {
            text = if (shifted && label.length == 1) label.uppercase() else label
            textSize = 15f
            isAllCaps = false
            setTextColor(Color.WHITE)
            typeface = Typeface.DEFAULT_BOLD
            background = GradientDrawable().apply {
                setColor(color)
                cornerRadius = dp(7).toFloat()
            }
            minWidth = 0
            minimumWidth = 0
            minHeight = dp(43)
            minimumHeight = dp(43)
            setPadding(0, 0, 0, 0)
            layoutParams = LinearLayout.LayoutParams(0, dp(47), 1f).apply {
                setMargins(dp(2), dp(3), dp(2), dp(3))
            }
            setOnClickListener { action() }
        }

    private fun weight(value: Float) = LinearLayout.LayoutParams(0, dp(47), value)
    private fun dp(value: Int) = (value * resources.displayMetrics.density).toInt()
}
`;
}

module.exports = withNexKeyKeyboard;
