import { IconChevronDown, TablerIcon } from '@tabler/icons-react'
import React, { useEffect, useRef, useState } from 'react'

// Definimos la estructura de cada opción
export interface SelectOption {
  id: string
  label: string
  icon?: TablerIcon // Tipo específico de Tabler Icons
  colorClass?: string
}

// Definimos las props del componente
interface CyberSelectProps {
  options: SelectOption[]
  value: string
  onChange: (id: string) => void
  className?: string
}

const CyberSelect: React.FC<CyberSelectProps> = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cerrar al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find((opt) => opt.id === value)
  const SelectedIcon = selected?.icon

  return (
    <div className={`relative w-auto ${className}`} ref={dropdownRef}>
      {/* Botón Principal (Trigger) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between gap-6 px-4 py-2.5
          bg-bg-secondary border rounded-xl transition-all duration-300
          ${
            isOpen
              ? 'border-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)] ring-1 ring-neon-cyan/30'
              : 'border-white/10 hover:border-white/20 shadow-lg'
          }
        `}
      >
        <div className="flex items-center gap-3">
          {SelectedIcon && (
            <SelectedIcon
              size={20}
              className={selected.colorClass || 'text-neon-cyan'}
            />
          )}
          <span
            className={`font-display font-medium ${selected ? 'text-white' : 'text-white/40'}`}
          >
            {selected ? selected.label : 'Selecciona...'}
          </span>
        </div>
        <IconChevronDown
          size={18}
          className={`transition-transform duration-300 text-white/40 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <ul
          className="
          absolute z-100 w-full mt-2 p-1.5
          bg-bg-tertiary/95 backdrop-blur-md border border-white/10
          rounded-xl shadow-2xl overflow-hidden
          animate-in fade-in zoom-in duration-150
        "
        >
          {options.map((option) => {
            const Icon = option.icon
            return (
              <li
                key={option.id}
                onClick={() => {
                  onChange(option.id)
                  setIsOpen(false)
                }}
                className="
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-white/70 hover:text-white hover:bg-white/5
                  cursor-pointer transition-all duration-200 group
                "
              >
                {Icon && (
                  <Icon
                    size={18}
                    className={`${option.colorClass || 'text-neon-cyan'} group-hover:scale-110 transition-transform`}
                  />
                )}
                <span className="text-sm font-medium">{option.label}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default CyberSelect
