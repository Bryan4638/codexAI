interface LoadingProps {
  section: string
}

export default function Loading({ section }: LoadingProps) {
  return (
    <section className="py-28 max-w-7xl mx-auto px-6 text-center">
      <p>{`Cargando ${section}...`}</p>
    </section>
  )
}
