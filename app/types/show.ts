export interface Show {
  id: number
  url: string
  name: string
  type: string
  language: string
  genres: string[]
  status: string
  runtime: number
  averageRuntime: number
  premiered: string | null
  ended: string | null
  officialSite: string | null
  schedule: {
    time: string
    days: string[]
  }
  rating: {
    average: number | null
  }
  weight: number
  network?: {
    id: number
    name: string
    country: {
      name: string
      code: string
      timezone: string
    }
    officialSite: string
  }
  webChannel: null | {
    id: number
    name: string
    officialSite: string | null
  }
  dvdCountry: string | null
  externals: {
    tvrage: number | null
    thetvdb: number | null
    imdb: string | null
  }
  image: {
    medium: string
    original: string
  } | null
  summary: string | null
  updated: number
  _links: {
    self: {
      href: string
    }
    previousepisode?: {
      href: string
      name: string
    }
  }
}

export interface GroupedShows {
  [genre: string]: Show[]
}
