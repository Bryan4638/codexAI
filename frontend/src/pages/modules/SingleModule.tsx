export default function SingleModule() {
  return (
    <section
      className="modules-section container"
      style={{ paddingTop: "120px" }}
    >
      <div className="section-header">
        <h2>Todos los Módulos</h2>
        <p>Selecciona un módulo para comenzar a aprender.</p>
      </div>
      <div className="modules-grid">
        {modulesData.map((module) => {
          const stats = moduleProgress[module.id] || {
            completed: 0,
            total: 0,
          };
          const progress =
            stats.total > 0
              ? Math.round((stats.completed / stats.total) * 100)
              : 0;

          return (
            <ModuleCard
              key={module.id}
              module={module}
              progress={progress}
              onClick={() => handleModuleClick(module)}
            />
          );
        })}
      </div>
    </section>
  );
}
