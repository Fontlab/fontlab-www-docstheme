---
this_file: src_docs/md/forms/validation.md
---

# Validation and submission

A useful validation message names the problem and the correction. Keep entered values, associate the message with its field and let readers try again. These forms demonstrate browser constraints without sending data.

The examples use the [shared theme and setup](../start/setup.md). Keep the
`.fltheme-components` wrapper around Basecoat and `du-` component markup.


## Otp · daisyUI { #daisyui-otp }

A single native input stores all six digits. The surrounding cells change the appearance without splitting paste or keyboard entry across six separate fields. These examples do not authenticate a user.

<!-- specimen:daisyui-otp html -->
<div class="fltheme-components">
<div class="fl-ui fl-ui-stack">
<span class="du-label" id="daisyui-otp-data-input-otp-empty-label">Six-digit verification code</span>
<label class="du-otp">
<span></span><span></span><span></span><span></span><span></span><span></span>
<input aria-labelledby="daisyui-otp-data-input-otp-empty-label" autocomplete="one-time-code" inputmode="numeric" maxlength="6" name="verification-code" pattern="[0-9]{6}" required type="text">
</label>
<span class="du-label" id="daisyui-otp-data-input-otp-filled-label">Filled example</span>
<label class="du-otp">
<span></span><span></span><span></span><span></span><span></span><span></span>
<input aria-labelledby="daisyui-otp-data-input-otp-filled-label" autocomplete="one-time-code" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" required type="text" value="482715">
</label>
<span class="du-label" id="daisyui-otp-data-input-otp-error-label">Code with an error</span>
<label class="du-otp du-otp-error">
<span></span><span></span><span></span><span></span><span></span><span></span>
<input aria-describedby="daisyui-otp-data-input-otp-error-message" aria-invalid="true" aria-labelledby="daisyui-otp-data-input-otp-error-label" autocomplete="one-time-code" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" required type="text" value="48271">
</label>
<p class="du-label" id="daisyui-otp-data-input-otp-error-message">Enter all six digits.</p>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/otp/)

## Validator · daisyUI { #daisyui-validator }

Native pattern validation checks the illustrative four-letter tag rule. The second field is deliberately invalid; a real form must update aria-invalid and its message after each validation attempt.

<!-- specimen:daisyui-validator html -->
<div class="fltheme-components">
<div class="fl-ui fl-ui-stack">
<label class="du-label" for="daisyui-validator-data-input-axis-valid">Axis tag</label>
<input aria-describedby="daisyui-validator-data-input-axis-help" class="du-input input-bordered du-validator" id="daisyui-validator-data-input-axis-valid" maxlength="4" minlength="4" pattern="[A-Za-z]{4}" required type="text" value="wght">
<p class="du-label" id="daisyui-validator-data-input-axis-help">Use exactly four letters.</p>
<label class="du-label" for="daisyui-validator-data-input-axis-invalid">Invalid axis tag example</label>
<input aria-describedby="daisyui-validator-data-input-axis-error" aria-invalid="true" class="du-input du-input-error du-validator" id="daisyui-validator-data-input-axis-invalid" maxlength="4" minlength="4" pattern="[A-Za-z]{4}" required type="text" value="12">
<p class="du-validator-hint" id="daisyui-validator-data-input-axis-error">Enter exactly four letters, such as <code>wdth</code>.</p>
</div>
</div>
<!-- /specimen -->

[Syntax and variants in daisyUI](https://daisyui.com/components/validator/)
