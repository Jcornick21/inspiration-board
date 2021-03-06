import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import './Board.css';
import Card from './Card';
import NewCardForm from './NewCardForm';
// import CARD_DATA from '../data/card-data.json';

const CARDS_URL = 'https://inspiration-board.herokuapp.com/boards/Jamila_Cornick/cards'
class Board extends Component {
  constructor() {
    super();

    this.state = {
      cards: [],
    };
  }

  componentDidMount() {
    axios.get(CARDS_URL)
    .then((response) => {
      console.log('Success!');

      this.setState({cards: response.data })
      this.props.updateStatusCallback(`Loaded all cards successfully`)

    })
    .catch((error)=>{
      console.log('Error :(');
      this.props.updateStatusCallback(`Error unable to load cards`)

    });
  }


  cardClicked = (index, id) => {

    const updatedCard = this.state.cards;
       updatedCard.splice(index, 1 );
      // updatedCard.pop(deletedCard)
       console.log(updatedCard.splice(index, 1 ));

      this.setState({cards: updatedCard});

    axios.delete(`${CARDS_URL}/${id}`)
    .then((response) => {

      console.log('Success!');


      this.props.updateStatusCallback(`Deleted card ${index} successfully`)

    })
    .catch((error) => {

      console.log(error);

      this.props.updateStatusCallback(`There was an error deleting card ${index}`)

    });

  }


  newCard = (card) => {

    axios.post(CARDS_URL, card)
    .then((response) =>{
      let updatedCards = this.state.cards;
      updatedCards.push(response.data);
      console.log(response.data);
      console.log(card);

      this.setState({cards: updatedCards});

      this.props.updateStatusCallback(`Successfully added card ${card.index}!`)

    })
    .catch((error) =>{
      this.props.updateStatusCallback(`Error adding card ${card.index}!`)
    });
  }



  render() {
    console.log('in render, this is this.state.cards:');
    console.log(this.state.cards);
    const cards = this.state.cards.map((card, index)=>{
      return <Card key={index}
      emoji={card.card.emoji}
      id={card.card.id}
      text={card.card.text}
      index={index}
      cardCallback={this.cardClicked}/>
    })

    return (
      <div className="board">
      {cards}
      <NewCardForm addCardCallback={this.newCard}/>
      </div>
    )
  }

}

Board.propTypes = {
  updateStatusCallback: PropTypes.func.isRequired

};

export default Board;
