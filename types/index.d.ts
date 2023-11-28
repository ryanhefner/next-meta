import { ForwardRefExoticComponent, PropsWithChildren } from 'react'

type TestComponentProps = PropsWithChildren

declare const TestComponent: ForwardRefExoticComponent<TestComponentProps>

export default TestComponent
