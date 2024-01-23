export const JournalSkeleton = () => {
  return (
    <div className="relative flex h-[400px] flex-col rounded-md border border-slate-200 px-4 py-5 ">
      <div className="flex gap-x-4">
        <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
        <div className="flex w-3/4 flex-col gap-y-2">
          <div className="h-2 w-1/5 animate-pulse rounded-full bg-slate-200" />
          <div className="h-2 w-1/3 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
      <div className="mt-5 flex w-3/4 flex-col gap-y-2">
        <div className="h-2 w-full animate-pulse rounded-full bg-slate-200" />
        <div className="h-2 w-4/5 animate-pulse rounded-full bg-slate-200" />
        <div className="h-2 w-2/3 animate-pulse rounded-full bg-slate-200" />
        <div className="my-3" />
        <div className="h-2 w-4/5 animate-pulse rounded-full bg-slate-200" />
        <div className="h-2 w-full animate-pulse rounded-full bg-slate-200" />
        <div className="h-2 w-1/5 animate-pulse rounded-full bg-slate-200" />
        <div className="h-2 w-full animate-pulse rounded-full bg-slate-200" />
        <div className="h-2 w-4/5 animate-pulse rounded-full bg-slate-200" />
        <div className="h-2 w-2/3 animate-pulse rounded-full bg-slate-200" />
        <div className="my-3" />
        <div className="h-2 w-4/5 animate-pulse rounded-full bg-slate-200" />
        <div className="h-2 w-full animate-pulse rounded-full bg-slate-200" />
        <div className="h-2 w-1/5 animate-pulse rounded-full bg-slate-200" />
      </div>
    </div>
  )
}
