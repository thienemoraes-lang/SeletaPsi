import { Check, X } from "lucide-react"

export function Toast({ title, description }: { title: string, description?: string }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-start gap-4 rounded-lg bg-green-50 px-4 py-3 shadow-lg ring-1 ring-green-200">
      <div className="flex items-center justify-center rounded-full bg-green-100 p-1">
        <Check className="h-4 w-4 text-green-600" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-green-900">{title}</p>
        {description && <p className="text-sm text-green-800 opacity-90">{description}</p>}
      </div>
    </div>
  )
}

export function Toaster() {
  return null;
}
