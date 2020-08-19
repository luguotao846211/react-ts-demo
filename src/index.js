import React from 'react'
import ReactDOM from 'react-dom'
import App from 'Src/App'
import './index.less'
if (module && module.hot) {
    module.hot.accept()
}

ReactDOM.render(<App name='123' />, document.querySelector('#root'))