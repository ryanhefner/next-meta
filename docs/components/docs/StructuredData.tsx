import { Graph } from 'react-structured'

import {
  createPageGraph,
  type StructuredPage,
  type StructuredPageOptions,
} from '../../lib/structured-data'

export function StructuredData({
  page,
  ...options
}: StructuredPageOptions & { page: StructuredPage }) {
  return (
    <Graph id="page-structured-data" data={createPageGraph(page, options)} />
  )
}
