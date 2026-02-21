import { IconLayersIntersect } from '@tabler/icons-react'

interface IsEmptyProps {
  text: string
}

export default function IsEmpty({ text }: IsEmptyProps) {
  return (
    <section className="py-28 max-w-7xl mx-auto px-6 flex flex-col items-center justify-center p-12 border border-white/5 rounded-2xl bg-bg-secondary/50">
      <IconLayersIntersect size={48} className="text-text-muted mb-4" />
      <p className="text-center text-text-muted">{text}</p>
    </section>
  )
}
