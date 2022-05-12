import React, { Component } from 'react';
import { ReactComponent as Hamburger } from '../../../assets/icons/Hamburger.svg';
import './navigation-bar.css';
import { getUsername } from '../../../utils/User.profile';

class NavigationBar extends Component {

    render() {
        return (
            <div className='navigation'>
                <div className='navigation-bar'>
                    <div className='open-navigation' onClick={this.props.showNavigation}><Hamburger className='navigation-hamburger-icon' /></div>
                    <h5 className='navigation-bar-item'>{this.props.currPage}</h5>
                    {/* <Link to="/settings" className='navigation-bar-item'>
                        <Settings className="navigation-settings-icon" />
                    </Link> */}
                    { this.renderUsername() }
                </div>
            </div>
        );
    }

    renderUsername() {
        return <p className='navigation-bar-item'>{ getUsername() }</p>
    }

}

export default NavigationBar;