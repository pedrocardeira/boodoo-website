"use client";

import { Printer } from "lucide-react";

const rows = Array.from({ length: 12 }, (_, index) => index + 1);

export default function PrintableFeedingLog() {
  return (
    <section className="rounded-[2rem] border border-[#f4d5d8] bg-white p-5 shadow-[0_24px_70px_rgba(48,48,61,0.08)] print:border-0 print:p-0 print:shadow-none sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between print:block">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[#ff5865] print:text-black">
            BooDoo printable
          </p>
          <h2 className="mt-2 text-3xl font-black text-[#30303d] print:text-black">
            Baby Feeding Log
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#74727e] print:text-black">
            Type into the fields before printing, or print a blank copy and complete it by hand.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ff5865] px-5 text-sm font-black text-white transition hover:bg-[#e24752] print:hidden"
        >
          <Printer size={17} aria-hidden="true" />
          Print this log
        </button>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3 print:grid-cols-3">
        <label className="text-xs font-black uppercase tracking-[0.08em] text-[#696875] print:text-black">
          Baby’s name
          <input
            type="text"
            className="mt-2 w-full rounded-xl border border-[#e9d8da] bg-[#faf9f7] px-3 py-2 text-base font-semibold normal-case tracking-normal text-[#30303d] outline-none focus:border-[#ff8f99] print:border-black print:bg-white"
          />
        </label>
        <label className="text-xs font-black uppercase tracking-[0.08em] text-[#696875] print:text-black">
          Date
          <input
            type="date"
            className="mt-2 w-full rounded-xl border border-[#e9d8da] bg-[#faf9f7] px-3 py-2 text-base font-semibold normal-case tracking-normal text-[#30303d] outline-none focus:border-[#ff8f99] print:border-black print:bg-white"
          />
        </label>
        <label className="text-xs font-black uppercase tracking-[0.08em] text-[#696875] print:text-black">
          Caregiver
          <input
            type="text"
            className="mt-2 w-full rounded-xl border border-[#e9d8da] bg-[#faf9f7] px-3 py-2 text-base font-semibold normal-case tracking-normal text-[#30303d] outline-none focus:border-[#ff8f99] print:border-black print:bg-white"
          />
        </label>
      </div>

      <div className="mt-7 overflow-x-auto print:overflow-visible">
        <table className="w-full min-w-[840px] border-collapse text-left text-sm print:min-w-0 print:text-[10px]">
          <thead>
            <tr className="bg-[#fff1f2] print:bg-white">
              <th className="border border-[#e9d8da] p-3 font-black print:border-black">Time</th>
              <th className="border border-[#e9d8da] p-3 font-black print:border-black">Feed type</th>
              <th className="border border-[#e9d8da] p-3 font-black print:border-black">Amount / duration</th>
              <th className="border border-[#e9d8da] p-3 font-black print:border-black">Wet diaper</th>
              <th className="border border-[#e9d8da] p-3 font-black print:border-black">Dirty diaper</th>
              <th className="border border-[#e9d8da] p-3 font-black print:border-black">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                {[
                  "Time",
                  "Feed type",
                  "Amount or duration",
                  "Wet diaper",
                  "Dirty diaper",
                  "Notes"
                ].map((label) => (
                  <td
                    key={label}
                    contentEditable
                    suppressContentEditableWarning
                    aria-label={`${label}, entry ${row}`}
                    className="h-12 border border-[#e9d8da] p-2 align-top outline-none focus:bg-[#fff8f8] print:h-9 print:border-black"
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 print:grid-cols-2">
        <label className="text-xs font-black uppercase tracking-[0.08em] text-[#696875] print:text-black">
          Daily notes
          <textarea
            rows={4}
            className="mt-2 w-full resize-none rounded-xl border border-[#e9d8da] bg-[#faf9f7] p-3 text-base font-medium normal-case tracking-normal text-[#30303d] outline-none focus:border-[#ff8f99] print:border-black print:bg-white print:text-sm"
          />
        </label>
        <div className="rounded-xl border border-[#e9d8da] bg-[#faf9f7] p-4 text-sm font-medium leading-6 text-[#74727e] print:border-black print:bg-white print:text-black">
          <strong className="block text-[#30303d] print:text-black">For appointments</strong>
          Bring the log if your healthcare professional asks about feeding or diaper patterns. Add any specific information they request in the notes field.
        </div>
      </div>

      <p className="mt-5 text-xs font-medium leading-5 text-[#8b8994] print:text-black">
        This log organizes information only. It does not provide feeding targets, diagnosis or medical advice. Contact a qualified healthcare professional if you are worried about feeding, hydration, growth or your baby’s condition.
      </p>
    </section>
  );
}
