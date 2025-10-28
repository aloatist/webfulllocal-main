'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

type FormData = {
  title?: string | null
  subtitle?: string | null
  description?: string | null
  imageUrl?: string | null
  videoUrl?: string | null
  ctaText?: string | null
  ctaLink?: string | null
}

interface HomepageSectionFormProps {
  section: string
  initialData?: FormData
}

export function HomepageSectionForm({ section, initialData }: HomepageSectionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: initialData })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      await fetch(`/api/admin/homepage/${section}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      // Show success toast
    } catch (error) {
      // Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Title</Label>
          <Input {...register('title')} />
        </div>
        <div>
          <Label>Subtitle</Label>
          <Input {...register('subtitle')} />
        </div>
      </div>
      
      <div>
        <Label>Description</Label>
        <Textarea {...register('description')} rows={4} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Image URL</Label>
          <Input {...register('imageUrl')} />
        </div>
        <div>
          <Label>Video URL</Label>
          <Input {...register('videoUrl')} />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>CTA Text</Label>
          <Input {...register('ctaText')} />
        </div>
        <div>
          <Label>CTA Link</Label>
          <Input {...register('ctaLink')} />
        </div>
      </div>
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
