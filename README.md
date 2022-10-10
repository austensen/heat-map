This is a map of buildings with complaints for lack of heat, built for Brooklyn Eviction Defense.

**[View it on the web](https://austensen.github.io/heat-map)**

## Quick start

You will need to first copy `.env.sample` to `.env` and edit it accordingly.

Then run:

```
yarn --frozen-lockfile
yarn build-data
yarn watch
```

Then visit http://localhost:1234/heat-map.

## Updating data

To update the data, re-run `yarn build-data`.

## Deployment

To deploy the site, run `yarn deploy`.

---

This project borrows heavily from the [Housing Data Coalition's](https://www.housingdatanyc.org/) [`rtc-eviction-viz`](https://github.com/housing-data-coalition/rtc-eviction-viz/) project for the overall structure and data updating. It also relies on [NYCDB](https://github.com/nycdb/nycdb) for all of the data.
