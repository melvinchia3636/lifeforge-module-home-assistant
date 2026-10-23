import { type ReactNode } from 'react'

import { Flex, Text, Transition, usePersonalization } from '@lifeforge/ui'

export function CircleButton({
  selected,
  disabled = false,
  ariaLabel,
  label,
  onClick,
  children
}: {
  selected: boolean
  disabled?: boolean
  ariaLabel: string
  label?: string
  onClick: () => void
  children: ReactNode
}) {
  const { getMostReadableColor } = usePersonalization()

  return (
    <Flex align="center" direction="column" flex="1" gap="sm">
      <Transition duration="150ms" property={['background-color', 'color']}>
        <Text
          asChild
          color={selected ? undefined : { base: 'bg-700', dark: 'bg-300' }}
        >
          <Flex
            align="center"
            aria-label={ariaLabel}
            aria-pressed={selected}
            as="button"
            bg={
              selected
                ? {
                    base: 'custom-500',
                    hover: 'custom-600',
                    darkHover: 'custom-400'
                  }
                : {
                    base: 'bg-200',
                    hover: 'bg-300',
                    dark: 'bg-800',
                    darkHover: 'bg-700'
                  }
            }
            disabled={disabled}
            flexShrink="0"
            height="4.5rem"
            justify="center"
            r="full"
            style={{
              ...(selected ? { color: getMostReadableColor() } : {}),
              ...(disabled ? { cursor: 'not-allowed', opacity: 0.5 } : {})
            }}
            type="button"
            width="4.5rem"
            onClick={onClick}
          >
            {children}
          </Flex>
        </Text>
      </Transition>
      {label && (
        <Text
          truncate
          align="center"
          as="p"
          color={selected ? 'primary' : 'muted'}
        >
          {label}
        </Text>
      )}
    </Flex>
  )
}
