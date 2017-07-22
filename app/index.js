var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/app');
require('./index.css');
require('bootstrap/dist/css/bootstrap.css');
import{ ApolloProvider, ApolloClient, createNetworkInterface } from 'react-apollo';
var Router = require('react-router-dom').BrowserRouter;
var Route = require('react-router-dom').Route;
var Switch = require('react-router-dom').Switch;

var networkInterface = createNetworkInterface({
    uri: 'https://api.graph.cool/simple/v1/cj5ekl4uah6qy0127u1sa0ixh'
});

var client = new ApolloClient({
    networkInterface
});

ReactDOM.render(
    <Router>
        <ApolloProvider client={client}>
        <Switch>
            <Route exact path="/" component={App} />
            <Route render={function() {
                return <div>Page Not Found</div>
            }} />
        </Switch>
        </ApolloProvider>
    </Router>,
    document.getElementById('app')
);
