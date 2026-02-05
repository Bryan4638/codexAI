import { useState } from "react";
import ModuleCard from "@/components/ModuleCard";

const modulesData: Module[] = [
  {
    id: 1,
    title: "Variables y Tipos de Datos",
    description: "Aprende a almacenar y manipular información en tu código",
    icon: "📦",
    lessons: [
      { id: "1-1", title: "¿Qué son las variables?" },
      { id: "1-2", title: "Tipos de Datos" },
    ],
  },
  {
    id: 2,
    title: "Condicionales",
    description: "Toma decisiones en tu código usando if, else y operadores",
    icon: "🔀",
    lessons: [
      { id: "2-1", title: "Estructura if/else" },
      { id: "2-2", title: "Operadores de Comparación" },
    ],
  },
  {
    id: 3,
    title: "Bucles",
    description: "Repite acciones de forma eficiente con for y while",
    icon: "🔄",
    lessons: [
      { id: "3-1", title: "Bucle For" },
      { id: "3-2", title: "Bucle While" },
    ],
  },
  {
    id: 4,
    title: "Funciones",
    description: "Crea bloques de código reutilizables y organizados",
    icon: "⚡",
    lessons: [
      { id: "4-1", title: "Crear Funciones" },
      { id: "4-2", title: "Parámetros y Retorno" },
    ],
  },
];

interface Lesson {
  id: string;
  title: string;
  exercises?: any[];
}

interface Module {
  id: number;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export default function ModulesPage() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [moduleProgress, setModuleProgress] = useState<
    Record<string, { completed: number; total: number }>
  >({});

  const handleModuleClick = (module: Module) => {
    setSelectedModule(module);
  };
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
