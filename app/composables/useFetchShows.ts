import type { Ref } from 'vue'
import { ref } from 'vue'

interface Image {
  medium: string
  original: string
}

interface Rating {
  average: number | null
}

interface Network {
  id: number
  name: string
  country: {
    name: string
    code: string
    timezone: string
  } | null
  officialSite: string | null
}

interface WebChannel {
  id: number
  name: string
  country: { name: string, code: string, timezone: string } | null
  officialSite: string | null
}

interface Externals {
  tvrage: number | null
  thetvdb: number | null
  imdb: string | null
}

interface Schedule {
  time: string
  days: string[]
}

interface Links {
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

// Cast Member structure
interface Person {
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

interface Character {
  id: number
  url: string
  name: string
  image: Image | null
  _links: { self: { href: string } }
}

interface CastMember {
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
interface SearchResultItem {
  score: number
  show: Show
}

// --- Composable ---

// Base URL for the TVmaze API
const API_BASE_URL = 'https://api.tvmaze.com'

/**
 * Composable for interacting with the TVmaze API.
 */
export function useTvMazeApi() {
  // Reactive state variables with types
  const shows: Ref<Show[]> = ref([]) // For storing the list of all shows
  const showDetails: Ref<ShowDetails | null> = ref(null) // For storing details of a single show
  const searchResults: Ref<Show[]> = ref([]) // For storing search results (just the show part)
  const loading: Ref<boolean> = ref(false) // Loading indicator
  const error: Ref<string | null> = ref(null) // Error handling

  /**
   * Fetches data from a given URL.
   * @param url - The URL to fetch data from.
   * @returns The JSON response data.
   * @throws Throws an error if the fetch request fails.
   */
  const fetchData = async <T>(url: string): Promise<T> => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return await response.json() as T
    }
    catch (err: unknown) {
      console.error('API Fetch Error:', err)
      if (err instanceof Error) {
        error.value = err.message
      }
      else {
        error.value = 'An unknown error occurred while fetching data'
      }
      throw err // Re-throw to allow calling function to handle
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Fetches a paginated list of all shows.
   * The TVmaze API might return a 404 eventually when a page number is too high.
   * Consider fetching pages sequentially until a 404 or empty result is received.
   * For simplicity, this initially fetches just one page.
   * @param page - The page number to fetch (defaults to 0).
   */
  const fetchAllShows = async (page: number = 0): Promise<void> => {
    try {
      // Note: This fetches only one page. A full implementation
      // might need to loop through pages until no more shows are found.
      // The API returns an array of Show objects directly for the /shows endpoint.
      const data = await fetchData<Show[]>(`${API_BASE_URL}/shows?page=${page}`)
      shows.value = data // Or handle pagination: shows.value.push(...data);
    }
    catch {
      // Error is already set by fetchData, potentially clear shows list
      shows.value = []
    }
  }

  /**
   * Fetches detailed information for a specific show, including cast.
   * @param showId - The ID of the show to fetch.
   */
  const fetchShowDetails = async (showId: number | string): Promise<void> => {
    try {
      // Embed cast information directly using ?embed=cast
      // The API returns a single ShowDetails object for this endpoint.
      const data = await fetchData<ShowDetails>(`${API_BASE_URL}/shows/${showId}?embed=cast`)
      showDetails.value = data
    }
    catch {
      // Error is already set by fetchData, potentially clear details
      showDetails.value = null
    }
  }

  /**
   * Searches for shows by name.
   * @param query - The search term.
   */
  const searchShows = async (query: string): Promise<void> => {
    if (!query) {
      searchResults.value = []
      return
    }
    try {
      // The API returns an array of SearchResultItem objects.
      const data = await fetchData<SearchResultItem[]>(`${API_BASE_URL}/search/shows?q=${encodeURIComponent(query)}`)
      // We only want the 'show' part of each result item.
      searchResults.value = data.map(result => result.show)
    }
    catch {
      // Error is already set by fetchData, potentially clear results
      searchResults.value = []
    }
  }

  // Expose reactive state and methods
  return {
    shows,
    showDetails,
    searchResults,
    loading,
    error,
    fetchAllShows,
    fetchShowDetails,
    searchShows,
  }
}
