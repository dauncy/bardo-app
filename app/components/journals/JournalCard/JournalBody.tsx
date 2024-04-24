import { useState } from 'react'

export const JournalBody = ({ body, id }: { body: string; id: string }) => {
  const [expanded, setExpanded] = useState(false)
  const content = expanded ? body : body.slice(0, 120)
  return (
    <div className="relative font-regular">
      <p className="whitespace-pre-line font-regular">{content}</p>
      {!expanded && body.length > 120 && (
        <div
          className="absolute bottom-0 right-0 cursor-pointer bg-white px-2 py-1 font-medium text-xs text-foreground hover:text-violet-600 hover:underline"
          onClick={() => setExpanded(true)}
        >
          {'...Read more'}
        </div>
      )}
    </div>
  )
}
