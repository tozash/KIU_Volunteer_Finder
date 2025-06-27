import { useFieldArray, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@/components/common/Toast'
import { api } from '@/lib/api'
import { useEffect, useState } from 'react'

interface FormValues {
  title: string
  date: string
  location: string
  imageUrl: string
  description: string
  questions: { value: string }[]
}

const EditEvent = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const addToast = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [event, setEvent] = useState<any>(null)

  useEffect(() => {
    const fetchEvent = async () => {  
      try {
        if (!id) return;
        const evt = await api.getEvent(id)
        setEvent(evt)
      } catch (err) {
        setError('Event not found')
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  const { register, control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      title: '',
      date: '',
      location: '',
      imageUrl: '',
      description: '',
      questions: [{ value: '' }],
    },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'questions' })

  useEffect(() => {
    if (event) {
      reset({
        title: event.org_title || '',
        date: event.start_date || '',
        location: event.city || '',
        imageUrl: event.image_url || '',
        description: event.description || '',
        questions: event.volunteer_form ? event.volunteer_form.map((q: string) => ({ value: q })) : [{ value: '' }],
      })
    }
  }, [event, reset])

  const onSubmit = async (data: FormValues) => {
    if (!id) return
    try {
      const eventPayload = {
        event_id: id,
        org_title: data.title,
        start_date: data.date,
        end_date: data.date,
        city: data.location,
        image_url: data.imageUrl,
        description: data.description,
        volunteer_form: data.questions.map((q) => q.value),
      }
      await api.updateEvent(eventPayload)
      addToast('Event updated')
      navigate(`/events/${id}`)
    } catch (err) {
      addToast('Failed to update event')
    }
  }

  if (loading) return <div className="p-4 max-w-screen-lg mx-auto">Loading...</div>
  if (error) return <div className="p-4 max-w-screen-lg mx-auto text-red-600">{error}</div>

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-xl font-bold mb-2">Edit Event</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 max-w-lg mx-auto">
        <input {...register('title')} placeholder="Title" className="input-primary w-full" />
        <input type="date" {...register('date')} className="input-primary w-full" />
        <input {...register('location')} placeholder="Location" className="input-primary w-full" />
        <input {...register('imageUrl')} placeholder="Image URL" className="input-primary w-full" />
        <textarea {...register('description')} placeholder="Description" className="input-primary w-full" />
      <div>
        <span className="font-medium">Questions</span>
        {fields.map((field, idx) => (
          <div key={field.id} className="flex items-center gap-2 my-1">
            <input
              {...register(`questions.${idx}.value` as const)}
              className="input-primary flex-1"
            />
            <button type="button" onClick={() => remove(idx)} className="text-red-500">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => append({ value: '' })} className="text-primary">
          + Add Question
        </button>
      </div>
        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>
    </div>

  )
}

export default EditEvent
