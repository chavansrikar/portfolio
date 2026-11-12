type Props = {
  items: readonly string[]
  reverse?: boolean
  className?: string
  separator?: string
}

/**
 * Infinite horizontal ticker. The content is duplicated so the -50%
 * translate loops seamlessly.
 */
export function Marquee({
  items,
  reverse = false,
  className = '',
  separator = '◆',
}: Props) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex shrink-0 items-center">
          <span className="px-6 font-mono text-sm uppercase tracking-[0.18em] text-mist transition-colors duration-300 hover:text-cyan-300 sm:text-base">
            {item}
          </span>
          <span className="text-[10px] text-cyan-500/50">{separator}</span>
        </span>
      ))}
    </div>
  )

  return (
    <div className={`mask-fade-x relative flex overflow-hidden ${className}`}>
      <div
        className={`flex w-max ${reverse ? 'animate-marquee-rev' : 'animate-marquee'}`}
        style={{ animationPlayState: 'running' }}
      >
        {row}
        {row}
      </div>
    </div>
  )
}
