import { useForm } from 'react-hook-form'

interface Props {
  open: boolean
  onClose: () => void
  eventId: number
  questions: string[]
}

interface FormValues {
  answers: string[]
}

const ApplicationModal = ({ open, onClose, eventId, questions }: Props) => {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { answers: questions.map(() => '') },
  })

  const onSubmit = async (values: FormValues) => {
    await fetch(`/events/${eventId}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div
        className="bg-white p-4 rounded w-96 relative"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-lg font-semibold mb-2">Apply</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {questions.map((q, i) => (
            <textarea
              key={i}
              {...register(`answers.${i}` as const)}
              className="border p-1 w-full rounded"
              placeholder={q}
            />
          ))}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-1 rounded"
          >
            Submit
          </button>
        </form>
        <button
          aria-label="Close"
          className="absolute top-2 right-2 text-xl leading-none"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default ApplicationModal
