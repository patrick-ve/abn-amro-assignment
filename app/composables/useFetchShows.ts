import type { Ref } from 'vue'
import type { SearchResultItem, Show, ShowDetails } from '~/types/show' // Import the types
import { useFetch } from '#app' // Import useFetch
import { ref } from 'vue'

// --- Composable ---

// Base URL for the TVmaze API
const API_BASE_URL = 'https://api.tvmaze.com'

/**
 * Composable for interacting with the TVmaze API using Nuxt 3's useFetch.
 */
export function useTvMazeApi() {
  // Reactive state variables with types
  const shows: Ref<Show[]> = ref([]) // For storing the list of all shows
  const showDetails: Ref<ShowDetails | null> = ref(null) // For storing details of a single show
  const searchResults: Ref<Show[]> = ref([]) // For storing search results (just the show part)
  const loading: Ref<boolean> = ref(false) // Loading indicator
  const error: Ref<string | null> = ref(null) // Error handling

  // Common options for useFetch
  const fetchOptions = {
    baseURL: API_BASE_URL,
    onRequest() {
      loading.value = true
      error.value = null
    },
    onResponse() {
      loading.value = false
    },
    onResponseError({ response }: any) { // Use 'any' for simplicity or define a specific error type
      loading.value = false
      error.value = `API Error: ${response.status} - ${response.statusText || 'Failed to fetch'}`
      console.error('API Fetch Error:', response)
    },
    // Use lazy: false if you want to await the fetch directly in the function
    // and ensure data is available immediately after the call.
    // lazy: false,
  }

  /**
   * Fetches a paginated list of all shows.
   * @param page - The page number to fetch (defaults to 0).
   */
  const fetchAllShows = async (page: number = 0): Promise<void> => {
    // Reset state specific to this fetch
    shows.value = []
    // Use spread operator to merge common options with specific ones
    const { data: fetchedData, error: fetchError } = await useFetch<Show[]>(`/shows?page=${page}`, {
      ...fetchOptions,
      key: `shows-page-${page}`, // Unique key for caching
    })

    if (fetchError.value) {
      // Error is already handled by onResponseError, but we ensure the state is cleared
      shows.value = []
      // Update the main error ref if not already set by hook
      if (!error.value) {
        error.value = fetchError.value?.message || 'Failed to fetch shows'
      }
    }
    else {
      shows.value = fetchedData.value ?? []
    }
    // Loading is handled by hooks
  }

  /**
   * Fetches detailed information for a specific show, including cast.
   * @param showId - The ID of the show to fetch.
   */
  const fetchShowDetails = async (showId: number | string): Promise<void> => {
    showDetails.value = null
    const { data: fetchedData, error: fetchError } = await useFetch<ShowDetails>(`/shows/${showId}?embed=cast`, {
      ...fetchOptions,
      key: `show-details-${showId}`, // Unique key
    })

    if (fetchError.value) {
      showDetails.value = null
      if (!error.value) {
        error.value = fetchError.value?.message || 'Failed to fetch show details'
      }
    }
    else {
      showDetails.value = fetchedData.value ?? null
    }
  }

  /**
   * Searches for shows by name.
   * @param query - The search term.
   */
  const searchShows = async (query: string): Promise<void> => {
    searchResults.value = []
    if (!query) {
      return // No need to fetch if query is empty
    }

    // Encode the query parameter
    const encodedQuery = encodeURIComponent(query)
    const { data: fetchedData, error: fetchError } = await useFetch<SearchResultItem[]>(`/search/shows?q=${encodedQuery}`, {
      ...fetchOptions,
      key: `search-shows-${encodedQuery}`, // Unique key
    })

    if (fetchError.value) {
      searchResults.value = []
      if (!error.value) {
        error.value = fetchError.value?.message || 'Failed to search shows'
      }
    }
    else {
      // We only want the 'show' part of each result item.
      searchResults.value = fetchedData.value?.map(result => result.show) ?? []
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
