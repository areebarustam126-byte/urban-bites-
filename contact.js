/* ============================================================
   contact.js — Contact form validation + real API submission
   Sends form data to POST /api/contact and saves to database.
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const nameEl = document.getElementById('fullName');
    const emailEl = document.getElementById('email');
    const msgEl = document.getElementById('message');
    const nameErr = document.getElementById('nameErr');
    const emailErr = document.getElementById('emailErr');
    const msgErr = document.getElementById('msgErr');
    const success = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    const API_URL = '/api/contact';

    function setError(input, errEl, show) {
        input.classList.toggle('error', show);
        errEl.classList.toggle('visible', show);
    }

    function validatePhoneOrEmail(v) {
        const val = v.trim();
        if (!val) return false;
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        const isPhone = /^[\d\s+\-()\u202A-\u202C]{7,20}$/.test(val);
        return isEmail || isPhone;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let valid = true;

        // ── Client-side validation ──────────────────────────
        if (!nameEl.value.trim() || nameEl.value.trim().length < 2) {
            setError(nameEl, nameErr, true); valid = false;
        } else { setError(nameEl, nameErr, false); }

        if (!validatePhoneOrEmail(emailEl.value)) {
            setError(emailEl, emailErr, true); valid = false;
        } else { setError(emailEl, emailErr, false); }

        if (!msgEl.value.trim() || msgEl.value.trim().length < 4) {
            setError(msgEl, msgErr, true); valid = false;
        } else { setError(msgEl, msgErr, false); }

        if (!valid) return;

        // ── Show loading state ──────────────────────────────
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoad = submitBtn.querySelector('.btn-loading');
        const btnIcon = submitBtn.querySelector('.send-icon');
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoad.style.display = 'inline';
        if (btnIcon) btnIcon.style.display = 'none';

        // ── Send to backend ─────────────────────────────────
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nameEl.value.trim(),
                    contact: emailEl.value.trim(),
                    message: msgEl.value.trim(),
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // ── Success ─────────────────────────────────
                form.reset();
                success.style.display = 'flex';
                success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                setTimeout(() => { success.style.display = 'none'; }, 8000);
            } else {
                // Server returned validation errors
                const msg = data.errors
                    ? data.errors.map(err => err.msg).join(' ')
                    : (data.message || 'Something went wrong. Please try again.');
                if (typeof showToast === 'function') showToast(msg, '⚠️');
                else alert(msg);
            }
        } catch (err) {
            // Network / server offline error
            const msg = 'Could not reach the server. Please start the backend by running: node server.js';
            if (typeof showToast === 'function') showToast(msg, '❌');
            else alert(msg);
        } finally {
            // ── Restore button state ─────────────────────────
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoad.style.display = 'none';
            if (btnIcon) btnIcon.style.display = 'inline';
        }
    });

    // ── Live blur validation ────────────────────────────────
    nameEl.addEventListener('blur', () => {
        if (nameEl.value.trim().length >= 2) setError(nameEl, nameErr, false);
    });
    emailEl.addEventListener('blur', () => {
        if (validatePhoneOrEmail(emailEl.value)) setError(emailEl, emailErr, false);
    });
    msgEl.addEventListener('blur', () => {
        if (msgEl.value.trim().length >= 4) setError(msgEl, msgErr, false);
    });
});
