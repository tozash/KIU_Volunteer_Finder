import { useFieldArray, useForm } from 'react-hook-form'

import { dummyEvents } from '@/lib/dummyData'
import type { Event } from '@/lib/dummyData'

import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@/components/common/Toast'


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
  const event = dummyEvents.find((e) => e.id === Number(id))

  if (!event) {
    return <div className="p-4 max-w-screen-lg mx-auto">Event not found</div>
  }

  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      title: event?.title ?? '',
      date: event?.date ?? '',
      location: event?.location ?? '',
      imageUrl: event?.imageUrl ?? '',
      description: event?.description ?? '',
      questions: event ? event.questions.map((q) => ({ value: q })) : [{ value: '' }],
    },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'questions' })

  const onSubmit = (data: FormValues) => {
    if (!event) return
    event.title = data.title
    event.date = data.date
    event.location = data.location
    event.imageUrl = data.imageUrl
    event.description = data.description
    event.questions = data.questions.map((q) => q.value)
    addToast('Event updated')
    navigate(`/events/${event.id}`)
  }

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-xl font-bold mb-2">Edit Event</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 max-w-lg mx-auto">
        <input {...register('title')} placeholder="Title" className="border p-1 w-full rounded" />
        <input type="date" {...register('date')} className="border p-1 w-full rounded" />
        <input {...register('location')} placeholder="Location" className="border p-1 w-full rounded" />
        <input {...register('imageUrl')} placeholder="Image URL" className="border p-1 w-full rounded" />
        <textarea {...register('description')} placeholder="Description" className="border p-1 w-full rounded" />
      <div>
        <span className="font-medium">Questions</span>
        {fields.map((field, idx) => (
          <div key={field.id} className="flex items-center gap-2 my-1">
            <input
              {...register(`questions.${idx}.value` as const)}
              className="border p-1 flex-1 rounded"
            />
            <button type="button" onClick={() => remove(idx)} className="text-red-500">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => append({ value: '' })} className="text-blue-600">
          + Add Question
        </button>
      </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>

  )
}

export default EditEvent
