import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  FormModal,
  TextField,
  createDefaultValues,
  toast
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

const schema = z.object({
  base_url: z.url('Enter a valid Home Assistant URL')
})

const MODULE_NAMESPACE = 'apps.melvinchia3636--home-assistant'


export function ConfigureModal({
  data: { initialData },
  onClose
}: {
  data: { initialData?: { base_url: string } | null }
  onClose: () => void
}) {
  const { t } = useModuleTranslation()
  const [testing, setTesting] = useState(false)

  const saveMutation = useForgeMutation(forgeAPI.settings.save, {
    action: 'update',
    queryKey: [forgeAPI.settings.key, forgeAPI.stats.key]
  })

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      base_url: initialData?.base_url ?? 'http://localhost:8123'
    },
    mode: 'all',
    resolver: zodResolver(schema)
  })

  async function handleTest() {
    const baseUrl = form.getValues('base_url')

    setTesting(true)

    try {
      const result = await forgeAPI.settings.test
        .input({ base_url: baseUrl })
        .query()

      toast.success(
        t('messages.testSuccess', {
          name: result.location_name,
          version: result.version
        })
      )
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('messages.testFailed')
      )
    } finally {
      setTesting(false)
    }
  }

  return (
    <FormModal
      form={form}
      submissionConfig={{
        label: t('buttons.save'),
        icon: 'tabler:device-floppy',
        handler: async data => {
          await saveMutation.mutateAsync(data)
        }
      }}
      uiConfig={{
        title: 'configure',
        icon: 'tabler:home-cog',
        namespace: MODULE_NAMESPACE,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:link"
        label="baseUrl"
        name="base_url"
        placeholder="http://localhost:8123"
      />
      <Button
        icon="tabler:plug-connected"
        loading={testing}
        mt="md"
        namespace={false}
        variant="secondary"
        onClick={handleTest}
      >
        {t('buttons.testConnection')}
      </Button>
    </FormModal>
  )
}
