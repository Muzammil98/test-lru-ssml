/**
 * A Least Recently Used (LRU) cache with Time-to-Live (TTL) support. Items are kept in the cache until they either
 * reach their TTL or the cache reaches its size and/or item limit. When the limit is exceeded, the cache evicts the
 * item that was least recently accessed (based on the timestamp of access). Items are also automatically evicted if they
 * are expired, as determined by the TTL.
 * An item is considered accessed, and its last accessed timestamp is updated, whenever `has`, `get`, or `set` is called with its key.
 *
 * Implement the LRU cache provider here and use the lru-cache.test.ts to check your implementation.
 * You're encouraged to add additional functions that make working with the cache easier for consumers.
 */

type LRUCacheProviderOptions = {
  ttl: number // Time to live in milliseconds
  itemLimit: number
}
type LRUCacheProvider<T> = {
  has: (key: string) => boolean
  get: (key: string) => T | undefined
  set: (key: string, value: T) => void
}

// TODO: Implement LRU cache provider
export function createLRUCacheProvider<T>({
  ttl,
  itemLimit,
}: LRUCacheProviderOptions): LRUCacheProvider<T> {
  let cache: any = {}

  // setTimeout(() => {
  //   console.log('TTL EXPIRED', ttl, cache)
  //   cache = {}
  // }, ttl)
  //X = Evict whole cache when ttl expire

  console.log('LRU', ttl, itemLimit)

  // PSUEDO
  // EACH ITEM SHOULD HAVE A TIMER (E.G 500)
  // AFTER SAVING, IT SHOULD START COUNTDOWN
  // IF ACCESSED, TIMER SHOULD RESTART
  // IF TIMER EXPIRED, ITEM SHOULD BE REMOVED
  //
  const updateItemAccessTime = (key: string) => {
    //X = Don't add when itemLimit is reached Evict the least accessed item
    // Extend ITEMS TTL
    cache[key] = { ...cache[key], lastAccessed: Date.now() }
  }

  const evictLeastAccessedItem = () => {
    const cacheValues: any = Object.values(cache)
    if (cacheValues.length === 1) {
      return (cache = {})
    }
    const minValue = Math.min(...cacheValues.map((item: any) => item.lastAccessed))
    const foundItem = cacheValues.find((item: any) => item.lastAccessed === minValue)

    console.log('cacheValues', cacheValues)
    console.log('minValue', minValue)
    console.log('foundItem', minValue)

    delete cache[foundItem.value]

    console.log('Item evicted', cache)

    return cache
  }

  return {
    has: (key: string) => {
      console.log('CACHE HAS ', key, cache[key])
      if (key in cache) {
        updateItemAccessTime(key)
        console.log('KEY FOUND IN HAS', cache[key], cache[key].ttl())
        return true
      }
      return false
    },
    get: (key: string) => {
      console.log('CACHE GET ', key, cache[key])
      if (key in cache) {
        updateItemAccessTime(key)
        return cache[key].value
      }
      return undefined
    },
    set: (key: string, value: T) => {
      if (Object.keys(cache).length === itemLimit) {
        console.log('ITEM LIMIT REACHED', Object.keys(cache).length, cache)
        // EVICT LEAST ACCESSED ITEM
        evictLeastAccessedItem()
      }
      cache[key] = {
        value,
        lastAccessed: Date.now(),
        // ttl: setTimeout(() => {
        //   return true
        // }, ttl)
        ttl: () => {
          let expired = false
          let ran = false
          if (!ran)
            setTimeout(() => {
              console.log("TIMER STARTED")
              expired = true
              ran = true
            }, ttl)
            console.log("TTL VALUE", expired)

          return expired
        },
      }
      cache[key].ttl()
      console.log('CACHE SET ', key, cache[key])
    },
  }
}
