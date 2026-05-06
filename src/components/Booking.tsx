import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { format, startOfToday, isSunday, isBefore } from "date-fns";
import { da } from "date-fns/locale";
import { services, type Service } from "@/data/services";
import { supabase } from "@/lib/supabase";

const MAX_CAPACITY = 2;

// ── helpers ──────────────────────────────────────────────────────────────────

function getHours(date: Date): { open: string; close: string } | null {
  const day = date.getDay();
  if (day === 0) return null;
  return { open: "09:00", close: "19:00" };
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(m: number) {
  return `${Math.floor(m / 60).toString().padStart(2, "0")}:${(m % 60).toString().padStart(2, "0")}`;
}

function generateSlots(open: string, close: string, durationMin: number): string[] {
  const slots: string[] = [];
  const end = timeToMinutes(close) - durationMin;
  for (let t = timeToMinutes(open); t <= end; t += 15) slots.push(minutesToTime(t));
  return slots;
}

function buildCalendar(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7;
  const weeks: (Date | null)[][] = [];
  let week: (Date | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length) { while (week.length < 7) week.push(null); weeks.push(week); }
  return weeks;
}

function findNearestAvailable(full: string, slots: string[], capacityMap: Map<string, number>): string[] {
  const available = slots.filter(s => (capacityMap.get(s) ?? 0) < MAX_CAPACITY && s !== full);
  const fullMin = timeToMinutes(full);
  available.sort((a, b) => Math.abs(timeToMinutes(a) - fullMin) - Math.abs(timeToMinutes(b) - fullMin));
  const before = available.filter(s => timeToMinutes(s) < fullMin)[0];
  const after = available.filter(s => timeToMinutes(s) > fullMin)[0];
  if (before && after) return [before, after];
  return available.slice(0, 2);
}

// ── storage ───────────────────────────────────────────────────────────────────

async function saveBooking(b: {
  service: string; price: string; date: string; time: string;
  duration: number; name: string; phone: string; email: string; note?: string;
}) {
  const { error } = await supabase.from("bookings").insert([b]);
  if (error) throw error;
}

// ── step indicator ────────────────────────────────────────────────────────────

const STEPS = ["Ydelse", "Dato", "Tid", "Oplysninger"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-8">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors
              ${i < current ? "bg-primary text-background" : i === current ? "bg-primary text-background ring-2 ring-primary ring-offset-2 ring-offset-background" : "bg-secondary text-muted-foreground"}`}>
              {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-[10px] hidden sm:block ${i === current ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`w-6 sm:w-8 h-px mb-4 ${i < current ? "bg-primary" : "bg-border"}`} />}
        </div>
      ))}
    </div>
  );
}

// ── step 1: service ───────────────────────────────────────────────────────────

function Step1({ selected, onSelect }: { selected: Service | null; onSelect: (s: Service) => void }) {
  return (
    <div>
      <h3 className="font-display text-xl font-semibold mb-5 text-center">Vælg ydelse</h3>
      <ul className="space-y-1.5">
        {services.map((s) => (
          <li key={s.name}>
            <button type="button" onClick={() => onSelect(s)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-md border text-left transition-colors touch-manipulation
                ${selected?.name === s.name ? "border-primary bg-primary/10" : "border-border active:bg-secondary"}`}>
              <span className="font-medium text-sm">{s.name}</span>
              <span className={`text-sm font-semibold whitespace-nowrap ml-4 ${selected?.name === s.name ? "text-primary" : "text-muted-foreground"}`}>{s.price}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── step 2: date ──────────────────────────────────────────────────────────────

const DOW = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

function Step2({ selected, onSelect }: { selected: Date | null; onSelect: (d: Date) => void }) {
  const today = startOfToday();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const weeks = buildCalendar(viewYear, viewMonth);

  function prevMonth() { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); } else setViewMonth(m => m - 1); }
  function nextMonth() { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); } else setViewMonth(m => m + 1); }

  return (
    <div>
      <h3 className="font-display text-xl font-semibold mb-5 text-center">Vælg dato</h3>
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={prevMonth} className="p-2 rounded-md hover:bg-secondary active:bg-secondary transition-colors touch-manipulation"><ChevronLeft className="w-5 h-5" /></button>
        <span className="text-sm font-medium capitalize">{format(new Date(viewYear, viewMonth, 1), "MMMM yyyy", { locale: da })}</span>
        <button type="button" onClick={nextMonth} className="p-2 rounded-md hover:bg-secondary active:bg-secondary transition-colors touch-manipulation"><ChevronRight className="w-5 h-5" /></button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DOW.map(d => <div key={d} className="text-center text-[11px] text-muted-foreground font-medium py-1">{d}</div>)}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map((day, di) => {
            if (!day) return <div key={`empty-${wi}-${di}`} />;
            const disabled = isBefore(day, today) || isSunday(day);
            const isSelected = selected ? format(day, "yyyy-MM-dd") === format(selected, "yyyy-MM-dd") : false;
            return (
              <button key={format(day, "yyyy-MM-dd")} type="button" disabled={disabled} onClick={() => onSelect(day)}
                className={`aspect-square flex items-center justify-center rounded-md text-sm transition-colors m-px touch-manipulation min-h-[44px]
                  ${disabled ? "text-muted-foreground/30 cursor-not-allowed" : ""}
                  ${isSelected ? "bg-primary text-background font-semibold" : ""}
                  ${!disabled && !isSelected ? "active:bg-secondary" : ""}`}>
                {day.getDate()}
              </button>
            );
          })}
        </div>
      ))}
      <p className="text-muted-foreground text-xs text-center mt-3">Lukket søndag</p>
    </div>
  );
}

// ── step 3: time ──────────────────────────────────────────────────────────────

function Step3({ date, duration, selected, onSelect, capacityMap, capacityLoading }: {
  date: Date; duration: number; selected: string | null; onSelect: (t: string) => void;
  capacityMap: Map<string, number>; capacityLoading: boolean;
}) {
  const [fullSlotClicked, setFullSlotClicked] = useState<string | null>(null);
  const hours = getHours(date);
  if (!hours) return <p className="text-center text-muted-foreground">Lukket denne dag.</p>;
  const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const nowMinutes = isToday ? new Date().getHours() * 60 + new Date().getMinutes() : 0;
  const slots = generateSlots(hours.open, hours.close, duration);
  const suggestions = fullSlotClicked ? findNearestAvailable(fullSlotClicked, slots, capacityMap) : [];

  function handleSlotClick(slot: string) {
    const count = capacityMap.get(slot) ?? 0;
    if (count >= MAX_CAPACITY) {
      setFullSlotClicked(slot);
      onSelect("");
    } else {
      setFullSlotClicked(null);
      onSelect(slot);
    }
  }

  return (
    <div>
      <h3 className="font-display text-xl font-semibold mb-1 text-center">Vælg tid</h3>
      <p className="text-muted-foreground text-sm text-center mb-5 capitalize">{format(date, "EEEE d. MMMM", { locale: da })}</p>

      {capacityLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {slots.map((slot) => {
              const full = (capacityMap.get(slot) ?? 0) >= MAX_CAPACITY;
              const past = isToday && timeToMinutes(slot) <= nowMinutes;
              const disabled = full || past;
              const isSelected = selected === slot && !disabled;
              return (
                <button key={slot} type="button" onClick={() => !past && handleSlotClick(slot)} disabled={disabled}
                  className={`py-3 rounded-md border text-sm font-medium transition-colors touch-manipulation relative
                    ${disabled ? "border-border/30 text-muted-foreground/30 cursor-not-allowed bg-secondary/30" : ""}
                    ${isSelected ? "border-primary bg-primary/10 text-primary" : ""}
                    ${!disabled && !isSelected ? "border-border active:bg-secondary" : ""}`}>
                  {slot}
                  {full && !past && <span className="block text-[9px] text-muted-foreground/40 leading-none mt-0.5">Optaget</span>}
                </button>
              );
            })}
          </div>

          {fullSlotClicked && (
            <div className="mt-4 rounded-md bg-secondary border border-border p-3.5 text-sm">
              <p className="text-muted-foreground mb-2">
                <span className="text-foreground font-medium">{fullSlotClicked}</span> er desværre fuldt booket.
              </p>
              {suggestions.length > 0 && (
                <>
                  <p className="text-muted-foreground text-xs mb-2">Nærmeste ledige tider:</p>
                  <div className="flex gap-2">
                    {suggestions.map(s => (
                      <button key={s} type="button" onClick={() => { setFullSlotClicked(null); onSelect(s); }}
                        className="px-4 py-2 rounded-md border border-primary text-primary text-sm font-medium hover:bg-primary/10 transition-colors touch-manipulation">
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── step 4: contact ───────────────────────────────────────────────────────────

function Step4({ service, date, time, name, phone, email, note, onName, onPhone, onEmail, onNote }: {
  service: Service; date: Date; time: string;
  name: string; phone: string; email: string; note: string;
  onName: (v: string) => void; onPhone: (v: string) => void; onEmail: (v: string) => void; onNote: (v: string) => void;
}) {
  return (
    <div>
      <h3 className="font-display text-xl font-semibold mb-5 text-center">Dine oplysninger</h3>
      <div className="bg-secondary rounded-md p-4 mb-5 space-y-1.5 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Ydelse</span><span className="font-medium">{service.name}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Dato</span><span className="font-medium capitalize">{format(date, "EEEE d. MMMM", { locale: da })}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Tid</span><span className="font-medium">{time}</span></div>
        <div className="flex justify-between border-t border-border pt-1.5 mt-0.5"><span className="text-muted-foreground">Pris</span><span className="font-semibold text-primary">{service.price}</span></div>
      </div>
      <div className="space-y-3.5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Navn</label>
          <input type="text" required value={name} onChange={e => onName(e.target.value)} placeholder="Dit fulde navn"
            className="w-full rounded-md border border-border bg-secondary px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-primary transition-shadow" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Telefonnummer</label>
          <input type="tel" required value={phone} onChange={e => onPhone(e.target.value)} placeholder="+45 12 34 56 78"
            className="w-full rounded-md border border-border bg-secondary px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-primary transition-shadow" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input type="email" required value={email} onChange={e => onEmail(e.target.value)} placeholder="din@email.dk"
            className="w-full rounded-md border border-border bg-secondary px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-primary transition-shadow" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Note <span className="text-muted-foreground font-normal">(valgfri)</span>
          </label>
          <textarea value={note} onChange={e => onNote(e.target.value)} placeholder="Fx særlige ønsker eller info til frisøren..."
            rows={2}
            className="w-full rounded-md border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary transition-shadow resize-none" />
        </div>
      </div>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

const Booking = () => {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [capacityMap, setCapacityMap] = useState<Map<string, number>>(new Map());
  const [capacityLoading, setCapacityLoading] = useState(false);

  useEffect(() => {
    if (!date || step !== 2) return;
    setCapacityLoading(true);
    supabase
      .from("bookings")
      .select("time")
      .eq("date", format(date, "yyyy-MM-dd"))
      .then(({ data, error }) => {
        if (error) { console.error(error); return; }
        const map = new Map<string, number>();
        data?.forEach(b => {
          const t = b.time.slice(0, 5);
          map.set(t, (map.get(t) ?? 0) + 1);
        });
        setCapacityMap(map);
      })
      .finally(() => setCapacityLoading(false));
  }, [date, step]);

  function canNext() {
    if (step === 0) return service !== null;
    if (step === 1) return date !== null;
    if (step === 2) return time !== null && time !== "" && (capacityMap.get(time) ?? 0) < MAX_CAPACITY;
    if (step === 3) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      const phoneOk = phone.trim().length >= 8 && phone.trim().length <= 20;
      const nameOk = name.trim().length > 0 && name.trim().length <= 100;
      return nameOk && phoneOk && emailOk;
    }
    return false;
  }

  async function handleSubmit() {
    setLoading(true);
    setSubmitError(false);
    try {
      await saveBooking({
        service: service!.name, price: service!.price,
        date: format(date!, "yyyy-MM-dd"), time: time!,
        duration: service!.duration,
        name: name.trim(), phone: phone.trim(), email: email.trim(),
        ...(note.trim() ? { note: note.trim() } : {}),
      });
      setDone(true);
    } catch {
      setSubmitError(true);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(0); setService(null); setDate(null); setTime(null);
    setName(""); setPhone(""); setEmail(""); setNote(""); setDone(false);
    setSubmitError(false); setCapacityMap(new Map());
  }

  if (done) {
    return (
      <section id="booking" className="py-20 md:py-28">
        <div className="container max-w-lg">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-secondary rounded-xl p-8 text-center border border-border">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-semibold mb-2">Booking modtaget!</h2>
            <p className="text-muted-foreground text-sm mb-1">{service?.name} — {time}</p>
            <p className="text-muted-foreground text-sm mb-6 capitalize">{date ? format(date, "EEEE d. MMMM yyyy", { locale: da }) : ""}</p>
            <p className="text-sm text-muted-foreground">Vi bekræfter din tid hurtigst muligt.</p>
            <button type="button" onClick={reset} className="mt-6 text-sm text-primary hover:underline">Book en ny tid</button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 md:py-28">
      <div className="container max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-center mb-4">Book tid</h2>
          <div className="divider-gold mx-auto mb-10" />

          <div className="bg-secondary/50 rounded-xl p-5 md:p-8 border border-border">
            <StepIndicator current={step} />

            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                {step === 0 && <Step1 selected={service} onSelect={s => { setService(s); setDate(null); setTime(null); }} />}
                {step === 1 && <Step2 selected={date} onSelect={d => { setDate(d); setTime(null); }} />}
                {step === 2 && date && service && (
                  <Step3
                    date={date} duration={service.duration} selected={time} onSelect={setTime}
                    capacityMap={capacityMap} capacityLoading={capacityLoading}
                  />
                )}
                {step === 3 && service && date && time && (
                  <Step4 service={service} date={date} time={time} name={name} phone={phone} email={email} note={note}
                    onName={setName} onPhone={setPhone} onEmail={setEmail} onNote={setNote} />
                )}
              </motion.div>
            </AnimatePresence>

            {submitError && (
              <p className="text-destructive text-xs text-center mt-4">
                Noget gik galt — prøv igen eller ring til os.
              </p>
            )}

            <div className="flex justify-between mt-4">
              <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 0 || loading}
                className="inline-flex items-center gap-1 px-4 py-3 text-sm rounded-md border border-border active:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation">
                <ChevronLeft className="w-4 h-4" /> Tilbage
              </button>
              {step < 3 ? (
                <button type="button" onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                  className="inline-flex items-center gap-1 px-6 py-3 text-sm font-medium rounded-md bg-primary text-background hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation">
                  Næste <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={!canNext() || loading}
                  className="inline-flex items-center gap-1 px-6 py-3 text-sm font-medium rounded-md bg-primary text-background hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Bekræft</>}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Booking;
