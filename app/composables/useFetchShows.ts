import type { Ref } from 'vue'
import type { SearchResultItem, Show, ShowDetails } from '~/types/show'
import { useFetch } from '#app'
import { computed, ref, unref } from 'vue'

// --- Composable ---

// Base URL for the TVmaze API
const API_BASE_URL = 'https://api.tvmaze.com'

// No longer exporting a single composable with shared state.
// Exporting individual functions that encapsulate a useFetch call.

/**
 * Fetches a paginated list of all shows.
 * Returns reactive refs for data, pending, error, and an execute function.
 */
export function useFetchAllShows(page: Ref<number> | number = 0) {
  const url = computed(() => `/shows?page=${unref(page)}`)
  const key = `shows-page-${unref(page)}`

  // Use immediate: true for the initial load composable, makes sense for list view
  const { data, pending, error, execute, refresh } = useFetch<Show[]>(url, {
    baseURL: API_BASE_URL,
    key,
    immediate: true, // Fetch immediately when composable is used
    watch: false,
    server: false,
  })

  return {
    shows: data,
    loading: pending,
    error,
    fetchShows: execute, // Keep execute if manual trigger is needed
    refreshShows: refresh,
  }
}

/**
 * Fetches detailed information for a specific show.
 * Returns reactive refs for data, pending, error, and an execute/refresh function.
 */
export function useFetchShowDetails(showId: Ref<number | string> | number | string) {
  // Create a reactive URL computed property based on the showId
  const url = computed(() => `/shows/${unref(showId)}?embed=cast`)
  const key = computed(() => `show-details-${unref(showId)}`)

  // Use immediate: true and watch the key derived from showId
  const { data, pending, error, execute, refresh } = useFetch<ShowDetails>(url, {
    baseURL: API_BASE_URL,
    key: key.value,
    immediate: true, // Fetch immediately when ID is available
    watch: [key], // Re-fetch when the key (derived from showId) changes
    server: false,
  })

  return {
    showDetails: data,
    loading: pending,
    error,
    fetchDetails: execute, // Keep execute/refresh if manual trigger needed
    refreshDetails: refresh,
  }
}

/**
 * Searches for shows by name using manual state and $fetch.
 */
export function useSearchShows() {
  const searchResults: Ref<Show[]> = ref([])
  const loading = ref(false)
  const error: Ref<Error | null> = ref(null)

  const search = async (query: string) => {
    searchResults.value = [] // Reset previous results
    if (!query || !query.trim()) {
      loading.value = false
      error.value = null
      return // Don't search if query is empty
    }

    loading.value = true
    error.value = null
    const encodedQuery = encodeURIComponent(query.trim())
    const url = `${API_BASE_URL}/search/shows?q=${encodedQuery}`

    try {
      // Use $fetch for direct request control
      const response = await $fetch<SearchResultItem[]>(url)
      searchResults.value = Array.isArray(response) ? response.map((item: SearchResultItem) => item.show) : []
    }
    catch (err: any) {
      console.error('Search API Error:', err)
      error.value = err // Store the actual error object
      searchResults.value = [] // Clear results on error
    }
    finally {
      loading.value = false
    }
  }

  return {
    searchResults,
    loading,
    error,
    search, // Expose the search function
    // No refresh function provided in this manual implementation
  }
}

// Remove the old useTvMazeApi export (if it existed as a single function export)
// export function useTvMazeApi() { ... } // REMOVE THIS
