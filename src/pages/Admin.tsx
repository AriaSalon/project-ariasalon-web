import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { type EventResizeDoneArg } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import type { EventClickArg, EventDropArg, DateSelectArg, EventInput } from "@fullcalendar/core";
import { format, parseISO, addMinutes, isThisWeek } from "date-fns";
import { da } from "date-fns/locale";
import { X, Plus, Phone, Scissors, Trash2, LogOut, Loader2, Search, ChevronDown, ChevronUp } from "lucide-react";
import { services } from "@/data/services";
import { supabase, type BookingRow } from "@/lib/supabase";

// ── types ─────────────────────────────────────────────────────────────────────

type Booking = BookingRow;

// ── colour map ────────────────────────────────────────────────────────────────

function serviceColor(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("skæg") || n.includes("skinfade") || n.includes("snor") || n.includes("næse")) return "#7c6f5e";
  if (n.includes("børne")) return "#5e7c6f";
  if (n.includes("pension") || n.includes("maskin")) return "#5e667c";
  return "#8b6914";
}

function bookingToEvent(b: Booking): EventInput {
  const start = `${b.date}T${b.time}`;
  const end = format(addMinutes(parseISO(start), b.duration ?? 30), "yyyy-MM-dd'T'HH:mm");
  return {
    id: b.id,
    title: b.name,
    start, end,
    backgroundColor: serviceColor(b.service),
    borderColor: serviceColor(b.service),
    extendedProps: { booking: b },
  };
}

// ── shared input classes ──────────────────────────────────────────────────────

const inputCls = "w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary";

// ── view modal ────────────────────────────────────────────────────────────────

type ModalState = { type: "view"; booking: Booking } | { type: "new"; start: string; end: string } | null;

function ViewModal({ booking, onClose, onDelete, onSave }: {
  booking: Booking; onClose: () => void;
  onDelete: (id: string) => void; onSave: (b: Booking) => void;
}) {
  const [draft, setDraft] = useState<Booking>({ ...booking });
  const durationOptions = [10, 15, 20, 25, 30, 45, 60, 75, 90];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60" onClick={onClose}>
      <div className="bg-[#1a1a1a] border border-border rounded-t-2xl sm:rounded-xl w-full sm:max-w-md shadow-2xl max-h-[92dvh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="font-display font-semibold text-base">Rediger booking</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 touch-manipulation"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Navn</label>
              <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Telefon</label>
              <a href={`tel:${draft.phone}`} className="flex items-center gap-1.5 text-sm text-primary hover:underline mt-2 touch-manipulation">
                <Phone className="w-3.5 h-3.5" />{draft.phone}
              </a>
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Ydelse</label>
            <select value={draft.service}
              onChange={e => {
                const s = services.find(sv => sv.name === e.target.value);
                setDraft(d => ({ ...d, service: e.target.value, price: s?.price ?? d.price, duration: s?.duration ?? d.duration }));
              }}
              className={inputCls}>
              {services.map(s => <option key={s.name} value={s.name}>{s.name} — {s.price}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Dato</label>
              <input type="date" value={draft.date} onChange={e => setDraft(d => ({ ...d, date: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Tid</label>
              <input type="time" value={draft.time?.slice(0, 5) ?? ""} onChange={e => setDraft(d => ({ ...d, time: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Varighed</label>
              <select value={draft.duration} onChange={e => setDraft(d => ({ ...d, duration: Number(e.target.value) }))} className={inputCls}>
                {durationOptions.map(m => <option key={m} value={m}>{m} min</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Note</label>
            <textarea value={draft.note ?? ""} onChange={e => setDraft(d => ({ ...d, note: e.target.value }))}
              placeholder="Ingen note..." rows={2} className={`${inputCls} resize-none`} />
          </div>

          <p className="text-xs text-muted-foreground">
            Oprettet: {format(parseISO(draft.created_at), "d. MMM yyyy HH:mm", { locale: da })}
          </p>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-border shrink-0">
          <button onClick={() => { onDelete(booking.id); onClose(); }}
            className="inline-flex items-center gap-1.5 text-sm text-destructive hover:opacity-80 transition-opacity touch-manipulation">
            <Trash2 className="w-3.5 h-3.5" /> Slet
          </button>
          <button onClick={() => { onSave(draft); onClose(); }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-md bg-primary text-background hover:opacity-90 transition-opacity touch-manipulation">
            Gem ændringer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── new modal ─────────────────────────────────────────────────────────────────

function NewModal({ start, end, onClose, onCreate }: {
  start: string; end: string; onClose: () => void;
  onCreate: (b: Omit<Booking, "id" | "created_at">) => void;
}) {
  const defaultDate = start.split("T")[0] ?? format(new Date(), "yyyy-MM-dd");
  const defaultTime = start.split("T")[1]?.slice(0, 5) ?? "09:00";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(services[0].name);
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [duration, setDuration] = useState(services[0].duration);
  const [note, setNote] = useState("");
  const durationOptions = [10, 15, 20, 25, 30, 45, 60, 75, 90];
  const serviceObj = services.find(s => s.name === service);

  function handleServiceChange(name: string) {
    const s = services.find(sv => sv.name === name);
    setService(name);
    if (s) setDuration(s.duration);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60" onClick={onClose}>
      <div className="bg-[#1a1a1a] border border-border rounded-t-2xl sm:rounded-xl w-full sm:max-w-md shadow-2xl max-h-[92dvh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="font-display font-semibold text-base">Ny booking</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 touch-manipulation"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Navn</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Kundens navn" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Telefon</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+45 ..." className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Ydelse</label>
            <select value={service} onChange={e => handleServiceChange(e.target.value)} className={inputCls}>
              {services.map(s => <option key={s.name} value={s.name}>{s.name} — {s.price}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Dato</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Tid</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Varighed</label>
              <select value={duration} onChange={e => setDuration(Number(e.target.value))} className={inputCls}>
                {durationOptions.map(m => <option key={m} value={m}>{m} min</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Note <span className="text-muted-foreground/60">(valgfri)</span></label>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Særlige ønsker..." rows={2}
              className={`${inputCls} resize-none`} />
          </div>
        </div>

        <div className="flex justify-end px-5 py-4 border-t border-border shrink-0">
          <button
            disabled={!name.trim() || !phone.trim()}
            onClick={() => {
              onCreate({ service, price: serviceObj?.price ?? "", date, time, duration, name: name.trim(), phone: phone.trim(), ...(note.trim() ? { note: note.trim() } : {}) });
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-md bg-primary text-background hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation">
            <Plus className="w-4 h-4" /> Opret booking
          </button>
        </div>
      </div>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

const Admin = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [isMobile] = useState(() => window.innerWidth < 640);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showToday, setShowToday] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const todayBookings = bookings
    .filter(b => b.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  const weekCount = bookings.filter(b =>
    isThisWeek(parseISO(b.date), { weekStartsOn: 1 })
  ).length;

  const searchResults = search.trim().length >= 2
    ? bookings
        .filter(b =>
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.phone.includes(search)
        )
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
        .slice(0, 8)
    : [];

  useEffect(() => {
    supabase.from("bookings").select("*").order("date").order("time")
      .then(({ data, error }) => { if (error) { console.error(error); return; } if (data) setBookings(data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
  }, [showSearch]);

  const events = bookings.map(bookingToEvent);

  function handleLogout() {
    sessionStorage.removeItem("admin_token");
    navigate("/");
  }

  function handleEventClick({ event }: EventClickArg) {
    setModal({ type: "view", booking: event.extendedProps.booking as Booking });
  }

  async function handleEventDrop({ event, revert }: EventDropArg) {
    if (!event.start) return;
    const date = format(event.start, "yyyy-MM-dd");
    const time = format(event.start, "HH:mm");
    const prev = bookings.find(b => b.id === event.id);
    setBookings(bs => bs.map(b => b.id !== event.id ? b : { ...b, date, time }));
    const { error } = await supabase.from("bookings").update({ date, time }).eq("id", event.id);
    if (error) { revert(); if (prev) setBookings(bs => bs.map(b => b.id === prev.id ? prev : b)); }
  }

  async function handleEventResize({ event, revert }: EventResizeDoneArg) {
    if (!event.start || !event.end) return;
    const duration = Math.round((event.end.getTime() - event.start.getTime()) / 60000);
    const prev = bookings.find(b => b.id === event.id);
    setBookings(bs => bs.map(b => b.id === event.id ? { ...b, duration } : b));
    const { error } = await supabase.from("bookings").update({ duration }).eq("id", event.id);
    if (error) { revert(); if (prev) setBookings(bs => bs.map(b => b.id === prev.id ? prev : b)); }
  }

  function handleDateSelect({ startStr, endStr }: DateSelectArg) {
    setModal({ type: "new", start: startStr, end: endStr });
  }

  async function handleDelete(id: string) {
    const prev = bookings.find(b => b.id === id);
    setBookings(bs => bs.filter(b => b.id !== id));
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error && prev) setBookings(bs => [...bs, prev]);
  }

  async function handleSave(updated: Booking) {
    const prev = bookings.find(b => b.id === updated.id);
    setBookings(bs => bs.map(b => b.id === updated.id ? updated : b));
    const { id, created_at, ...fields } = updated;
    const { error } = await supabase.from("bookings").update(fields).eq("id", id);
    if (error && prev) setBookings(bs => bs.map(b => b.id === prev.id ? prev : b));
  }

  async function handleCreate(data: Omit<Booking, "id" | "created_at">) {
    const tempId = crypto.randomUUID();
    const optimistic = { ...data, id: tempId, created_at: new Date().toISOString() };
    setBookings(prev => [...prev, optimistic]);
    const { data: rows, error } = await supabase.from("bookings").insert([data]).select();
    if (error || !rows?.[0]) {
      setBookings(prev => prev.filter(b => b.id !== tempId));
    } else {
      setBookings(prev => prev.map(b => b.id === tempId ? rows[0] : b));
    }
  }

  return (
    <div className="h-dvh bg-[#111] text-foreground flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-[#1a1a1a] shrink-0 gap-2">
        <div className="flex items-center gap-2 shrink-0">
          <Scissors className="w-4 h-4 text-primary" />
          <span className="font-display font-semibold text-sm hidden xs:inline">Aria Salon</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>I dag: <span className="text-foreground font-semibold">{todayBookings.length}</span></span>
          <span className="hidden sm:inline">Uge: <span className="text-foreground font-semibold">{weekCount}</span></span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            {showSearch ? (
              <div className="flex items-center gap-1">
                <input
                  ref={searchRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Søg navn / tlf..."
                  className="w-36 sm:w-48 rounded-md border border-border bg-[#111] px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
                <button onClick={() => { setShowSearch(false); setSearch(""); }}
                  className="text-muted-foreground hover:text-foreground p-1 touch-manipulation">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowSearch(true)}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors touch-manipulation">
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute right-0 top-full mt-1 w-72 bg-[#1a1a1a] border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                {searchResults.map(b => (
                  <button key={b.id} onClick={() => { setModal({ type: "view", booking: b }); setSearch(""); setShowSearch(false); }}
                    className="w-full flex items-start justify-between px-4 py-3 hover:bg-secondary text-left border-b border-border/50 last:border-0 touch-manipulation">
                    <div>
                      <p className="text-sm font-medium">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.service}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-xs text-muted-foreground">{format(parseISO(b.date), "d. MMM", { locale: da })}</p>
                      <p className="text-xs text-muted-foreground">{b.time.slice(0, 5)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setModal({ type: "new", start: format(new Date(), "yyyy-MM-dd'T'09:00"), end: format(new Date(), "yyyy-MM-dd'T'09:30") })}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-background hover:opacity-90 transition-opacity touch-manipulation">
            <Plus className="w-3.5 h-3.5" /><span className="hidden xs:inline">Ny</span>
          </button>
          <button onClick={handleLogout}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md border border-border hover:bg-secondary transition-colors text-muted-foreground touch-manipulation">
            <LogOut className="w-3.5 h-3.5" /><span className="hidden sm:inline">Log ud</span>
          </button>
        </div>
      </header>

      {/* Today panel */}
      {todayBookings.length > 0 && (
        <div className="border-b border-border bg-[#161616] shrink-0">
          <button
            onClick={() => setShowToday(v => !v)}
            className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground hover:text-foreground w-full touch-manipulation">
            <span className="font-medium text-foreground">I dag</span>
            <span className="text-muted-foreground">— {todayBookings.length} {todayBookings.length === 1 ? "booking" : "bookinger"}</span>
            {showToday ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
          </button>

          {showToday && (
            <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none">
              {todayBookings.map(b => (
                <button key={b.id}
                  onClick={() => setModal({ type: "view", booking: b })}
                  className="flex-none flex flex-col gap-0.5 bg-[#1a1a1a] border border-border rounded-lg px-3 py-2.5 text-left hover:border-primary/50 transition-colors touch-manipulation min-w-[140px]">
                  <span className="text-[11px] text-primary font-semibold">{b.time.slice(0, 5)}</span>
                  <span className="text-sm font-medium truncate max-w-[140px]">{b.name}</span>
                  <span className="text-[11px] text-muted-foreground truncate max-w-[140px]">{b.service}</span>
                  <a href={`tel:${b.phone}`} onClick={e => e.stopPropagation()}
                    className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 mt-0.5 touch-manipulation">
                    <Phone className="w-2.5 h-2.5" />{b.phone}
                  </a>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Calendar */}
      <div className="flex-1 overflow-hidden p-2 sm:p-4 admin-calendar relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#111]/80 z-10">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin, listPlugin]}
          initialView={isMobile ? "timeGridDay" : "timeGridThreeDay"}
          views={{
            timeGridThreeDay: {
              type: "timeGrid",
              duration: { days: 3 },
              buttonText: "3 dage",
            },
          }}
          locale="da"
          firstDay={1}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: isMobile ? "timeGridDay,listWeek" : "timeGridWeek,timeGridThreeDay,timeGridDay,listWeek",
          }}
          buttonText={{ today: "I dag", week: "Uge", day: "Dag", list: "Liste", "3 dage": "3 dage" }}
          slotMinTime="09:00:00"
          slotMaxTime="19:00:00"
          slotDuration="00:30:00"
          slotLabelInterval="01:00:00"
          allDaySlot={false}
          hiddenDays={[0]}
          height="100%"
          editable
          selectable
          selectMirror
          eventDurationEditable
          eventResizableFromStart={false}
          snapDuration="00:15:00"
          longPressDelay={300}
          events={events}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          select={handleDateSelect}
          eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
          slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
          nowIndicator
          businessHours={[
            { daysOfWeek: [1, 2, 3, 4, 5, 6], startTime: "09:00", endTime: "19:00" },
          ]}
          eventContent={(arg) => {
            const b = arg.event.extendedProps.booking as Booking;
            if (!b) return;
            const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
            const name = esc(b.name);
            const phone = esc(b.phone);
            return {
              html: `<div style="padding:2px 5px;overflow:hidden;height:100%;display:flex;flex-direction:column;justify-content:center;gap:1px;">
                <span style="font-size:11px;font-weight:600;line-height:1.3;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${arg.timeText} · ${name} · ${phone}</span>
              </div>`,
            };
          }}
        />
      </div>

      {modal?.type === "view" && (
        <ViewModal booking={modal.booking} onClose={() => setModal(null)} onDelete={handleDelete} onSave={handleSave} />
      )}
      {modal?.type === "new" && (
        <NewModal start={modal.start} end={modal.end} onClose={() => setModal(null)} onCreate={handleCreate} />
      )}
    </div>
  );
};

export default Admin;
