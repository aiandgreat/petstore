import React from 'react'

export default function PetstoreLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-lime-400 to-green-700 text-white shadow-lg shadow-emerald-500/25">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M12 2.25c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3Zm-5.6 4.1c1.11 0 2.02.91 2.02 2.02 0 1.1-.91 2.01-2.02 2.01-1.1 0-2.01-.9-2.01-2.01 0-1.11.9-2.02 2.01-2.02Zm11.2 0c1.11 0 2.02.91 2.02 2.02 0 1.1-.91 2.01-2.02 2.01-1.1 0-2.01-.9-2.01-2.01 0-1.11.9-2.02 2.01-2.02ZM12 8.7c-3.28 0-7.75 2.43-7.75 6.08 0 2.66 2.28 4.97 4.8 4.97.94 0 1.65-.35 2.09-.79.52-.52.95-.79 1.86-.79s1.34.27 1.86.79c.44.44 1.15.79 2.1.79 2.5 0 4.8-2.31 4.8-4.97 0-3.65-4.47-6.08-7.76-6.08Z" />
        </svg>
      </div>
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">J Petstore</div>
      </div>
    </div>
  )
}