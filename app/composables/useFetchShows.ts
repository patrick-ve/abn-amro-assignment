import type { Ref } from 'vue'
import type { SearchResultItem, Show, ShowDetails } from '~/types/show'
import { useFetch } from '#app'
import { computed, ref, unref, watch } from 'vue'

const API_BASE_URL = 'https://api.tvmaze.com'

const allShowsCache = ref<Record<number, Show>>({})

export function useFetchAllShows(page: Ref<number> | number = 0) {
  const url = computed(() => `/shows?page=${unref(page)}`)
  const key = `shows-page-${unref(page)}`

  const { data, pending, error, execute, refresh } = useFetch<Show[]>(url, {
    baseURL: API_BASE_URL,
    key,
    immediate: true,
    watch: false,
    server: false,
  })

  watch(data, (newShows) => {
    if (newShows) {
      newShows.forEach((show) => {
        if (show && show.id) {
          allShowsCache.value[show.id] = show
        }
      })
    }
  }, { immediate: true })

  return {
    shows: data,
    loading: pending,
    error,
    fetchShows: execute,
    refreshShows: refresh,
  }
}

export function useFetchShowDetails(showId: Ref<number | string> | number | string) {
  const url = computed(() => `/shows/${unref(showId)}?embed=cast`)
  const key = computed(() => `show-details-${unref(showId)}`)

  const { data, pending, error, execute, refresh } = useFetch<ShowDetails>(url, {
    baseURL: API_BASE_URL,
    key: key.value,
    immediate: true,
    watch: [key],
    server: false,
  })

  return {
    showDetails: data,
    loading: pending,
    error,
    fetchDetails: execute,
    refreshDetails: refresh,
  }
}

export function useSearchShows() {
  const searchResults: Ref<Show[]> = ref([])
  const loading = ref(false)
  const error: Ref<Error | null> = ref(null)

  const search = async (query: string) => {
    searchResults.value = []
    if (!query || !query.trim()) {
      loading.value = false
      error.value = null
      return
    }

    loading.value = true
    error.value = null
    const encodedQuery = encodeURIComponent(query.trim())
    const url = `${API_BASE_URL}/search/shows?q=${encodedQuery}`

    try {
      const response = await $fetch<SearchResultItem[]>(url)
      searchResults.value = Array.isArray(response) ? response.map((item: SearchResultItem) => item.show) : []
    }
    catch (err: any) {
      console.error('Search API Error:', err)
      error.value = err
      searchResults.value = []
    }
    finally {
      loading.value = false
    }
  }

  return {
    searchResults,
    loading,
    error,
    search,
  }
}

export function getCachedShowById(id: number): Show | undefined {
  return allShowsCache.value[id]
}
