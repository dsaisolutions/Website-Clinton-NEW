interface InstructorCardProps {
  name: string;
  role: string;
  bio: string;
  specialties: string[];
}

export default function InstructorCard({ name, role, bio, specialties }: InstructorCardProps) {
  return (
    <div className="group relative border-2 border-gym-charcoal-light hover:border-bee-yellow bg-gym-charcoal transition-all duration-200 hover:-translate-y-1 overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 bg-gym-red group-hover:bg-bee-yellow transition-colors" />

      {/* Photo area */}
      <div className="relative bg-gym-charcoal-mid h-52 flex items-center justify-center overflow-hidden">
        {/* Replace with: <img src="..." alt={name} className="w-full h-full object-cover" /> */}
        <div className="flex flex-col items-center gap-2 opacity-25">
          <div className="w-20 h-20 rounded-full border-2 border-gray-600 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <span className="font-heading text-xs uppercase tracking-widest text-gray-600">Photo Coming Soon</span>
        </div>

        {/* Diagonal overlay */}
        <div
          className="absolute bottom-0 right-0 w-16 h-16 bg-bee-yellow/10 group-hover:bg-bee-yellow/20 transition-colors"
          style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
        />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block w-2 h-2 bg-gym-red" />
          <span className="font-heading text-xs uppercase tracking-[0.2em] text-bee-yellow">{role}</span>
        </div>
        <h3 className="font-display text-3xl uppercase text-white leading-none mb-3">{name}</h3>
        <p className="font-body text-gray-400 text-sm leading-relaxed mb-4">{bio}</p>
        <div className="flex flex-wrap gap-1.5">
          {specialties.map((tag) => (
            <span key={tag} className="font-heading text-xs uppercase tracking-wider text-gym-black bg-bee-yellow px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
