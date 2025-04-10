export interface Image {
  medium: string
  original: string
}

export interface Rating {
  average: number | null
}

export interface Network {
  id: number
  name: string
  country: {
    name: string
    code: string
    timezone: string
  } | null
  officialSite: string | null
}

export interface WebChannel {
  id: number
  name: string
  country: { name: string, code: string, timezone: string } | null
  officialSite: string | null
}

export interface Externals {
  tvrage: number | null
  thetvdb: number | null
  imdb: string | null
}

export interface Schedule {
  time: string
  days: string[]
}

export interface Links {
  self: { href: string }
  previousepisode?: { href: string }
  nextepisode?: { href: string }
}

export interface Show {
  id: number
  url: string
  name: string
  type: string
  language: string
  genres: string[]
  status: string
  runtime: number | null
  averageRuntime: number | null
  premiered: string | null
  ended: string | null
  officialSite: string | null
  schedule: Schedule
  rating: Rating
  weight: number
  network: Network | null
  webChannel: WebChannel | null
  externals: Externals
  image: Image | null
  summary: string | null
  updated: number
  _links: Links
}

export interface Person {
  id: number
  url: string
  name: string
  country: { name: string, code: string, timezone: string } | null
  birthday: string | null
  deathday: string | null
  gender: string | null
  image: Image | null
  updated: number
  _links: { self: { href: string } }
}

export interface Character {
  id: number
  url: string
  name: string
  image: Image | null
  _links: { self: { href: string } }
}

export interface CastMember {
  person: Person
  character: Character
  self: boolean
  voice: boolean
}

export interface ShowDetails extends Show {
  _embedded?: {
    cast?: CastMember[]
  }
}

export interface SearchResultItem {
  score: number
  show: Show
}

export interface GroupedShows {
  [genre: string]: Show[]
}
