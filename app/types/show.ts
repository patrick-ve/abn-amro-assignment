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

// Basic Show structure (used in lists and search results)
export interface Show {
  id: number
  url: string
  name: string
  type: string
  language: string
  genres: string[]
  status: string
  runtime: number | null // Updated from number
  averageRuntime: number | null // Updated from number
  premiered: string | null
  ended: string | null
  officialSite: string | null
  schedule: Schedule // Use interface
  rating: Rating // Use interface
  weight: number
  network: Network | null // Use interface
  webChannel: WebChannel | null // Use interface
  externals: Externals // Use interface
  image: Image | null // Use interface
  summary: string | null
  updated: number
  _links: Links // Use interface
}

// Cast Member structure
export interface Person {
  id: number
  url: string
  name: string
  country: { name: string, code: string, timezone: string } | null
  birthday: string | null
  deathday: string | null
  gender: string | null
  image: Image | null // Use interface
  updated: number
  _links: { self: { href: string } }
}

export interface Character {
  id: number
  url: string
  name: string
  image: Image | null // Use interface
  _links: { self: { href: string } }
}

export interface CastMember {
  person: Person
  character: Character
  self: boolean
  voice: boolean
}

// Show Details structure (extends Show and adds embedded cast)
export interface ShowDetails extends Show {
  _embedded?: {
    cast?: CastMember[]
    // Add other potential embedded types like episodes if needed later
  }
}

// Structure for the search endpoint response item
export interface SearchResultItem {
  score: number
  show: Show
}

// Keep existing GroupedShows interface
export interface GroupedShows {
  [genre: string]: Show[]
}
