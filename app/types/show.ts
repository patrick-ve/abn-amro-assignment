export interface Show {
  id: number
  name: string
  genres: string[]
  rating: {
    average: number | null
  }
  image: {
    medium: string
    original: string
  } | null
  summary: string | null
  premiered: string | null
  ended: string | null
  status: string
  network?: {
    name: string
  }
  schedule: {
    time: string
    days: string[]
  }
}

export interface GroupedShows {
  [genre: string]: Show[]
}
