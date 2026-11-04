import { useId } from 'react'
import type { SegmentId } from '@/types/content'
import './segmentVisualAccent.css'

/** Monochrome solid illustrations; decorative layers never receive pointer input. */
export function SegmentVisualAccent({
  segment,
}: {
  segment: SegmentId | null
}) {
  const id = useId()
  return (
    <div className="segment-visual-accent" aria-hidden="true">
      {(['advocacia', 'contabilidade', 'imobiliarias'] as const).map((item) => {
        const face = `${id}-${item}-face`
        const edge = `${id}-${item}-edge`
        return (
          <svg
            key={item}
            className="segment-visual-object"
            data-active={segment === item}
            data-object={item}
            viewBox="0 0 300 420"
            fill="none"
            focusable="false"
          >
            <defs>
              <linearGradient
                id={face}
                x1="50"
                y1="50"
                x2="250"
                y2="370"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#d9e0e7" />
                <stop offset=".48" stopColor="#8998a9" />
                <stop offset="1" stopColor="#435365" />
              </linearGradient>
              <linearGradient
                id={edge}
                x1="80"
                y1="120"
                x2="260"
                y2="300"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#738395" />
                <stop offset="1" stopColor="#263546" />
              </linearGradient>
            </defs>
            <ellipse
              cx="154"
              cy="382"
              rx="116"
              ry="16"
              fill="#000"
              opacity=".35"
            />
            {item === 'advocacia' ? (
              <g strokeLinejoin="round">
                <path d="m59 354 100-24 89 23-99 29Z" fill={`url(#${face})`} />
                <path
                  d="m59 354 90 28 99-29v12l-99 29-90-27Z"
                  fill={`url(#${edge})`}
                />
                <path d="m143 110 14-5v231l-14 6Z" fill={`url(#${face})`} />
                <path d="m157 105 9 7v225l-9-1Z" fill={`url(#${edge})`} />
                <path d="m47 142 200-36 9 12-201 39Z" fill={`url(#${face})`} />
                <path d="m55 157 201-39v8L55 165Z" fill={`url(#${edge})`} />
                <circle cx="153" cy="94" r="16" fill={`url(#${face})`} />
                <path
                  d="m61 154-34 111m34-111 35 98m145-132-35 111m35-111 34 98"
                  stroke="#b8c3d0"
                  strokeWidth="3"
                />
                <path
                  d="m19 264 85-16c-3 29-19 45-40 46-23 1-38-10-45-30Z"
                  fill={`url(#${face})`}
                />
                <path
                  d="m199 232 84-17c-3 28-19 44-40 46-23 2-38-10-44-29Z"
                  fill={`url(#${face})`}
                />
                <path
                  d="m19 264 85-16m95-16 84-17"
                  stroke="#d5dce4"
                  strokeWidth="3"
                />
                <path d="m113 342 39-10 40 10-39 12Z" fill={`url(#${face})`} />
              </g>
            ) : item === 'contabilidade' ? (
              <g
                strokeLinejoin="round"
                data-illustration="banknotes"
                transform="rotate(-18 153 213)"
              >
                {[
                  { x: -12, y: -34 },
                  { x: -6, y: -17 },
                  { x: 0, y: 0 },
                ].map(({ x, y }, index) => (
                  <g
                    key={index}
                    transform={`translate(${x} ${y})`}
                    data-banknote
                  >
                    <path
                      d="m49 142 177-60 45 222-177 61-9-8Z"
                      fill={`url(#${edge})`}
                    />
                    <path
                      d="m42 134 177-60 45 222-177 61Z"
                      fill={`url(#${face})`}
                      stroke="#a8b0b9"
                      strokeWidth="1.5"
                    />
                    <path
                      d="m60 147 146-49 38 185-146 50Z"
                      stroke="#46515e"
                      strokeWidth="3"
                    />
                    <path
                      d="m67 160 30-10m110 122 24-8"
                      stroke="#c3c9ce"
                      strokeWidth="4"
                    />
                    <ellipse
                      cx="229"
                      cy="238"
                      rx="23"
                      ry="36"
                      transform="rotate(-12 229 238)"
                      fill={`url(#${edge})`}
                      stroke="#a8b0b9"
                      strokeWidth="2"
                    />
                    <path
                      d="M239 219c-5-7-22-5-22 5 0 12 25 5 25 18 0 11-17 16-25 8m10-41 6 53"
                      stroke="#aeb7c0"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="m123 256 22-8m12-4 24-8"
                      stroke="#b5bec7"
                      strokeWidth="3"
                    />
                    <path d="m42 134 45 223 9 8-45-223Z" fill="#52606e" />
                  </g>
                ))}
              </g>
            ) : (
              <g strokeLinejoin="round">
                <path
                  d="m38 352 119-49 113 42-116 53Z"
                  fill={`url(#${edge})`}
                />
                <path
                  d="m65 115 96-42 69 31v246l-96 43-69-32Z"
                  fill={`url(#${face})`}
                />
                <path d="m161 73 69 31v246l-69-30Z" fill={`url(#${edge})`} />
                <path d="m65 115 96-42 69 31-96 43Z" fill="#bac5d0" />
                <path d="m78 108 82-35 55 24-81 37Z" fill="#647588" />
                <path d="m134 147 96-43v246l-96 43Z" fill={`url(#${face})`} />
                {Array.from({ length: 5 }, (_, row) => (
                  <g key={row}>
                    <path
                      d={`m78 ${145 + row * 38} 13 6v21l-13-6Zm26 12 13 6v21l-13-6Z`}
                      fill="#314458"
                    />
                    <path
                      d={`m148 ${161 + row * 38} 19-9v22l-19 9Zm32-15 19-9v22l-19 9Z`}
                      fill="#354b5f"
                    />
                    <path
                      d={`m148 ${161 + row * 38} 19-9m13-6 19-9`}
                      stroke="#d5dce4"
                      strokeWidth="2"
                    />
                  </g>
                ))}
                <path d="m145 350 29-13v38l-29 13Z" fill="#283b4e" />
                <path
                  d="m65 115 69 32v246m0-246 96-43"
                  stroke="#d1dae4"
                  strokeOpacity=".6"
                />
              </g>
            )}
          </svg>
        )
      })}
    </div>
  )
}
