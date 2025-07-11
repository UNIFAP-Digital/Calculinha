import {
  Attempt,
  Module,
  Operation,
  Room,
  Status,
  Student,
  Type,
} from '@/models'
import { isLightColor } from '@/utils/color'
import { Head, router } from '@inertiajs/react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  CheckCircle,
  ClipboardCheck,
  Divide,
  LockIcon as LockClosed,
  LucideIcon,
  Minus,
  Plus,
  RotateCcw, Star, // NOVO: Ícone para "Tentar Novamente"
  X,
  XCircle, // NOVO: Ícone alternativo para "Reprovado"
} from 'lucide-react'
import { useState } from 'react'

type CardConfig = {
  name: string
  color: string
  gradientStart: string
  gradientEnd: string
  baseColor: string
  icon: LucideIcon
  description: string
}

export default function QuizIndexPage({ room, attempt }: GameSelectPageProps) {
  function handleOnClick(moduleId: number) {
    router.visit(route('quiz.show', [room.id, moduleId]))
  }

  if (attempt.modules.length === 0) {
    return (
      <>
        <Head title="Jogar" />
        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-extrabold text-[#4B4B4B]">
              Nenhuma operação disponível
            </h1>
            <p className="text-xl text-[#777777]">
              Entre em contato com o administrador para adicionar operações.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head title="Jogar" />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <motion.header
            className="mb-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <h1 className="mb-4 text-4xl font-extrabold text-gray-800 md:text-5xl">
              Calculinha
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Complete cada módulo para desbloquear o próximo e avançar na sua
              jornada de aprendizado.
            </p>
          </motion.header>

          <div className="mx-auto max-w-3xl">
            {attempt.modules.map((module, index) => (
              <ModuleIntroCard
                key={module.id}
                module={module}
                index={index}
                onClick={handleOnClick}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

const getConfig = (type: Type, operation: Operation | null): CardConfig => {
  if (type === 'pre-test')
    return {
      name: 'Pré-Teste',
      color: '#5ebbff',
      gradientStart: '#5ebbff',
      gradientEnd: '#3d9dff',
      baseColor: '#2a85e5',
      icon: ClipboardCheck,
      description: 'Avaliação inicial de conhecimentos',
    }

  if (type === 'post-test')
    return {
      name: 'Pós-Teste',
      color: '#ff7ad9',
      gradientStart: '#ff7ad9',
      gradientEnd: '#ff42c0',
      baseColor: '#e032a8',
      icon: Award,
      description: 'Avaliação final de conhecimentos',
    }

  if (operation === null)
    throw new TypeError(
      'A operação não pode ser null quando o tipo é exercício',
    )

  const operations: Record<Operation, CardConfig> = {
    addition: { name: 'Adição', color: '#20e4bc', gradientStart: '#20e4bc', gradientEnd: '#0fbf96', baseColor: '#0aa582', icon: Plus, description: 'Aprenda a somar números' },
    subtraction: { name: 'Subtração', color: '#a18cff', gradientStart: '#a18cff', gradientEnd: '#7c5cff', baseColor: '#6a4aef', icon: Minus, description: 'Pratique a subtração de valores' },
    multiplication: { name: 'Multiplicação', color: '#ff7e7e', gradientStart: '#ff7e7e', gradientEnd: '#ff5252', baseColor: '#e64545', icon: X, description: 'Multiplique números facilmente' },
    division: { name: 'Divisão', color: '#ffcf5e', gradientStart: '#ffcf5e', gradientEnd: '#ffb72a', baseColor: '#e59e1a', icon: Divide, description: 'Aprenda a dividir valores' },
  }

  return operations[operation]
}

export interface GameSelectPageProps {
  room: Room
  student: Student
  attempt: Attempt
}

type ModuleIntroCardProps = {
  module: Module
  index: number
  onClick: (moduleId: number) => void
}

function ModuleIntroCard({ module, index, onClick }: ModuleIntroCardProps) {

  console.log('ModuleIntroCard', module);
  const [isHovered, setIsHovered] = useState(false)
  const status = module.status!
  const completedActivities = module.activities_completed!
  const progressPercentage = (completedActivities / module.activities_count!) * 100

  const { color, baseColor, icon: IconComponent, gradientStart, name, description } = getConfig(module.type, module.operation)

  const isInteractive = status === 'current' || status === 'failed' || status === 'passed'

  // 2. Define cores e estilos com base no novo status.
  let cardColor = color
  let cardGradientStart = gradientStart
  let cardGradientEnd = baseColor
  let textColor = isLightColor(baseColor) ? '#000000' : '#FFFFFF'

  if (status === 'locked') {
    cardColor = '#9CA3AF'
    cardGradientStart = '#9CA3AF'
    cardGradientEnd = '#6B7280'
    textColor = '#FFFFFF'
  } else if (status === 'failed') {
    // Cor avermelhada para indicar que precisa tentar novamente.
    cardColor = '#FF8A80' // Light Red
    cardGradientStart = '#FF8A80'
    cardGradientEnd = '#FF5252' // Red
    textColor = '#FFFFFF'
  }

  // 3. Define o ícone e o texto do status com base nos novos casos.
  const StatusInfo = {
    current: { icon: ArrowRight, text: 'Em andamento' },
    locked: { icon: LockClosed, text: 'Bloqueado' },
    passed: { icon: CheckCircle, text: 'Aprovado' },
    failed: { icon: RotateCcw, text: 'Tente Novamente' },
    completed: { icon: CheckCircle, text: 'Completado' }, // Fallback para status antigo
  }
  const { icon: StatusIcon, text: statusText } = StatusInfo[status] || StatusInfo.completed;

  // -- FIM DAS ALTERAÇÕES --

  const isExercise = module.type !== 'exercise'

  return (
    <motion.div
      className={`mb-8 ${isExercise ? 'relative z-10' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}>
      {module.type === 'post-test' && (
        <div className="relative mt-12 mb-8">
          <div className="absolute right-6 left-6 h-0.5 bg-gray-200"></div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-4 text-sm font-medium text-gray-500">
              AVALIAÇÃO FINAL
            </span>
          </div>
        </div>
      )}

      <div
        className="mb-2 grid"
        style={{
          gridTemplateColumns: '70px 1fr',
          gridTemplateAreas: `"number card" "______ bar"`,
        }}>
        <div
          className="relative mr-4 self-center"
          style={{ gridArea: 'number' }}>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${status === 'locked' ? 'opacity-60' : ''
              } ${status === 'passed' ? 'opacity-80' : ''} ${isExercise ? 'border-2 border-white' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${cardGradientStart}, ${cardGradientEnd})`,
              color: textColor,
              boxShadow: isExercise ? '0 0 0 4px rgba(0,0,0,0.05)' : '0 4px 6px rgba(0,0,0,0.1)',
            }}>
            {index + 1}
          </div>
        </div>
        <motion.div
          className="flex-1"
          whileHover={{ scale: isInteractive ? 1.02 : 1 }}
          onHoverStart={() => isInteractive && setIsHovered(true)}
          onHoverEnd={() => isInteractive && setIsHovered(false)}
          style={{ gridArea: 'card' }}
          onClick={() => isInteractive && onClick(module.id)}>
          <motion.div
            className={`relative overflow-hidden rounded-2xl p-5 shadow-lg ${!isInteractive ? 'cursor-not-allowed' : 'cursor-pointer'
              } ${status === 'locked' ? 'opacity-70' : ''} ${status === 'passed' ? 'opacity-85' : ''} ${isExercise ? 'border-2 border-white' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${cardGradientStart}, ${cardGradientEnd})`,
              boxShadow: isExercise ? '0 8px 20px rgba(0,0,0,0.15)' : '0 4px 10px rgba(0,0,0,0.1)',
            }}
            whileTap={{ scale: isInteractive ? 0.98 : 1 }}>

            {(status === 'passed' || status === 'failed') && (
              <div className={`pointer-events-none absolute inset-0 ${status === 'passed' ? 'bg-green-500/10' : 'bg-red-500/10'}`}></div>
            )}

            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="none"/><circle cx="20" cy="20" r="3" fill="white"/><circle cx="60" cy="20" r="3" fill="white"/><circle cx="20" cy="60" r="3" fill="white"/><circle cx="60" cy="60" r="3" fill="white"/><circle cx="40" cy="40" r="3" fill="white"/><circle cx="80" cy="40" r="3" fill="white"/><circle cx="40" cy="80" r="3" fill="white"/><circle cx="80" cy="80" r="3" fill="white"/></svg>\')', backgroundSize: '30px 30px' }} />

            <div className="flex items-center">
              <div className="mr-4">
                <FatIcon icon={IconComponent} color={baseColor} size={32} status={status} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold" style={{ color: textColor }}>
                  {module.name ?? name}
                </h2>
                <p className="text-sm opacity-90" style={{ color: textColor }}>
                  {module.description ?? description}
                </p>
                <div
                  className="mt-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    color: textColor,
                  }}>
                  {statusText}
                </div>
                {(status === 'passed' || status === 'failed') && (
                  <div className="inline-flex items-center gap-1 rounded-full bg-white/25 px-2.5 py-1 text-xs font-semibold" style={{ color: textColor }}>
                    <Star size={12} className="opacity-80 flex-shrink-0" />
                    <span className="font-mono">{module?.score} / {module.activities_count}</span>
                  </div>
                )}
              </div>
              <motion.div
                animate={{ x: isHovered && isInteractive ? 5 : 0 }}
                transition={{ type: 'spring', stiffness: 300 }}>
                <StatusIcon color={textColor} size={24} />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        <div className="mt-2 px-1" style={{ gridArea: 'bar' }}>
          <div className="flex items-center gap-3">
            <div className={`h-3 flex-1 overflow-hidden rounded-full bg-gray-200 ${!isInteractive ? 'opacity-50' : ''}`}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: cardColor }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
            <div
              className={`rounded-full px-2 py-1 text-xs font-bold shadow-sm ${!isInteractive ? 'opacity-50' : ''}`}
              style={{ backgroundColor: cardColor, color: textColor }}>
              {completedActivities} de {module.activities_count}
            </div>
          </div>
        </div>
      </div>

      {module.type === 'pre-test' && (
        <div className="relative mt-12 mb-8">
          <div className="absolute right-6 left-6 h-0.5 bg-gray-200"></div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-4 text-sm font-medium text-gray-500">
              OPERAÇÕES MATEMÁTICA
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

type FatIconProps = {
  icon: LucideIcon
  color: string
  size: number
  className?: string
  status: Status
}

function FatIcon({ icon: Icon, color, size = 24, className = '', status = 'current' }: FatIconProps) {
  const iconColor = 'white'
  let bgColor = color
  if (status === 'locked' || status === 'failed') bgColor = '#9CA3AF'

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))' }}>
      <div className="absolute rounded-full" style={{ width: size + 4, height: size + 4, background: bgColor, opacity: 0.7, transform: 'translateY(3px)', filter: 'blur(2px)' }} />
      <div className="absolute rounded-full" style={{ width: size + 8, height: size + 8, background: bgColor }} />
      <div className="relative z-10">
        <Icon size={size} strokeWidth={3} color={iconColor} />
      </div>
    </div>
  )
}
