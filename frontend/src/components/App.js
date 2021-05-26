import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Header from './Header'
import Home from './Home'
import Signin from './Signin'
import Cart from './Cart'
import Search from './Search'
import Signup from './Signup'
import Orders from './Orders'

import '../css/App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/s/:k' component={Search} />
          <Route path='/Signup' component={Signup} />
          <Route path='/Signin' component={Signin} />
          <Route path='/Cart' component={Cart} />
          <Route path='/Orders' component={Orders} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
