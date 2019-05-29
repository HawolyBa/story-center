import React, { Component } from 'react'
import { Squares } from 'react-activity';
import 'react-activity/lib/Squares/Squares.css';
import StoryCard from './StoryCard';
import UserCard from './UserCard';
import CharacterCard from './CharacterCard';
import {  Row } from 'reactstrap'

class Pagination extends Component {

  state = {
    currentPage: 1,
    datasPerPage: this.props.pathname.includes('browse') ? 20: 10
  }

  handleClick = e => {
    document.getElementById(this.state.currentPage).classList = ''
    this.setState({ currentPage: Number(e.target.id) })
    document.getElementById(e.target.id).classList = 'current'
  }

  render() {
    const { data, wait, checked, type } = this.props
    const { currentPage, datasPerPage } = this.state;
    const indexOfLastData = currentPage * datasPerPage;
    const indexOfFirstData = indexOfLastData - datasPerPage;
    const currentDatas = data.slice(indexOfFirstData, indexOfLastData);

    const renderDatas = currentDatas.map(data => {
      return type === 'stories' ?
      <StoryCard key={data.id} checked={checked} story={data} type="archive"/>:
      type === 'users' ?
      <UserCard key={data.id} user={data} />:
      type === 'characters' ?
      <CharacterCard lg="2" md="3" xs="6" key={data.id} character={data} type='archives' />:
      null
    })
    

  // Logic for displaying page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / datasPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map(number => {
    return (
      <li
        key={number}
        className={number === 1 ? 'current': null}
        id={number}
        onClick={this.handleClick}
      >
        {number}
      </li>
    );
  });

    return !wait ?
      data.length >= 1 ?
      <section className={`archive-${type}`}>
        <h3><span className="capitalize">{type}</span> ({data.length})</h3>
        <Row>
          {renderDatas}
        </Row>
        <ul className="pagination flex jc ac frn">
          {renderPageNumbers}
        </ul>
      </section>:
    <p className="empty">No {type} found</p>:
    <Squares/>
  }
}

export default Pagination
