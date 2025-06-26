import { useFieldArray, useForm } from 'react-hook-form'
import { dummyEvents } from '@/lib/dummyData'
import type { Event } from '@/lib/dummyData'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/common/Toast'


interface FormValues {
  title: string
  date: string
  location: string
  imageUrl: string
  description: string
  questions: { value: string }[]
}

const CreateEvent = () => {
  const navigate = useNavigate()
  const addToast = useToast()

  const { register, control, handleSubmit } = useForm<FormValues>({
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

  const onSubmit = (data: FormValues) => {
    const newEvent: Event = {
      id: dummyEvents.length + 1,
      title: data.title,
      date: data.date,
      location: data.location,
      imageUrl: data.imageUrl,
      description: data.description,
      status: 'open',
      questions: data.questions.map((q) => q.value),
    }
    dummyEvents.push(newEvent)
    addToast('Event created')
    navigate(`/events/${newEvent.id}`)
  }

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-xl font-bold mb-2">Create Event</h1>
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
          Create
        </button>
      </form>
    </div>

  )
}

export default CreateEvent
