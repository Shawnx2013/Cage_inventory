import React, { Component } from 'react';
import NavigationBar from './Bar/Navigation-Bar';
import Sidebar from './Sidebar/Sidebar';
import './navigation.css';

class Navigation extends Component {

    constructor() {
        super();

        // state variables
        this.state = {
            navOpen: false
        };

        // binding
        this.showNavigation = this.showNavigation.bind(this);
        this.hideNavigation = this.hideNavigation.bind(this);
    }

    render() {
        return (
            <div className='navigation'>
                <NavigationBar currPage={this.props.currPage} showNavigation={this.showNavigation} />
                <Sidebar currPage={this.props.currPage} navOpen={this.state.navOpen} hideNavigation={this.hideNavigation} />
            </div>
        )
    }

    // methods to change state of navopen
    showNavigation() {
        this.setState( { navOpen: true } );
    }

    hideNavigation() {
        this.setState( { navOpen: false } );
    }

}

export default Navigation;