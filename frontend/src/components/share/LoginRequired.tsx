import { Link } from 'react-router-dom'

export default function LoginRequired() {
  return (
    <>
      <section className="py-28 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl">Acceso Restringido</h2>
        <p className="mb-10 mt-2 text-sm">
          Inicia sesión para desbloquear medallas.
        </p>

        <Link to="/auth" className="btn btn-primary">
          Iniciar sesión
        </Link>
      </section>
    </>
  )
}
