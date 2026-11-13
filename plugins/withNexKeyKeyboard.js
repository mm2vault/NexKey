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
    const drawableRoot = path.join(projectRoot, 'app/src/main/res/drawable');
    fs.mkdirSync(javaRoot, { recursive: true });
    fs.mkdirSync(xmlRoot, { recursive: true });
    fs.mkdirSync(drawableRoot, { recursive: true });
    fs.writeFileSync(path.join(javaRoot, 'NexKeyInputMethodService.kt'), kotlinSource(packageName));
    fs.writeFileSync(path.join(xmlRoot, 'nexkey_input_method.xml'), inputMethodXml);
    for (const [name, pathData] of Object.entries(keyIcons)) {
      fs.writeFileSync(path.join(drawableRoot, `${name}.xml`), vectorXml(pathData));
    }
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

// 24x24 vector icons for the function keys (tinted at runtime).
const keyIcons = {
  nexkey_ic_shift: 'M12,4 L4,13 L9,13 L9,20 L15,20 L15,13 L20,13 Z',
  nexkey_ic_backspace:
    'M22,3H7c-0.69,0 -1.23,0.35 -1.59,0.88L0,12l5.41,8.11c0.36,0.53 0.9,0.89 1.59,0.89h15c1.1,0 2,-0.9 2,-2V5c0,-1.1 -0.9,-2 -2,-2zM19,15.59L17.59,17 14,13.41 10.41,17 9,15.59 12.59,12 9,8.41 10.41,7 14,10.59 17.59,7 19,8.41 15.41,12 19,15.59z',
  nexkey_ic_enter: 'M19,7v4H5.83l3.58,-3.59L8,6l-6,6 6,6 1.41,-1.41L5.83,13H21V7z',
};

function vectorXml(pathData) {
  return `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FFFFFFFF"
        android:pathData="${pathData}" />
</vector>
`;
}

function kotlinSource(packageName) {
  return `package ${packageName}.keyboard

import android.content.res.Configuration
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.graphics.drawable.LayerDrawable
import android.graphics.drawable.StateListDrawable
import android.inputmethodservice.InputMethodService
import android.os.Handler
import android.os.Looper
import android.util.TypedValue
import android.view.Gravity
import android.view.HapticFeedbackConstants
import android.view.MotionEvent
import android.view.View
import android.view.inputmethod.EditorInfo
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView

/**
 * NexKey IME prototype with the premium visual design.
 * Text is committed directly through the active InputConnection and is not uploaded.
 * Colours follow the system light / dark setting.
 */
class NexKeyInputMethodService : InputMethodService() {
    private var shifted = false
    private var symbols = false
    private val rows = listOf("qwertyuiop", "asdfghjkl", "zxcvbnm")

    private class Palette(
        val background: Int,
        val key: Int,
        val keyPressed: Int,
        val fn: Int,
        val fnPressed: Int,
        val edge: Int,
        val accent: Int,
        val accentPressed: Int,
        val text: Int,
        val onAccent: Int,
        val hint: Int
    )

    private fun palette(): Palette {
        val night = (resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK) ==
            Configuration.UI_MODE_NIGHT_YES
        return if (night) {
            Palette(
                background = 0xFF14151D.toInt(),
                key = 0xFF2A2C3B.toInt(),
                keyPressed = 0xFF3C3F55.toInt(),
                fn = 0xFF1F2130.toInt(),
                fnPressed = 0xFF33364A.toInt(),
                edge = 0xFF0C0D13.toInt(),
                accent = 0xFF8B6CF0.toInt(),
                accentPressed = 0xFF7556DC.toInt(),
                text = 0xFFF5F5FA.toInt(),
                onAccent = Color.WHITE,
                hint = 0xFF8D91A6.toInt()
            )
        } else {
            Palette(
                background = 0xFFE7E7F0.toInt(),
                key = 0xFFFFFFFF.toInt(),
                keyPressed = 0xFFD9D9E8.toInt(),
                fn = 0xFFD2D3E2.toInt(),
                fnPressed = 0xFFC1C2D6.toInt(),
                edge = 0xFFB4B5C8.toInt(),
                accent = 0xFF6C4AE0.toInt(),
                accentPressed = 0xFF5A3BC4.toInt(),
                text = 0xFF14141C.toInt(),
                onAccent = Color.WHITE,
                hint = 0xFF5D6074.toInt()
            )
        }
    }

    override fun onCreateInputView(): View {
        val p = palette()
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(4), dp(2), dp(4), dp(8))
            setBackgroundColor(p.background)
        }

        root.addView(brandBar(p))

        val activeRows = if (symbols) {
            listOf("1234567890", "@#$%&*-+()", "!?:;_+=/")
        } else {
            rows
        }

        activeRows.forEachIndexed { index, row ->
            val line = LinearLayout(this).apply {
                gravity = Gravity.CENTER
                orientation = LinearLayout.HORIZONTAL
            }
            if (!symbols && index == 1) line.addView(spacer(0.5f))
            if (!symbols && index == 2) {
                line.addView(
                    iconKey(
                        "nexkey_ic_shift", "Shift",
                        if (shifted) p.accent else p.fn,
                        if (shifted) p.accentPressed else p.fnPressed,
                        if (shifted) p.onAccent else p.text, p
                    ) {
                        shifted = !shifted
                        setInputView(onCreateInputView())
                    },
                    weight(1.5f)
                )
            }
            row.forEach { character ->
                val label = if (!symbols && shifted) character.uppercaseChar().toString() else character.toString()
                line.addView(
                    textKey(label, p.key, p.keyPressed, p.text, p) {
                        currentInputConnection?.commitText(label, 1)
                        if (shifted) {
                            shifted = false
                            setInputView(onCreateInputView())
                        }
                    },
                    weight(1f)
                )
            }
            if (!symbols && index == 1) line.addView(spacer(0.5f))
            if (index == 2) {
                val backspace = iconKey("nexkey_ic_backspace", "Delete", p.fn, p.fnPressed, p.text, p) {}
                attachRepeat(backspace) { deleteBackward() }
                line.addView(backspace, weight(1.5f))
            }
            root.addView(line)
        }

        val bottom = LinearLayout(this).apply { gravity = Gravity.CENTER; orientation = LinearLayout.HORIZONTAL }
        bottom.addView(
            textKey(if (symbols) "ABC" else "?123", p.fn, p.fnPressed, p.text, p, 14f) {
                symbols = !symbols
                shifted = false
                setInputView(onCreateInputView())
            },
            weight(1.4f)
        )
        bottom.addView(
            textKey("☺", p.fn, p.fnPressed, p.text, p, 18f) { currentInputConnection?.commitText("☺", 1) },
            weight(1f)
        )
        bottom.addView(
            textKey("NexKey", p.key, p.keyPressed, p.hint, p, 13f) { currentInputConnection?.commitText(" ", 1) },
            weight(4.2f)
        )
        bottom.addView(
            textKey(".", p.key, p.keyPressed, p.text, p) { currentInputConnection?.commitText(".", 1) },
            weight(1f)
        )
        bottom.addView(
            iconKey("nexkey_ic_enter", "Enter", p.accent, p.accentPressed, p.onAccent, p) {
                val action = currentInputEditorInfo?.imeOptions?.and(EditorInfo.IME_MASK_ACTION)
                    ?: EditorInfo.IME_ACTION_NONE
                if (action != EditorInfo.IME_ACTION_NONE &&
                    action != EditorInfo.IME_ACTION_UNSPECIFIED
                ) {
                    currentInputConnection?.performEditorAction(action)
                } else {
                    currentInputConnection?.commitText("\\n", 1)
                }
            },
            weight(1.4f)
        )
        root.addView(bottom)
        return root
    }

    private fun deleteBackward() {
        val connection = currentInputConnection ?: return
        if (connection.getSelectedText(0).isNullOrEmpty()) {
            connection.deleteSurroundingTextInCodePoints(1, 0)
        } else {
            connection.commitText("", 1)
        }
    }

    private fun brandBar(p: Palette): TextView =
        TextView(this).apply {
            text = "NEXKEY"
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 10f)
            letterSpacing = 0.3f
            typeface = Typeface.create("sans-serif-medium", Typeface.NORMAL)
            setTextColor(p.hint)
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(10), 0, 0, 0)
            layoutParams = LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dp(24))
        }

    private fun shape(color: Int) = GradientDrawable().apply {
        setColor(color)
        cornerRadius = dp(9).toFloat()
    }

    /** A key face with a thin darker edge underneath, so keys feel raised. */
    private fun keyBackground(face: Int, pressedFace: Int, edge: Int): StateListDrawable {
        fun layer(color: Int) = LayerDrawable(arrayOf(shape(edge), shape(color))).apply {
            setLayerInset(1, 0, 0, 0, dp(2))
        }
        return StateListDrawable().apply {
            addState(intArrayOf(android.R.attr.state_pressed), layer(pressedFace))
            addState(intArrayOf(), layer(face))
        }
    }

    private fun baseKey(face: Int, pressedFace: Int, p: Palette): FrameLayout =
        FrameLayout(this).apply {
            background = keyBackground(face, pressedFace, p.edge)
            isClickable = true
            isFocusable = false
        }

    private fun textKey(
        label: String,
        face: Int,
        pressedFace: Int,
        textColor: Int,
        p: Palette,
        sizeSp: Float = 20f,
        action: () -> Unit
    ): FrameLayout {
        val key = baseKey(face, pressedFace, p)
        key.addView(
            TextView(this).apply {
                text = label
                setTextSize(TypedValue.COMPLEX_UNIT_SP, sizeSp)
                setTextColor(textColor)
                includeFontPadding = false
                typeface = Typeface.create("sans-serif-medium", Typeface.NORMAL)
                gravity = Gravity.CENTER
                isAllCaps = false
            },
            FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT)
        )
        key.setOnClickListener {
            key.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
            action()
        }
        return key
    }

    private fun iconKey(
        iconName: String,
        description: String,
        face: Int,
        pressedFace: Int,
        tint: Int,
        p: Palette,
        action: () -> Unit
    ): FrameLayout {
        val key = baseKey(face, pressedFace, p)
        key.contentDescription = description
        val resId = resources.getIdentifier(iconName, "drawable", packageName)
        val iconDrawable = if (resId != 0) getDrawable(resId) else null
        if (iconDrawable != null) {
            key.addView(
                ImageView(this).apply {
                    setImageDrawable(iconDrawable)
                    setColorFilter(tint)
                    importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_NO
                },
                FrameLayout.LayoutParams(dp(22), dp(22), Gravity.CENTER)
            )
        } else {
            key.addView(
                TextView(this).apply {
                    text = description
                    setTextColor(tint)
                    gravity = Gravity.CENTER
                },
                FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT)
            )
        }
        key.setOnClickListener {
            key.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
            action()
        }
        return key
    }

    /** Runs the action on press, then repeats it while the key is held (used for backspace). */
    private fun attachRepeat(view: View, action: () -> Unit) {
        val handler = Handler(Looper.getMainLooper())
        val repeat = object : Runnable {
            override fun run() {
                action()
                handler.postDelayed(this, 55)
            }
        }
        view.setOnClickListener(null)
        view.setOnTouchListener { v, event ->
            when (event.actionMasked) {
                MotionEvent.ACTION_DOWN -> {
                    v.isPressed = true
                    v.performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                    action()
                    handler.postDelayed(repeat, 380)
                }
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                    v.isPressed = false
                    handler.removeCallbacks(repeat)
                }
            }
            true
        }
    }

    private fun spacer(value: Float) = View(this).apply {
        layoutParams = LinearLayout.LayoutParams(0, dp(46), value)
    }

    private fun weight(value: Float) = LinearLayout.LayoutParams(0, dp(46), value).apply {
        setMargins(dp(3), dp(4), dp(3), dp(4))
    }

    private fun dp(value: Int) = (value * resources.displayMetrics.density).toInt()
}
`;
}

module.exports = withNexKeyKeyboard;
