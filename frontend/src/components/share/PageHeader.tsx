interface PageHeaderProps {
  title: string
  subtitle: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="flex flex-col justify-center items-center mb-12">
      <h2 className="text-3xl text-center">{title}</h2>
      <p className="mt-2 text-sm text-center text-pretty">{subtitle}</p>
    </header>
  )
}
