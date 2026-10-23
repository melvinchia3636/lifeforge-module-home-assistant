import { Box, Flex, Text } from '@lifeforge/ui'

export function SectionHeader({ title }: { title: string }) {
  return (
    <Flex align="center" gap="sm" pl="md" position="relative">
      <Box
        bg="custom-500"
        bottom="0"
        left="0"
        position="absolute"
        r="full"
        top="0"
        width="0.25rem"
      />
      <Text as="h2" size="lg" weight="semibold">
        {title}
      </Text>
    </Flex>
  )
}
