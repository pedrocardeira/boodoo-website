"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

type FormStatus = "idle" | "sending" | "sent" | "error";

export function QuestionForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");

    try {
      const response = await fetch("https://formsubmit.co/ajax/support@boodoo.app", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Unable to send question");
      }

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      action="https://formsubmit.co/support@boodoo.app"
      method="post"
      target="boodoo-question-fallback"
      onSubmit={handleSubmit}
      className="mt-10 rounded-[2rem] border border-[#f4d5d8] bg-white p-6 shadow-[0_24px_70px_rgba(48,48,61,0.07)]"
    >
      <input type="hidden" name="_subject" value="New BooDoo question" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <iframe name="boodoo-question-fallback" title="Question form fallback" className="hidden" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-black text-[#30303d]">
          Name
          <input
            name="name"
            type="text"
            autoComplete="name"
            className="min-h-12 rounded-2xl border border-[#f4d5d8] bg-[#f7f6f4] px-4 text-base font-semibold text-[#30303d] outline-none transition focus:border-[#ff5865] focus:bg-white"
          />
        </label>
        <label className="grid gap-2 text-sm font-black text-[#30303d]">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="min-h-12 rounded-2xl border border-[#f4d5d8] bg-[#f7f6f4] px-4 text-base font-semibold text-[#30303d] outline-none transition focus:border-[#ff5865] focus:bg-white"
          />
        </label>
      </div>
      <label className="mt-4 grid gap-2 text-sm font-black text-[#30303d]">
        Question
        <textarea
          name="question"
          rows={5}
          required
          className="resize-none rounded-2xl border border-[#f4d5d8] bg-[#f7f6f4] px-4 py-3 text-base font-semibold leading-7 text-[#30303d] outline-none transition focus:border-[#ff5865] focus:bg-white"
        />
      </label>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ff5865] px-7 text-sm font-black text-white shadow-[0_18px_45px_rgba(255,88,101,0.24)] transition hover:bg-[#e24752] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5865] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Send size={17} aria-hidden />
          {status === "sending" ? "Sending..." : "Send question"}
        </button>
        <p
          role="status"
          aria-live="polite"
          className={`text-sm font-black ${
            status === "error" ? "text-[#c03642]" : "text-[#4f9c67]"
          }`}
        >
          {status === "sent" ? "Sent, thank you." : null}
          {status === "error" ? "Could not send. Please email support@boodoo.app." : null}
        </p>
      </div>
    </form>
  );
}
