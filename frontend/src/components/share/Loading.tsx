interface LoadingProps {
  section: string
}

export default function Loading({ section }: LoadingProps) {
  return (
    <section className="pt-32 max-w-7xl mx-auto px-6 text-center">
      <p>{`Cargando ${section}...`}</p>
    </section>
  )
}
