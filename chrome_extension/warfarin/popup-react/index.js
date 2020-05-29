import React from 'react';
import ReactDOM from 'react-dom';
import Background from './components/bg-screen';
import './global.css';

class App extends React.Component {
    render() {
        return(
            <div className="container">
                <Background></Background>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));