import { formatAmount, fundingPercent } from "../lib/format.ts"

type FundingBarProps = {
  raised: number
  goal: number
}

export function FundingBar({ raised, goal }: FundingBarProps) {
  const percent = fundingPercent(raised, goal)

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm text-[#E4E4E7]">
        <span>Raised {formatAmount(raised)}</span>
        <span>Goal {formatAmount(goal)}</span>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Funding progress, ${percent} percent`}
      >
        <div className="h-full bg-[var(--gold)]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
