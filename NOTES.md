# ChampionSelect

# Redux
+   Use _normalizr_ when stores would need to know too much about API response
    schema.

# Refactor
- [ ]   `@connect`
- [ ]   `mapDispatchToProps`
- [ ]   _reselect_

# Tiny
- [x]   API keys
- [ ]   support email address
- [x]   home page champion order

# Todo (later)
- [x]   serialize state
- [ ]   extract css build
- [ ]   `min-height` for components

# Nice to Have
- [ ]   _validate.js_
- [ ]   use cookies as backup to `localStorage`
- [ ]   update for `react-router` 2.0 changes
- [ ]   fix bug where multiple of the same `dispatches` won't work
- [ ]   catch errors at correct places
- [ ]   abort `fetch()`es on `componentWillUnmount()`
- [ ]   hot reloading
- [ ]   preload data (champion, matchup)
- [ ]   don't use jQuery
- [ ]   api middleware
- [ ]   restyle login/register

## Packages
+   https://github.com/ben-eb/cssnano

## Redux
-   store
    +   last 25 comment (heads) for last 10 champions
        reload "thread" each time
    +   last 25 counter tips for last 10 champions
        - last 250 countertips for single champion
    +   champion matchups for last 25 of each lane and type
        - load all matchups for a lane and type (store only last one in memory)
    +   RIOT's static data
    +   last 25 counter tips for last 10 matchups

    +   championCounterTips (last 10 champions)
    +   matchupCounterTips (last 10 champions)
    +   homeCounterTips
    +   matchups (last 10 champions)
    +   comments (last 100)
    +   champions (manual invalidation)

# Timeline
- [ ] POST interactions
      - [x] actions and routes
      - [x] upvote/downvote
      - [x] upvote/downvote restriction per IP address
      - [x] submit counter tip
      - [x] submit reply
      - [ ] optimistic replies with error messages
      - [ ] optimistic upvote/downvote
- [ ] "Show more" pages
      - [x] tabbed matchups display
      - [x] separate counter tips display
      - [x] comments display
      - [ ] paginate
- [x] Champion Page
      - [x] tabbed matchups display
      - [x] separate typeahead functionality
      - [x] separate counter tips display
- [x] Matchup Page
      - [x] tabbed matchups display
      - [x] heading display
      - [x] separate counter tips display
      - [x] separate typeahead functionality
      - [x] comments display
- [x] Authentication
      - [x] connect to auth server
      - [x] validation
      - [x] login/logout
      - [x] registration
      - [x] forgot password
      - [x] store and get data from sessions
- [ ] Ad integration
      - [x] integrate full width background ad
      - [ ] load ad tags properly through React
      - [ ] detect ad block and render site accordingly
      - [x] integrate rest of front page ad pages
