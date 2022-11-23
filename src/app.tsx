import { Layout } from "antd";
import React from "react";
import PokerGame from "./components/poker-game";
class App extends React.Component {
  render() {
    return (
      // <MfspaLayout>
      //   <div id="mfspa-root" className="mfspa-content"></div>
      // </MfspaLayout>
      <PokerGame></PokerGame>
    );
  }
}

export default App;
