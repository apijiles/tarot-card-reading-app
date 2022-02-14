import { useState } from "react";

// styling global & Charka UI
import "./App.css";
import "rsuite/styles/index.less";

// The Tarot Deck Data
import TarotDeckData from "./TarotDeckData";
import { Select } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";

export interface ReadingCardProps {
  firstName: string;
  emailAddress: string;
}

type SpreadDisplayProps = [
  {
    id: number;
    name: string;
    meaning: string;
    uprightPoints: string;
    reversePoints: string;
    image: string;
    isReversed?: boolean;
  },
  boolean
][];

type CardProps = {
  id: number;
  name: string;
  meaning: string;
  uprightPoints: string;
  reversePoints: string;
  image: string;
  isReversed?: boolean;
};

function App() {
  //The Original Tarot Deck with all 78 cards
  let deck = new Array(78).fill(1).map((_, i) => TarotDeckData[i]);

  // all state of the component
  // the state of your current readings deck
  let [currentDeck, setCurrentDeck] = useState(deck);

  // Tarot cards displayed to the screen
  let [readingCards, setReadingCards] = useState<SpreadDisplayProps>([]);

  // sets card spread type & number
  let [spreadInput, setSpreadInput] = useState("1");

  // Switches betwen choosing a spread and showing the spread
  let [startReading, setStartReading] = useState(true);

  // array of current reading cards and its reversed boolean values
  let cardAndBooleanArray: SpreadDisplayProps = []; // horrible name

  // generates the cards of the reading
  let getSpread = () => {
    // random # generator
    const getRandomNumber = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // boolean generator
    const getBooleanValue = (): boolean => {
      const bval = Math.floor(Math.random() * 2);
      if (bval == 0) {
        return false;
      } else {
        return true;
      }
    };

    // loops through the deck & select the correct # of random cards based on spread input
    for (let i = 0; i < parseInt(spreadInput); i++) {
      //selects cards from deck
      let randomlySelectedCard: CardProps =
        currentDeck[getRandomNumber(1, currentDeck.length)];

      // generates a boolean value
      let isCardReversed: boolean = getBooleanValue();

      // filtering selected card from deck
      setCurrentDeck(
        currentDeck.filter((x) => {
          return x !== randomlySelectedCard;
        })
      );
      // adding selected card to the reading cards array
      cardAndBooleanArray.push([randomlySelectedCard, isCardReversed]);
    }
    setStartReading(false);
    setReadingCards(cardAndBooleanArray);
  };

  // set the spread input for the reading
  let spredInputChange = function (event: any) {
    setSpreadInput(event.target.value);
  };
  // starts a new reading by resetting the deck & shows the 'Pick A Spread' View
  let startNewReading = function () {
    setCurrentDeck(deck);
    setStartReading(true);
  };

  return (
    <div>
      {startReading ? (
        <div className="home-div">
          <Heading className="pick-heading">Pick A Card Spread:</Heading>
          <form>
            <Select
              value={spreadInput}
              onChange={spredInputChange}
              name="drop1"
              id="Select1"
            >
              <option value="1">Single Card Spread</option>
              <option value="3">Past, Present, Future Card Spread</option>
              <option value="5">Five Card Spread</option>
            </Select>
          </form>
          <div>
            <Button
              className="spread-btn"
              size="lg"
              colorScheme="blue"
              onClick={getSpread}
            >
              Get Your Reading
            </Button>
          </div>
        </div>
      ) : (
        <div className="m-9">
          <div className="reading-header">
            <div>
              <Button className="btn" type="button" onClick={startNewReading}>
                START A NEW READING
              </Button>
            </div>
            <div>
              <Heading>YOUR READING</Heading>
            </div>
          </div>
          <div className="flex flex-row">
            <div>
              {readingCards.map((card) => {
                console.log(card);
                return (
                  <div className="card-container" key={card[0].name}>
                    <div className="card-img-container">
                      {card[1] ? (
                        <img
                          className="card-img"
                          src={card[0].image}
                          alt="rj"
                        />
                      ) : (
                        <img
                          className="card-img-reversed"
                          src={card[0].image}
                          alt="rj"
                        />
                      )}
                    </div>
                    <div className="card-sub-container">
                      <h1 className="card-name">{card[0].name}</h1>
                      <h3>
                        {" "}
                        <span>Upright Points: </span>
                        {card[0].uprightPoints}
                      </h3>
                      <h3>
                        <span>Reverse Points: </span>
                        {card[0].reversePoints}
                      </h3>
                      <p className="card-meaning">{card[0].meaning}</p>
                    </div>
                    <div></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
