import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { CONTACT, CONTACT_FORM } from "../constants";

const inputClasses =
  "w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-300 outline-none transition-colors focus:border-cyan-500";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_ERRORS = { name: "", email: "", message: "" };

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const REQUEST_TIMEOUT_MS = 15000;

const errorMessage = (
  <>
    {CONTACT_FORM.toast.errorPrefix}
    <a href={`mailto:${CONTACT.email}`} className="underline">{CONTACT.email}</a>
    {CONTACT_FORM.toast.errorSuffix}
  </>
);

const ContactForm = ({ onResult }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [isSending, setIsSending] = useState(false);
  const honeypotRef = useRef(null);
  // Synchronous re-entrancy guard: `isSending` state only disables the button
  // after React re-renders, which doesn't stop two submits fired before that
  // render commits (double-click, or Enter in two fields back-to-back).
  const isSendingRef = useRef(false);
  // Tracks whether this component is still mounted, and holds the in-flight
  // request's controller so it can be aborted if the modal closes mid-submit
  // (previously impossible when this form was always mounted on the page).
  const isMountedRef = useRef(true);
  const controllerRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = { ...EMPTY_ERRORS };

    if (!formData.name.trim()) nextErrors.name = CONTACT_FORM.errors.name;
    if (!formData.email.trim() || !EMAIL_REGEX.test(formData.email.trim())) {
      nextErrors.email = CONTACT_FORM.errors.email;
    }
    if (!formData.message.trim()) nextErrors.message = CONTACT_FORM.errors.message;

    setErrors(nextErrors);

    const isValid = !nextErrors.name && !nextErrors.email && !nextErrors.message;
    return { isValid };
  };

  const buildPayload = () => ({
    access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
    name: formData.name.trim(),
    email: formData.email.trim(),
    message: formData.message.trim(),
    // Function replacer avoids `$&`/`$\``/`$'` being interpreted as special
    // patterns if a visitor's name happens to contain them.
    subject: CONTACT_FORM.subjectTemplate.replace("{name}", () => formData.name.trim()),
    from_name: formData.name.trim(),
    replyto: formData.email.trim(),
    botcheck: honeypotRef.current ? honeypotRef.current.checked : false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSendingRef.current) return;

    const { isValid } = validate();
    if (!isValid) return;

    isSendingRef.current = true;
    setIsSending(true);
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
        signal: controller.signal,
      });
      const data = await response.json();

      if (!isMountedRef.current) return;

      if (data && data.success === true) {
        setFormData({ name: "", email: "", message: "" });
        onResult("success", CONTACT_FORM.toast.success);
      } else {
        onResult("error", errorMessage);
      }
    } catch {
      // Covers both a real failure (network/timeout) and the modal being
      // closed mid-submit, which also aborts via the unmount effect above.
      // Only the former should surface a toast — isMountedRef distinguishes
      // them, since it's already false by the time an unmount-triggered
      // abort reaches this catch block.
      if (isMountedRef.current) {
        onResult("error", errorMessage);
      }
    } finally {
      clearTimeout(timeoutId);
      isSendingRef.current = false;
      if (isMountedRef.current) {
        setIsSending(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-5">
        <label htmlFor="contact-name" className="mb-1 block text-sm text-neutral-400">
          {CONTACT_FORM.labels.name}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          maxLength={CONTACT_FORM.maxLength.name}
          placeholder={CONTACT_FORM.placeholders.name}
          aria-invalid={!!errors.name}
          aria-describedby="contact-name-error"
          className={inputClasses}
        />
        <span id="contact-name-error" className="mt-1 block text-xs text-red-400 empty:hidden">{errors.name}</span>
      </div>

      <div className="mb-5">
        <label htmlFor="contact-email" className="mb-1 block text-sm text-neutral-400">
          {CONTACT_FORM.labels.email}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          maxLength={CONTACT_FORM.maxLength.email}
          placeholder={CONTACT_FORM.placeholders.email}
          aria-invalid={!!errors.email}
          aria-describedby="contact-email-error"
          className={inputClasses}
        />
        <span id="contact-email-error" className="mt-1 block text-xs text-red-400 empty:hidden">{errors.email}</span>
      </div>

      <div className="mb-5">
        <label htmlFor="contact-message" className="mb-1 block text-sm text-neutral-400">
          {CONTACT_FORM.labels.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          maxLength={CONTACT_FORM.maxLength.message}
          placeholder={CONTACT_FORM.placeholders.message}
          aria-invalid={!!errors.message}
          aria-describedby="contact-message-error"
          rows={5}
          className={`${inputClasses} resize-y`}
        />
        <span id="contact-message-error" className="mt-1 block text-xs text-red-400 empty:hidden">{errors.message}</span>
      </div>

      {/* Honeypot — real visitors never see or fill this. Its value is read at
          submit time and passed through to Web3Forms as-is. */}
      <input
        type="checkbox"
        name="botcheck"
        ref={honeypotRef}
        style={{ display: "none" }}
      />

      <button
        type="submit"
        disabled={isSending}
        className="w-full rounded-lg bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSending ? CONTACT_FORM.button.sending : CONTACT_FORM.button.idle}
      </button>
    </form>
  );
};

ContactForm.propTypes = {
  onResult: PropTypes.func.isRequired,
};

export default ContactForm;
