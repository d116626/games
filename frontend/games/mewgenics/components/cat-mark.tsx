/** Cabeça de gato laranja com coleira e plaquinha: a marca do guia. */
export function CatMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 310" role="img" aria-label="Cartoon cat head wearing a collar" className={className}>
      <g stroke="#1d1611" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round">
        {/* orelhas */}
        <path d="M58 128 L46 36 L132 84 Z" fill="#f0a23b" />
        <path d="M242 128 L254 36 L168 84 Z" fill="#f0a23b" />
        <path d="M70 108 L62 62 L108 86 Z" fill="#f3a6b6" strokeWidth="5" />
        <path d="M230 108 L238 62 L192 86 Z" fill="#f3a6b6" strokeWidth="5" />
        {/* cabeça */}
        <ellipse cx="150" cy="170" rx="108" ry="90" fill="#f0a23b" />
        {/* focinho */}
        <ellipse cx="150" cy="208" rx="52" ry="38" fill="#fbf4e4" strokeWidth="6" />
        {/* listras */}
        <path d="M150 84 V116 M122 90 L128 114 M178 90 L172 114" fill="none" strokeWidth="7" />
        {/* olhos desiguais */}
        <ellipse cx="104" cy="164" rx="22" ry="26" fill="#fff" />
        <ellipse cx="196" cy="168" rx="17" ry="21" fill="#fff" />
        <circle cx="110" cy="168" r="9" fill="#1d1611" stroke="none" />
        <circle cx="190" cy="172" r="7" fill="#1d1611" stroke="none" />
        {/* nariz e boca */}
        <path d="M138 192 H162 L150 206 Z" fill="#e8553d" strokeWidth="5" />
        <path d="M150 206 V216 M150 216 Q138 232 124 222 M150 216 Q162 232 176 222" fill="none" strokeWidth="5" />
        {/* bigodes */}
        <path d="M82 206 L30 196 M84 218 L32 226 M218 206 L270 196 M216 218 L268 226" fill="none" strokeWidth="5" />
        {/* coleira */}
        <path d="M70 252 Q150 290 230 252 L224 276 Q150 314 76 276 Z" fill="#e8553d" />
        <circle cx="150" cy="292" r="22" fill="#f2b632" />
        <path d="M150 280 v14 M150 301 v1" fill="none" strokeWidth="7" />
      </g>
    </svg>
  );
}
