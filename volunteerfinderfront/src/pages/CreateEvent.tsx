import { useFieldArray, useForm } from 'react-hook-form'
import { dummyEvents, Event } from '@/lib/dummyData'

interface FormValues {
  title: string
  date: string
  location: string
  imageUrl: string
  description: string
  questions: { value: string }[]
}

const CreateEvent = () => {
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
    console.log('Created event', newEvent)
  }

  return (
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
        Create
      </button>
    </form>
  )
}

export default CreateEvent
