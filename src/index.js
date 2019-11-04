import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import Parabola from "./Parabola";
import Bubble, { updateState } from "./Bubble";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateState: false
      // removeBubble: false
    };
    updateState = updateState.bind(this);
  }
  //this.Bubble = this.Bubble.bind(this);

  render() {
    return (
      <div>
        <Bubble />
        <Parabola />
      </div>
    );
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

export default App;
