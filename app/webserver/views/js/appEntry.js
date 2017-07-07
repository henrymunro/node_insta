import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'

import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import store from './appStore'


import { AppStatus } from './appStatus'
import { NewAppRun } from './newAppRun'

injectTapEventPlugin()

const app = document.getElementById('app')
console.log('STORE: ', store)
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(<Provider store={store}>
  <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
    <Router history={history}>
      <Route path='/' component={AppStatus} />
    </Router>
  </MuiThemeProvider>
</Provider>, app)
      // <Route path='/' component={NewAppRun} />
