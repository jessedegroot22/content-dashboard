'use client'

import JobStatusTracker from '@/components/JobStatusTracker'

interface JobClientProps {
  opdrachId: string
  keyword: string
  contentActie: 'Optimaliseren' | 'Creëren'
}

export default function JobClient({ opdrachId, keyword, contentActie }: JobClientProps) {
  return (
    <JobStatusTracker
      opdrachId={opdrachId}
      keyword={keyword}
      contentActie={contentActie}
    />
  )
}
