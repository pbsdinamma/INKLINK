"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "Is InkLink really free with zero sign-up?",
    a: "Yes! There are no accounts, subscriptions, or login forms. Simply pick a nickname, hit 'Create Room', and you get an instant collaborative canvas link you can share with anyone.",
  },
  {
    q: "Can multiple people draw simultaneously without lag?",
    a: "Absolutely. InkLink uses WebSockets with lightweight point delta compression running at 60 FPS. Every stroke point is synchronized in real-time as your pen glides across the canvas.",
  },
  {
    q: "How does the Canvas Replay feature work?",
    a: "The server maintains an immutable timeline of every stroke created in the room. When you click 'Replay', InkLink rewinds the canvas and animates every single stroke in chronological sequence like a time machine.",
  },
  {
    q: "Does it work on mobile and tablet touchscreens?",
    a: "Yes! The canvas is fully responsive and supports touch events with native pointer capture. You can sketch with your finger, Apple Pencil, or stylus on phones and iPads without accidental page scrolling.",
  },
  {
    q: "How do I save or share my finished artwork?",
    a: "Click the 'Download' icon in the toolbar (or press [D]) to instantly export the whiteboard as a high-resolution, transparent-ready PNG image with a clean white canvas background.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((cur) => (cur === idx ? null : idx));
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <motion.div
            key={faq.q}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 350, damping: 25, delay: idx * 0.04 }}
            className="skribbl-card overflow-hidden bg-white border-3 border-[#13141f] rounded-2xl shadow-[0_4px_0px_#13141f] transition-all"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-brand-bg/40 transition-colors"
            >
              <span className="text-sm sm:text-base font-black text-[#13141f]">
                {faq.q}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="w-6 h-6 rounded-lg bg-brand-bg border-2 border-brand-border flex items-center justify-center shrink-0 ml-3 text-brand-blue"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm font-bold text-brand-border/70 leading-relaxed border-t-2 border-brand-border/10">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
