import test from "node:test"

interface Props1 {
    test: string,
    testNum: number,
    testCond?: string[]
}

interface PropsA{
    testVar: string
}

interface Props2 extends Props1 {
    testVar: string
}

interface PropCombine {
    prop1: Props1,
    propA: PropsA
}

interface Tree{
    [key: string]: {
        data: string,
        children: string[]
    }
}

function TestSubComponent(props: Props1){
    if(props.testCond !== undefined)
        console.log(props.testCond[0].substring(1, 3));

    return (
        <>
            <p>{props.test}</p>
            <p>{props.testNum}</p>
        </>
    )
}

function TestComponent(props: Props1 & PropsA){
    return (
        <>
            <TestSubComponent {...props} />
            <p>Final variable: {props.testVar}</p>
        </>
    )
    
}

function TestComponentCombine(props: PropCombine){
    return (
        <>
            <TestSubComponent {...props.prop1} />
            <p>Final variable: {props.propA.testVar}</p>
        </>
    )
    
}

function TestComponentCombineInline(props: {prop1: Props1, propA: PropsA}){
    return (
        <>
            <TestSubComponent {...props.prop1} />
            <p>Final variable: {props.propA.testVar}</p>
        </>
    )
}

function TestTree({tree} : {tree: Tree}){
    // for(const property in tree)
    return (
        <>
        {
            Object.keys(tree).map(k => <p key={k}>{k}, {tree[k].data}</p>)
        }
        </>
    )
    
        
    // for (const child of tree["root"].children)
}

export default function Test() {
    const prop1 = {test: "test string", testNum:10};
    const propA = {testVar: "TEST!"}

    return (
        <>
            <h1>Test</h1>
            <hr />
            <TestComponent test="test value" testNum={10} testVar="testing" />
            <hr />
            <TestComponentCombine {...{prop1, propA}} />
            <hr />
            {/* prop1={test:"test 1", testNum:14} propA={testVar: "test"} */}
            <TestComponentCombineInline prop1={{test:"test 1", testNum:14}} propA={{testVar: "test"}} />
            <hr />
            <TestTree tree={{"test": {data: "test data", children: ["test2"]}, "test2": {data: "test data 2", children: [""]}}} />
        </>
    )
}