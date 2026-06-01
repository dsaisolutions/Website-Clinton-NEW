interface ScheduleClass {
  time: string;
  name: string;
  type?: 'bjj' | 'mma' | 'wrestling' | 'open-mat' | 'kids';
}

interface ScheduleCardProps {
  day: string;
  classes: ScheduleClass[];
  isToday?: boolean;
}

const typeConfig: Record<string, { bar: string; text: string; bg: string }> = {
  bjj:        { bar: 'bg-blue-600',    text: 'text-blue-300',   bg: 'bg-blue-900/30' },
  mma:        { bar: 'bg-gym-red',     text: 'text-red-300',    bg: 'bg-gym-red/15' },
  wrestling:  { bar: 'bg-orange-600',  text: 'text-orange-300', bg: 'bg-orange-900/20' },
  'open-mat': { bar: 'bg-bee-yellow',  text: 'text-bee-yellow', bg: 'bg-bee-yellow/8' },
  kids:       { bar: 'bg-green-600',   text: 'text-green-300',  bg: 'bg-green-900/25' },
};

export default function ScheduleCard({ day, classes, isToday = false }: ScheduleCardProps) {
  return (
    <div className={`relative border-2 transition-colors ${isToday ? 'border-bee-yellow' : 'border-gym-charcoal-light hover:border-bee-yellow/40'}`}>
      {isToday && (
        <div className="absolute -top-3 left-4 bg-gym-red px-2 py-0.5">
          <span className="font-heading text-white text-xs uppercase tracking-widest">Today</span>
        </div>
      )}

      {/* Day header */}
      <div className={`px-4 py-3 border-b-2 ${isToday ? 'bg-bee-yellow border-bee-yellow-dark' : 'bg-gym-charcoal-mid border-bee-yellow/30'}`}>
        <span className={`font-display text-2xl uppercase leading-none tracking-wide ${isToday ? 'text-gym-black' : 'text-bee-yellow'}`}>
          {day}
        </span>
      </div>

      {/* Classes */}
      <div className="bg-gym-charcoal p-3 flex flex-col gap-2">
        {classes.map((cls, i) => {
          const cfg = typeConfig[cls.type ?? 'bjj'];
          return (
            <div key={i} className={`relative flex items-center gap-0 overflow-hidden ${cfg.bg}`}>
              <div className={`w-1 self-stretch ${cfg.bar}`} />
              <div className="flex flex-col px-3 py-2">
                <span className={`font-heading text-xs uppercase tracking-widest font-bold ${cfg.text}`}>
                  {cls.time}
                </span>
                <span className="font-body text-white text-sm leading-tight">{cls.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
