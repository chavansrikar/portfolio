type Props = {
  items: readonly string[]
  reverse?: boolean
  className?: string
  separator?: string
  itemClassName?: string
  separatorClassName?: string
  speed?: number
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
  itemClassName = 'px-6 font-mono text-sm uppercase tracking-[0.18em] text-mist transition-colors duration-300 hover:text-purple-300 sm:text-base',
  separatorClassName = 'text-[10px] text-teal-500/50',
  speed,
}: Props) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex shrink-0 items-center">
          <span className={itemClassName}>{item}</span>
          <span className={separatorClassName}>{separator}</span>
        </span>
      ))}
    </div>
  )

  return (
    <div className={`mask-fade-x relative flex overflow-hidden ${className}`}>
      <div
        className={`flex w-max ${reverse ? 'animate-marquee-rev' : 'animate-marquee'}`}
        style={speed ? { animationDuration: `${speed}s` } : undefined}
      >
        {row}
        {row}
      </div>
    </div>
  )
}