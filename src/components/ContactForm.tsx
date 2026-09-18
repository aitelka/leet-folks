"use client";

import { useActionState, useEffect, useState } from "react";
import {
  budgets,
  buildMessage,
  emptyEnquiry,
  initialEnquiryState,
  platforms,
  projectTypes,
  timelines,
  type Enquiry,
  type EnquiryState,
  type Option,
} from "@/lib/enquiry";
import { sendEnquiry } from "@/app/contact/actions";
import { contact } from "@/lib/content";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="field__error" id={id} role="alert">
      {message}
    </p>
  );
}

/** Chips are real inputs with a styled label, so keyboard and AT behave. */
function ChoiceGroup({
  name,
  options,
  multiple,
  selected,
  onToggle,
  describedBy,
}: {
  name: string;
  options: Option[];
  multiple: boolean;
  selected: string[];
  onToggle: (id: string) => void;
  describedBy?: string;
}) {
  return (
    <div className="choices">
      {options.map((option) => {
        const checked = selected.includes(option.id);
        return (
          <label
            className="choice"
            key={option.id}
            data-checked={checked}
            data-rich={Boolean(option.detail)}
          >
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              value={option.id}
              checked={checked}
              onChange={() => onToggle(option.id)}
              aria-describedby={describedBy}
            />
            <span className="choice__mark" aria-hidden="true" />
            <span className="choice__text">
              <span className="choice__label">{option.label}</span>
              {option.detail ? (
                <span className="choice__detail">{option.detail}</span>
              ) : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export default function ContactForm() {
  const [state, formAction, pending] = useActionState<EnquiryState, FormData>(
    sendEnquiry,
    initialEnquiryState,
  );
  const [enquiry, setEnquiry] = useState<Enquiry>(emptyEnquiry);
  const [startedAt, setStartedAt] = useState(0);

  // Both renders start at 0 so hydration matches — the server has no clock to
  // agree with. The stamp is then set from a frame callback rather than
  // straight out of the effect body, which would be a cascading render.
  //
  // It has to be React state, not a value written onto the DOM node: an
  // uncontrolled input is reset to its defaultValue on the next re-render, and
  // this form re-renders on every keystroke, so the stamp was being wiped the
  // moment anyone touched a field.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setStartedAt(Date.now()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const set = <K extends keyof Enquiry>(key: K, value: Enquiry[K]) =>
    setEnquiry((prev) => ({ ...prev, [key]: value }));

  const toggleMany = (key: "types" | "platforms") => (id: string) =>
    setEnquiry((prev) => ({
      ...prev,
      [key]: prev[key].includes(id)
        ? prev[key].filter((v) => v !== id)
        : [...prev[key], id],
    }));

  const errors = state.errors ?? {};
  const preview = buildMessage(enquiry);

  if (state.status === "sent") {
    return (
      <div className="sent" role="status">
        <span className="sent__tick" aria-hidden="true">
          ✓
        </span>
        <h2 className="sent__title">That is with us.</h2>
        <p className="sent__body">
          It landed in the studio inbox, and a reply goes to{" "}
          <strong>{enquiry.email}</strong> — usually within one working day. If
          nothing arrives, check your spam folder, then write to{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a> directly.
        </p>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            setEnquiry(emptyEnquiry);
            window.location.reload();
          }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <div className="enquiry">
      <form action={formAction} className="enquiryForm" noValidate>
        {/* Bot bait: off-screen, not display:none, and flagged to autofill and
            password managers so no real person or tool fills it in. */}
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="company_website">Do not fill this in</label>
          <input
            id="company_website"
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <input type="hidden" name="started_at" value={startedAt} readOnly />

        <fieldset className="field">
          <legend className="field__legend">
            <span className="field__num">01</span>
            What do you need built?
          </legend>
          <p className="field__hint">Pick as many as apply.</p>
          <ChoiceGroup
            name="types"
            options={projectTypes}
            multiple
            selected={enquiry.types}
            onToggle={toggleMany("types")}
            describedBy={errors.types ? "err-types" : undefined}
          />
          <FieldError id="err-types" message={errors.types} />
        </fieldset>

        <fieldset className="field">
          <legend className="field__legend">
            <span className="field__num">02</span>
            Where should it run?
          </legend>
          <p className="field__hint">Optional — we will advise if you are unsure.</p>
          <ChoiceGroup
            name="platforms"
            options={platforms}
            multiple
            selected={enquiry.platforms}
            onToggle={toggleMany("platforms")}
          />
        </fieldset>

        <fieldset className="field">
          <legend className="field__legend">
            <span className="field__num">03</span>
            When would you start?
          </legend>
          <ChoiceGroup
            name="timeline"
            options={timelines}
            multiple={false}
            selected={enquiry.timeline ? [enquiry.timeline] : []}
            onToggle={(id) => set("timeline", id)}
            describedBy={errors.timeline ? "err-timeline" : undefined}
          />
          <FieldError id="err-timeline" message={errors.timeline} />
        </fieldset>

        <fieldset className="field">
          <legend className="field__legend">
            <span className="field__num">04</span>
            Rough budget
          </legend>
          <p className="field__hint">
            Optional, and not binding — it tells us what shape of build to
            propose.
          </p>
          <ChoiceGroup
            name="budget"
            options={budgets}
            multiple={false}
            selected={enquiry.budget ? [enquiry.budget] : []}
            onToggle={(id) => set("budget", id)}
          />
        </fieldset>

        <fieldset className="field">
          <legend className="field__legend">
            <span className="field__num">05</span>
            Who are we replying to?
          </legend>
          <div className="inputs">
            <label className="input">
              <span className="input__label">Your name</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                maxLength={100}
                value={enquiry.name}
                onChange={(e) => set("name", e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "err-name" : undefined}
              />
              <FieldError id="err-name" message={errors.name} />
            </label>

            <label className="input">
              <span className="input__label">Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                maxLength={200}
                value={enquiry.email}
                onChange={(e) => set("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "err-email" : undefined}
              />
              <FieldError id="err-email" message={errors.email} />
            </label>

            <label className="input input--wide">
              <span className="input__label">
                Company <i>optional</i>
              </span>
              <input
                type="text"
                name="company"
                autoComplete="organization"
                maxLength={120}
                value={enquiry.company}
                onChange={(e) => set("company", e.target.value)}
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="field">
          <legend className="field__legend">
            <span className="field__num">06</span>
            Tell us about it
          </legend>
          <p className="field__hint">
            What it is, who it is for, and anything that already exists.
          </p>
          <label className="input">
            <span className="sr-only">The brief</span>
            <textarea
              name="brief"
              rows={7}
              maxLength={4000}
              value={enquiry.brief}
              onChange={(e) => set("brief", e.target.value)}
              aria-invalid={Boolean(errors.brief)}
              aria-describedby={errors.brief ? "err-brief" : "brief-count"}
            />
            <span className="input__count" id="brief-count">
              {enquiry.brief.length} / 4000
            </span>
            <FieldError id="err-brief" message={errors.brief} />
          </label>
        </fieldset>

        {errors.form ? (
          <p className="formError" role="alert">
            {errors.form}
          </p>
        ) : null}

        <div className="enquiryForm__submit">
          <button type="submit" className="btn btn--primary" disabled={pending}>
            {pending ? "Sending…" : "Send this message"}
            {pending ? null : (
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            )}
          </button>
          <p className="enquiryForm__note">
            Goes straight to {contact.email}. No list, no CRM, no follow-up
            sequence.
          </p>
        </div>
      </form>

      {/* The same buildMessage() the server calls, so this is not a mock-up of
          the email — it is the email. */}
      <aside className="previewPane" aria-label="Preview of your message">
        <div className="previewPane__inner">
          <p className="previewPane__label">
            <span className="previewPane__dot" aria-hidden="true" />
            What we will receive
          </p>
          <div className="previewPane__head">
            <span>To</span>
            <b>{contact.email}</b>
            <span>Subject</span>
            <b>{preview.subject}</b>
          </div>
          <pre className="previewPane__body">{preview.body}</pre>
        </div>
      </aside>
    </div>
  );
}
