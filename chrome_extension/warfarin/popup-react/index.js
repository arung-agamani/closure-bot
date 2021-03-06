/* eslint-disable no-nested-ternary */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Warfarin from './components/warfarin-body';
import Closure from './components/closure/closure-body';
import RecruitmentCalculator from './components/rec-calc/reccalc-body';
import Sidebar from './components/sidebar';
import SidebarButton from './components/sidebar-button';
import './global.css';
import { PanelTypes } from './components/utils';
import store from './store/index';
import { addArticle } from './actions/index';

import GenshinToolsPage from './pages/genshin';
import PRTSPage from './pages/prts.jsx';

window.store = store;
window.addArticle = addArticle;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarToggle: false,
      currentPanel: PanelTypes.GENSHIN,
    };
    this.handleSidebarButtonClicked = this.handleSidebarButtonClicked.bind(
      this
    );
    this.handlePanelPick = this.handlePanelPick.bind(this);
  }

  handleSidebarButtonClicked() {
    this.setState({
      sidebarToggle: !this.state.sidebarToggle,
    });
  }

  handlePanelPick(panelType) {
    this.setState({
      currentPanel: panelType,
      sidebarToggle: !this.state.sidebarToggle,
    });
  }

  componentDidMount() {
    $(document).ready(function () {
      $('body').on('click', 'a', function () {
        chrome.tabs.create({ url: $(this).attr('href') });
        return false;
      });
    });
  }

  render() {
    return (
      <Provider store={store}>
        <SidebarButton
          sidebarButtonClicked={this.handleSidebarButtonClicked}
        ></SidebarButton>
        <Sidebar
          isToggle={this.state.sidebarToggle}
          handlePanelPick={this.handlePanelPick}
        />
        {this.state.currentPanel === PanelTypes.WARFARIN ? (
          <Warfarin></Warfarin>
        ) : this.state.currentPanel === PanelTypes.CLOSURE ? (
          <Closure></Closure>
        ) : this.state.currentPanel === PanelTypes.RECRUITMENTCALC ? (
          <RecruitmentCalculator></RecruitmentCalculator>
        ) : this.state.currentPanel === PanelTypes.GENSHIN ? (
          <GenshinToolsPage />
        ) : this.state.currentPanel === PanelTypes.PRTS ? (
          <PRTSPage />
        ) : null}
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
