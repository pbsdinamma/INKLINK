"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Is it really free and without account signup?",
    a: "Yes! InkLink assigns dynamic cryptographic rooms instantly. No emails, no passwords, no onboarding walls. Share the unique room link with colleagues and begin drawing instantly together.",
  },
  {
    q: "How does the real-time sync keep latency under 16ms?",
    a: "We transmit compressed vector coordinate deltas over low-overhead WebSockets with client-side spline prediction. Even on slower networks, line strokes render smoothly at full display refresh rate.",
  },
  {
    q: "Can I export high-resolution vector images or presentations?",
    a: "You can export transparent PNGs, SVGs, or trigger Slide Mode for instant frame-by-frame client walkthroughs and timeline replays right in any modern web browser.",
  },
  {
    q: "Does it work smoothly on tablets and stylus devices?",
    a: "Full native touch and Apple Pencil / stylus pressure support is built right into the rendering pipeline with palm rejection and variable line weight dynamics.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((cur) => (cur === idx ? null : idx));
  };

  return (
    <div className="space-y-4">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={faq.q}
            className="bg-white rounded-2xl border-2 border-slate-900 p-6 shadow-brutal transition-all"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between font-bold text-base sm:text-lg text-slate-900 cursor-pointer text-left"
            >
              <span>{faq.q}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 ml-4"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="mt-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
