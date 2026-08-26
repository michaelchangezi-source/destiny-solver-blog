import { ShieldCheck } from 'lucide-react'

const commitments = [
  {
    title: '不用恐嚇成交',
    body: '不會用災劫、宿命或者「不化解就會出事」推動你付款。命理是決策參考，不是恐懼的來源。',
  },
  {
    title: '不故弄玄虛',
    body: '盡量用你聽得明白的方式解釋，把命盤的結構攤開來講清楚，而不是用術語把人繞暈。',
  },
  {
    title: '會直接指出盲點與風險',
    body: '不只講好聽的話。命盤顯示的弱點、時機上的風險、你可能不想面對的部分，我都會照直說。',
  },
]

export default function Commitments() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 border-t-2 border-[#2B241C]">
      {commitments.map((item, i) => (
        <div
          key={item.title}
          className={`py-7 sm:px-7 first:sm:pl-0 last:sm:pr-0 ${
            i > 0 ? 'border-t sm:border-t-0 sm:border-l border-[color:var(--border-card)]' : ''
          }`}
        >
          <ShieldCheck size={22} className="text-[#B23E26] mb-4" />
          <h3 className="text-[#2B241C] font-bold mb-3">{item.title}</h3>
          <p className="text-[#6B6155] text-sm leading-relaxed">{item.body}</p>
        </div>
      ))}
    </div>
  )
}
