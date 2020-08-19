import React, { Component, Suspense } from 'react';
const Header = React.lazy(() => import('./head'))

import {add, minus} from './utils/utils'

interface IProps {
    name: string
}
class App extends Component<IProps, {}>{
    state = {
        aa: false,
    }
    public render() {
        return (
            <div className='App'>Hello Wold{this.props.name}
                {this.state.aa ? <Suspense fallback={<div>正在加载...</div>}><Header /></Suspense> : null}
                <div onClick={() => {
                    this.state.aa = true;
                    this.forceUpdate();
                }}>
                    click -me21122
                </div>
                <div>
                    {add(1,10)}
                </div>
                <div>
                    <input type="text"/>
                </div>
            </div>
        );
    }
}

export default App