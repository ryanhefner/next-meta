import React, { forwardRef } from 'react'

const TestComponent = forwardRef((props, ref) => (
  <div ref={ref}>Test Component</div>
))

TestComponent.displayName = 'TestComponent'

export default TestComponent
