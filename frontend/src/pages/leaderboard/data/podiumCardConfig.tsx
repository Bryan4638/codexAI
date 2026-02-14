import {
  IconLaurelWreath1,
  IconLaurelWreath2,
  IconLaurelWreath3,
} from '@tabler/icons-react'

export const config = {
  1: {
    icon: <IconLaurelWreath1 color="#FFD700" size={48} />,
    scale: 'scale-110 hover:scale-115',
    container:
      'glass-card p-10 text-center flex items-center justify-center flex-col cursor-pointer order-2 min-w-[220px] bg-[linear-gradient(135deg,rgba(0,240,255,0.2),rgba(139,92,246,0.2))] border-2 border-neon-cyan',
    avatarSize: 'w-24 h-24 text-4xl',
    nameClass: 'text-neon-cyan font-display',
  },
  2: {
    icon: <IconLaurelWreath2 color="#E2E8F0" size={38} />,
    scale: 'scale-95 hover:scale-100',
    container:
      'glass-card p-8 text-center flex items-center justify-center flex-col cursor-pointer order-1 min-w-45',
    avatarSize: 'w-20 h-20 text-3xl',
    nameClass: 'text-neon-purple',
  },
  3: {
    icon: <IconLaurelWreath3 color="#CD7F32" size={38} />,
    scale: 'scale-90 hover:scale-95',
    container:
      'glass-card p-6 text-center flex items-center justify-center flex-col cursor-pointer order-3 min-w-[170px]',
    avatarSize: 'w-16 h-16 text-2xl',
    nameClass: 'text-[#CD7F32]',
  },
}
