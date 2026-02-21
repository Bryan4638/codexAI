interface ErrorProps {
  section: string
}

export default function Error({ section }: ErrorProps) {
  return (
    <section className="py-28 max-w-7xl mx-auto px-6 text-center">
      <p>{`Error cargando ${section}`}</p>
    </section>
  )
}
