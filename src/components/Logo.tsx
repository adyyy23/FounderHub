interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textSize?: string;
}

export default function Logo({ size = 32, className = '', showText = false, textSize = 'text-[15px]' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex-shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer border square */}
          <rect x="4" y="4" width="92" height="92" rx="14" fill="#1a0a00" stroke="#f97316" strokeWidth="4"/>

          {/* F letterform - top horizontal bar */}
          <rect x="14" y="14" width="34" height="7" rx="2" fill="#f97316"/>
          {/* F letterform - middle horizontal bar */}
          <rect x="14" y="33" width="24" height="6" rx="2" fill="#f97316"/>
          {/* F letterform - vertical bar */}
          <rect x="14" y="14" width="7" height="36" rx="2" fill="#f97316"/>

          {/* H letterform - left vertical */}
          <rect x="53" y="14" width="7" height="36" rx="2" fill="#f97316"/>
          {/* H letterform - right vertical */}
          <rect x="79" y="14" width="7" height="36" rx="2" fill="#f97316"/>
          {/* H letterform - middle crossbar */}
          <rect x="53" y="29" width="33" height="6" rx="2" fill="#f97316"/>

          {/* M letterform bottom-left - left outer stroke */}
          <rect x="14" y="57" width="7" height="29" rx="2" fill="#f97316"/>
          {/* M bottom - center left diagonal */}
          <polygon points="14,57 21,57 38,86 31,86" fill="#f97316"/>
          {/* M bottom - center right diagonal */}
          <polygon points="55,57 48,57 38,86 44,86" fill="#f97316"/>
          {/* M bottom right outer stroke */}
          <rect x="48" y="57" width="7" height="29" rx="2" fill="#f97316"/>

          {/* Diagonal slash connecting F to M area */}
          <polygon points="58,86 65,86 86,57 79,57" fill="#f97316"/>

          {/* Right side vertical completing the design */}
          <rect x="79" y="57" width="7" height="29" rx="2" fill="#f97316"/>
        </svg>
      </div>
      {showText && (
        <span className={`text-white font-bold tracking-tight ${textSize}`}>FounderHub</span>
      )}
    </div>
  );
}

export function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="4" y="4" width="92" height="92" rx="14" fill="#1a0a00" stroke="#f97316" strokeWidth="4"/>
        <rect x="14" y="14" width="34" height="7" rx="2" fill="#f97316"/>
        <rect x="14" y="33" width="24" height="6" rx="2" fill="#f97316"/>
        <rect x="14" y="14" width="7" height="36" rx="2" fill="#f97316"/>
        <rect x="53" y="14" width="7" height="36" rx="2" fill="#f97316"/>
        <rect x="79" y="14" width="7" height="36" rx="2" fill="#f97316"/>
        <rect x="53" y="29" width="33" height="6" rx="2" fill="#f97316"/>
        <rect x="14" y="57" width="7" height="29" rx="2" fill="#f97316"/>
        <polygon points="14,57 21,57 38,86 31,86" fill="#f97316"/>
        <polygon points="55,57 48,57 38,86 44,86" fill="#f97316"/>
        <rect x="48" y="57" width="7" height="29" rx="2" fill="#f97316"/>
        <polygon points="58,86 65,86 86,57 79,57" fill="#f97316"/>
        <rect x="79" y="57" width="7" height="29" rx="2" fill="#f97316"/>
      </svg>
    </div>
  );
}
