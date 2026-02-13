interface ErrorProps {
  section: string
}

export default function Error({ section }: ErrorProps) {
  return (
    <section className="pt-32 max-w-7xl mx-auto px-6 text-center">
      <p>{`Error cargando ${section}`}</p>
    </section>
  )
}
