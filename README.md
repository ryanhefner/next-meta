# 🧮 mathleet

[![npm](https://img.shields.io/npm/v/mathleet?style=flat-square)](https://www.pkgstats.com/pkg:mathleet)
[![NPM](https://img.shields.io/npm/l/mathleet?style=flat-square)](LICENSE)
[![npm](https://img.shields.io/npm/dt/mathleet?style=flat-square)](https://www.pkgstats.com/pkg:mathleet)

Library of helpful math utilities.

## Install

Via [npm](https://npmjs.com/package/mathleet)

```sh
npm install mathleet
```

Via [Yarn](https://yarn.pm/mathleet)

```sh
yarn add mathleet
```

## How to use

```js
import { keySum } from 'mathleet'

const values = [
  { a: 0, b: 1},
  { a: 1, b: 2},
  { a: 2, b: 3},
]

const sumA = keySum(values, 'a')

console.log(sumA)  // Output: 3

const sumB = keySum(values, 'b')

console.log(sumB)  // Output: 6
```

## Available methods

### Helpers

| Method                        | Description                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `filterNumbers(items: any[])` | Accepts an array of inputs and converts them to numbers and filters out all `NaN` entries. |

### General

| Method                 | Description                                                                   |
| ---------------------- | ----------------------------------------------------------------------------- |
| `numMin(items: any[])` | Takes an array of values and filters valid numbers, returning the `Math.min`. |
| `numMax(items: any[])` | Takes an array of values and filters valid numbers, returning the `Math.max`. |

### Arrays

| Method                                                               | Description                                                                                                           |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `sum(items: any[], offset: number = 0)`                              | Takes an array of values, and optional offset, and calculates sum of values with `offset` applied.                    |
| `sumAvg(items: any[], offset: number = 0)`                           | Takes an array of values and calculates the average, with `offset` applied to `sum` before divided by `items` length. |
| `rangeAvg(items: any[], rangeMin: number = 0, rangeMax: number = 1)` | Takes an array of values and calculates the average within a specified range.                                         |

### Geometry

| Method                                                   | Description                                                                                    |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `angle(pointA: Point`, `pointB: Point`, `pointC: Point)` | Takes three `Point` (`{ x: number, y: number }`) values and calculates the angle between them. |
| `degrees(value: number)`                                 | Convert `value` of radians to degrees.                                                         |
| `radians(value: number)`                                 | Convert `value` of degrees to radians.                                                         |

### Objects

| Method                                                                               | Description                                                                                                                       |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `keySum(items: any[], key: string)`                                                  | Accepts an array of objects and calculates the sum value for provided `key`.                                                      |
| `keyAvg(items: any[], key: string)`                                                  | Accepts an array of objects and calculates the avergage for the provided `key`.                                                   |
| `keyRangeAvg(items: any[], key: string, rangeMin: number = 0, rangeMax: number = 1)` | Accepts an array of objects and calculates the avaerage for the providfed `key` with values that fall within the specified range. |

### Physics

| Method                                     | Description                                                                |
| ------------------------------------------ | -------------------------------------------------------------------------- |
| `velocity(distance: number, time: number)` | Takes a `distance` value and `time` and returns the calculated `velocity`. |

### Proximity

| Method                                                       | Description                                                                                                                |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `outside(value: number, target: number, offset: number = 0)` | Takes a `value` and `target` and returns a `boolean` if values is `outside` the `target` range with the provided `offset`. |
| `within(value: number, target: number, offset: number = 0)`  | Takes a `value` and `target` and returns a `boolean` if is `within` the `target` range with the provided `offset`.         |

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
