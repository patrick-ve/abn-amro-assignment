import type { Ref } from 'vue'
import type { CastMember, SearchResultItem, Show, ShowDetails } from '../../types/show'
import { useFetch } from '#app'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { getCachedShowById, useFetchAllShows, useFetchShowDetails, useSearchShows } from '../../composables/useFetchShows'

vi.mock('#app', () => ({
  useFetch: vi.fn(),
}))

const mock$fetch = vi.fn()
globalThis.$fetch = mock$fetch as any

function createMockShow(id: number, name: string): Show {
  return {
    id,
    url: `http://example.com/show/${id}`,
    name,
    type: 'Scripted',
    language: 'English',
    genres: ['Drama'],
    status: 'Running',
    runtime: 60,
    averageRuntime: 60,
    premiered: '2023-01-01',
    ended: null,
    officialSite: null,
    schedule: { time: '21:00', days: ['Monday'] },
    rating: { average: 8.5 },
    weight: 90,
    network: null,
    webChannel: { id: 1, name: 'Example+', country: null, officialSite: null },
    externals: { tvrage: 1, thetvdb: 1, imdb: 'tt123' },
    image: { medium: 'http://example.com/img.jpg', original: 'http://example.com/img_orig.jpg' },
    summary: `Summary for ${name}`,
    updated: Date.now(),
    _links: { self: { href: '' }, previousepisode: { href: '' } },
  }
}

function createMockShowDetails(id: number, name: string): ShowDetails {
  return {
    ...createMockShow(id, name),
    _embedded: {
      cast: [
        { person: { id: 101, name: 'Actor One', image: null, url: '', country: null, birthday: null, deathday: null, gender: null, updated: 0, _links: { self: { href: '' } } }, character: { id: 201, name: 'Character One', image: null, url: '', _links: { self: { href: '' } } }, self: false, voice: false },
        { person: { id: 102, name: 'Actor Two', image: null, url: '', country: null, birthday: null, deathday: null, gender: null, updated: 0, _links: { self: { href: '' } } }, character: { id: 202, name: 'Character Two', image: null, url: '', _links: { self: { href: '' } } }, self: false, voice: false },
      ] as CastMember[],
    },
  }
}

function createMockSearchResultItem(id: number, name: string): SearchResultItem {
  return {
    score: Math.random(),
    show: createMockShow(id, name),
  }
}

describe('useFetchShows', () => {
  beforeEach(() => {
    vi.mocked(useFetch).mockClear()
    mock$fetch.mockClear()
    vi.mocked(useFetch).mockReturnValue({
      data: ref(null),
      pending: ref(false),
      error: ref(null),
      execute: vi.fn(),
      refresh: vi.fn(),
    } as any)
    mock$fetch.mockResolvedValue([])
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('useFetchAllShows', () => {
    it('should call useFetch with correct URL and options', () => {
      const page = ref(1)
      useFetchAllShows(page)
      expect(useFetch).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          baseURL: 'https://api.tvmaze.com',
          key: 'shows-page-1',
          immediate: true,
          watch: false,
          server: false,
        }),
        expect.any(String),
      )
      const urlArg = vi.mocked(useFetch).mock.calls[0]![0] as Ref<string>
      expect(urlArg.value).toBe('/shows?page=1')

      page.value = 2
    })

    it('should return reactive refs for shows, loading, and error', async () => {
      const mockData = ref<Show[] | null>(null)
      const mockPending = ref(true)
      const mockError = ref<Error | null>(null)
      vi.mocked(useFetch).mockReturnValue({
        data: mockData,
        pending: mockPending,
        error: mockError,
        execute: vi.fn(),
        refresh: vi.fn(),
      } as any)

      const { shows, loading, error } = useFetchAllShows(0)

      expect(loading.value).toBe(true)
      expect(shows.value).toBeNull()
      expect(error.value).toBeNull()

      const fetchedShows: Show[] = [createMockShow(1, 'Show One'), createMockShow(2, 'Show Two')]
      mockData.value = fetchedShows
      mockPending.value = false
      await nextTick()

      expect(loading.value).toBe(false)
      expect(shows.value).toEqual(fetchedShows)
      expect(error.value).toBeNull()
    })

    it('should populate the cache when data is fetched', async () => {
      const mockData = ref<Show[] | null>(null)
      const mockPending = ref(true)
      vi.mocked(useFetch).mockReturnValue({
        data: mockData,
        pending: mockPending,
        error: ref(null),
        execute: vi.fn(),
        refresh: vi.fn(),
      } as any)

      useFetchAllShows(0)

      const show1 = createMockShow(10, 'Cached Show 1')
      const show2 = createMockShow(11, 'Cached Show 2')
      mockData.value = [show1, show2]
      mockPending.value = false
      await nextTick()

      expect(getCachedShowById(10)).toEqual(show1)
      expect(getCachedShowById(11)).toEqual(show2)
      expect(getCachedShowById(99)).toBeUndefined()
    })
  })

  describe('useFetchShowDetails', () => {
    it('should call useFetch with correct details URL and reactive key', async () => {
      const showId = ref(123)
      useFetchShowDetails(showId)

      expect(useFetch).toHaveBeenCalledTimes(1)
      expect(useFetch).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          baseURL: 'https://api.tvmaze.com',
          key: 'show-details-123',
          immediate: true,
          watch: [expect.any(Object)],
          server: false,
        }),
        expect.any(String),
      )
      const urlArg = vi.mocked(useFetch).mock.calls[0]![0] as Ref<string>
      expect(urlArg.value).toBe('/shows/123?embed=cast')

      const optionsArg = vi.mocked(useFetch).mock.calls[0]![1] as { key: string, watch: Ref[] }
      const keyRef = optionsArg.watch[0] as Ref<string>

      expect(keyRef.value).toBe('show-details-123')

      showId.value = 456
      await nextTick()

      expect(keyRef.value).toBe('show-details-456')
      expect(urlArg.value).toBe('/shows/456?embed=cast')

      expect(useFetch).toHaveBeenCalledTimes(1)
    })

    it('should return reactive refs for showDetails, loading, and error', async () => {
      const mockData = ref<ShowDetails | null>(null)
      const mockPending = ref(true)
      const mockError = ref<Error | null>(null)
      vi.mocked(useFetch).mockReturnValue({
        data: mockData,
        pending: mockPending,
        error: mockError,
        execute: vi.fn(),
        refresh: vi.fn(),
      } as any)

      const { showDetails, loading, error } = useFetchShowDetails(789)

      expect(loading.value).toBe(true)
      expect(showDetails.value).toBeNull()
      expect(error.value).toBeNull()

      const fetchedDetails: ShowDetails = createMockShowDetails(789, 'Detailed Show')
      mockData.value = fetchedDetails
      mockPending.value = false
      await nextTick()

      expect(loading.value).toBe(false)
      expect(showDetails.value).toEqual(fetchedDetails)
      expect(error.value).toBeNull()
    })
  })

  describe('useSearchShows', () => {
    it('should initialize with empty results and not loading', () => {
      const { searchResults, loading, error } = useSearchShows()
      expect(searchResults.value).toEqual([])
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
    })

    it('should not call $fetch if query is empty or whitespace', async () => {
      const { search } = useSearchShows()
      await search('')
      expect(mock$fetch).not.toHaveBeenCalled()
      await search('   ')
      expect(mock$fetch).not.toHaveBeenCalled()
    })

    it('should call $fetch with encoded query and update state', async () => {
      const { searchResults, loading, error, search } = useSearchShows()
      const query = 'breaking bad'
      const expectedUrl = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`
      const mockResponse: SearchResultItem[] = [
        createMockSearchResultItem(20, 'Breaking Bad'),
        createMockSearchResultItem(21, 'Breaking Good'),
      ]
      mock$fetch.mockResolvedValue(mockResponse)

      const searchPromise = search(query)

      expect(loading.value).toBe(true)
      expect(error.value).toBeNull()
      expect(searchResults.value).toEqual([])

      await searchPromise

      expect(mock$fetch).toHaveBeenCalledWith(expectedUrl)
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
      expect(searchResults.value).toEqual([mockResponse[0]!.show, mockResponse[1]!.show])
    })

    it('should handle $fetch error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { searchResults, loading, error, search } = useSearchShows()
      const query = 'error query'
      const expectedError = new Error('Network Error')
      mock$fetch.mockRejectedValue(expectedError)

      const searchPromise = search(query)

      expect(loading.value).toBe(true)

      await searchPromise

      expect(loading.value).toBe(false)
      expect(error.value).toBe(expectedError)
      expect(searchResults.value).toEqual([])

      consoleErrorSpy.mockRestore()
    })

    it('should reset results before starting a new search', async () => {
      const { searchResults, loading, error, search } = useSearchShows()
      const query1 = 'first'
      const query2 = 'second'
      const results1: SearchResultItem[] = [createMockSearchResultItem(30, 'First Show')]
      const results2: SearchResultItem[] = [createMockSearchResultItem(31, 'Second Show')]

      mock$fetch.mockResolvedValueOnce(results1)
      await search(query1)
      expect(searchResults.value).toEqual([results1[0]!.show])

      mock$fetch.mockResolvedValueOnce(results2)
      const searchPromise2 = search(query2)
      expect(searchResults.value).toEqual([])
      expect(loading.value).toBe(true)

      await searchPromise2
      expect(searchResults.value).toEqual([results2[0]!.show])
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
    })
  })

  describe('getCachedShowById', () => {
    it('should retrieve a show from cache if populated', async () => {
      const mockData = ref<Show[] | null>(null)
      vi.mocked(useFetch).mockReturnValue({
        data: mockData,
        pending: ref(false),
        error: ref(null),
        execute: vi.fn(),
        refresh: vi.fn(),
      } as any)

      useFetchAllShows(0)

      const showToCache = createMockShow(55, 'Cache Me')
      mockData.value = [showToCache]
      await nextTick()

      expect(getCachedShowById(55)).toEqual(showToCache)
    })

    it('should return undefined if show is not in cache', () => {
      expect(getCachedShowById(999)).toBeUndefined()
    })
  })
})
