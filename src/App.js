import React, { Component } from 'react';
import './App.css';

const API_PATH = 'http://localhost:8000';

function bootstrap() {
  return fetch(`${API_PATH}/users/current_user`, {'credentials' : 'include'})
  .then(res =>
    res.json().then(json => [res, json])
  ).then(
    ([res, json]) => {
      if (res.ok) {
        return json;
      } else {
        return Promise.reject({status: res.status, ...json});
      }
    }
  );
}
function signup(data) {
  return fetch(`${API_PATH}/session/signup`, {
    credentials : 'include',
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(data),
  })
  .then(res =>
    res.json().then(json => [res, json])
  ).then(
    ([res, json]) => {
      if (res.ok) {
        return json;
      } else {
        return Promise.reject({status: res.status, ...json});
      }
    }
  );
}

function signin(data) {
  return fetch(`${API_PATH}/session/signin`, {
    credentials : 'include',
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(data),
  })
  .then(res =>
    res.json().then(json => [res, json])
  ).then(
    ([res, json]) => {
      if (res.ok) {
        return json;
      } else {
        return Promise.reject({status: res.status, ...json});
      }
    }
  );
}

function signout() {
  return fetch(`${API_PATH}/session/signout`, {
    credentials : 'include',
    method: 'POST',
    headers: {'content-type': 'application/json'},
  })
  .then(res =>
    res.json().then(json => [res, json])
  ).then(
    ([res, json]) => {
      if (res.ok) {
        return json;
      } else {
        return Promise.reject({status: res.status, ...json});
      }
    }
  );
}

const LOADING = 'loading';
const LOGGED_IN = 'logged-in';
const NEEDS_AUTH = 'needs-auth';

class App extends Component {
  state = {
    status: LOADING,
    currentUser: null,
  }

  componentDidMount() {
    bootstrap().then(
      ({currentUser}) => {
        this.setState({status: LOGGED_IN, currentUser});
      },
      (x) => {
        this.setState({status: NEEDS_AUTH});
      }
    )
  }

  _onSignup = (e) => {
    e.preventDefault();
    const data = {email: this._emailRefSignup.value, password: this._passwordRefSignup.value}
    signup(data).then(
      ({currentUser}) => {
        this.setState({status: LOGGED_IN, currentUser});
      },
      () => {
       /* TODO Signup errors? */
      }
    )
  }

  _onSignin = (e) => {
    e.preventDefault();
    const data = {email: this._emailRefSignin.value, password: this._passwordRefSignin.value}
    console.log(data)
    signin(data).then(
      ({currentUser}) => {
        this.setState({status: LOGGED_IN, currentUser});
      },
      () => {
       /* TODO Handle sign-in errors */
      }
    )
  }

  _onSignout = () => {
    signout().then(
      () => {
        this.setState({status: NEEDS_AUTH, currentUser: null});
      },
    );
  }

  _renderChildren() {
    const {status, currentUser} = this.state;
    console.log(currentUser)
    switch (status) {
      case LOADING:
        return <div>Loading</div>;
      case NEEDS_AUTH:
        return <div>
          Sign up:
          <form
            onSubmit={this._onSignup}
            >
            <input
              type="email"
              ref={x => this._emailRefSignup = x}
            />
            <input
              type="password"
              ref={x => this._passwordRefSignup = x}
            />
            <button>Sign up</button>
          </form>
          <br />
          Sign in:
          <form
            onSubmit={this._onSignin}
            >
            <input
              type="email"
              ref={x => this._emailRefSignin = x}
            />
            <input
              type="password"
              ref={x => this._passwordRefSignin = x}
            />
            <button>Sign in</button>
          </form>
        </div>
      case LOGGED_IN:
        return <div>Hey there {currentUser.email}
        <br />
        <button onClick={this._onSignout}>Sign out</button>
        </div>
      default:
        return <div>Shouldn't get here!</div>
    }
  }

  render() {
    return (
      <div className="App">
       {
        this._renderChildren()
       }
      </div>
    );
  }

}

export default App;
