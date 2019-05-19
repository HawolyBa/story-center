import React, { Component } from 'react'
import { connect } from 'react-redux'

class Search extends Component {

  state = {}


  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit = e => {
    e.preventDefault()
    
    if (this.state.search) this.props.history.push(`/search/${this.state.search.toLowerCase().split(' ').join('-')}`)
    e.target.search.value = ''
  }

  render() {
    const { cn } = this.props
    return (
      <form className={cn} onSubmit={this.onSubmit}>
        <input onInput={this.onChange} type="search" name="search" aria-label="Search"/>
        <button><i className="fas fa-search"></i></button>
      </form>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.firebase.auth
})


export default connect(mapStateToProps)(Search)
