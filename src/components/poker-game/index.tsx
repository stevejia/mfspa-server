import React from "react";
import PokerCard from "./components/poker-card";

import "./index.less";

class PokerGame extends React.Component<any, any> {
  render(): React.ReactNode {
    return (
      <div className="poker-game-wrapper">
        <PokerCard shape={0} number="A"></PokerCard>
        <PokerCard shape={1} number="2"></PokerCard>
        <PokerCard shape={2} number="3"></PokerCard>
        <PokerCard shape={3} number="4"></PokerCard>
      </div>
    );
  }
}

export default PokerGame;
