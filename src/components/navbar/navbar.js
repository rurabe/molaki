import React from 'react';
import {Link} from 'react-router-dom';
// import styles from './dashboards_index.sass';

class Navbar extends React.PureComponent {
  render(){
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <Link to="/" className="navbar-brand" href="#">Molaki</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav mr-auto">
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;