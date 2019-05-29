import React from 'react';
import TopBarProgress from "react-topbar-progress-indicator";
import { connect } from 'react-redux';


TopBarProgress.config({
  barColors: {
    "0": "#65c3a1",
    "0.5": "#27bab0",
    "1.0": "#16889f",
  },
  shadowBlur: 0,
  barThickness: 2
});


export class Loading extends React.Component {

  render() {

    const { progressBarStatus } = this.props;
    if (progressBarStatus === 'OPEN') {
      return (<TopBarProgress />)
    } else {
      return ('');
    }
  }
}

//redux container component
const mapStateToProps = state => ({
  progressBarStatus: state.UI.progressBarStatus
})

export const HandleProgressBar = connect(mapStateToProps, null)(Loading);

export default HandleProgressBar;