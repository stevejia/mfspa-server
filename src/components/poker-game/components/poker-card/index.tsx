import React from "react";

import "./index.less";
interface PokerCardProps {
  //TODO::
  number: string;
  shape: number;
  big?: boolean;
}

export enum Shape {
  SPADE = 0,
  HEART,
  CLUB,
  DIAMOND,
}

const NumberMap = {
  A: 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
  JOKER: 14,
};

const shapeClasses = [
  "poker-spade",
  "poker-heart",
  "poker-club",
  "poker-diamond",
];

class PokerCard extends React.Component<PokerCardProps, any> {
  private renderPokerContent(shapeCls: string, numberCls: string) {
    const { number } = this.props;
    const numberIndex = NumberMap[number];
    let a = [];
    for (let i = 0; i < numberIndex; i++) {
      a.push(
        <div key={`number_${i}`} className={`poker-shape ${shapeCls}`}></div>
      );
    }
    return <div className={`poker-card-content ${numberCls}`}>{a}</div>;
  }

  render(): React.ReactNode {
    const { number, shape } = this.props;
    // const number = "A";

    const shapeClass = shapeClasses[shape];
    const numberCls = `poker-${number.toLocaleLowerCase()}`;
    return (
      <div className={`poker-card ${numberCls}`}>
        <div className="poker-card-corner">
          <span className="poker-number">{number}</span>
          <div className={`poker-shape ${shapeClass}`}></div>
        </div>
        <div className="poker-card-corner reverse">
          <span className="poker-number">{number}</span>
          <div className={`poker-shape ${shapeClass}`}></div>
        </div>
        {this.renderPokerContent(shapeClass, numberCls)}
      </div>
    );
  }
}

export default PokerCard;
