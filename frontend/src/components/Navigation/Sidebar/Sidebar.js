import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Cancel } from '../../../assets/icons/Cancel.svg';
import { ReactComponent as Cart } from '../../../assets/icons/Cart.svg';
import { ReactComponent as List } from '../../../assets/icons/List.svg';
import { ReactComponent as Person } from '../../../assets/icons/Person.svg';
import { ReactComponent as Reservation } from '../../../assets/icons/Reservation.svg';
import { ReactComponent as Settings } from '../../../assets/icons/Settings.svg';
import { ReactComponent as Logout } from '../../../assets/icons/Logout.svg';
import { ReactComponent as Kit } from '../../../assets/icons/Kit.svg';
import { ReactComponent as AddItem } from '../../../assets/icons/Add.svg';
import { ReactComponent as CheckIn } from '../../../assets/icons/CheckIn.svg';
import { ReactComponent as Report } from '../../../assets/icons/Report.svg';
import { getRole } from '../../../utils/User.profile';
import './sidebar.css';

class Sidebar extends Component {

    render() {
        return (
            <div className={`navigation-list${this.props.navOpen ? '' : '-hidden'}`}>
                <div className='close-navigation' onClick={this.props.hideNavigation}><Cancel className='navigation-close-icon' /></div>
                { this.renderNavigationForRole().map((route, index) => {
                    return <Link to={route.link} className="navigation-list-item" key={index}>
                        {route.icon}
                        <p className={this.props.currPage == route.text ? 'navigation-list-item-title-active' : 'navigation-list-item-title'}>{route.text}</p>
                    </Link>
                })}
                <Link to="/logout" className='navigation-list-item bottom'>
                    <Logout className='navigation-list-item-icon' />
                    <p className='navigation-list-item-title'>Logout</p>
                </Link>
                <Link to="/settings" className='navigation-list-item'>
                    <Settings className='navigation-list-item-icon' />
                    <p className='navigation-list-item-title'>Settings</p>
                </Link>
            </div>
        );
    }

    // choose navigation type
    renderNavigationForRole() {
        const role = getRole();

        if (parseInt(role) === 2) { // staff
            return [
                {link: '/dashboard', icon: <Person className='navigation-list-item-icon' />, text: 'Dashboard'},
                {link: '/inventory', icon: <List className='navigation-list-item-icon' />, text: 'Inventory'},
                {link: '/newItem', icon: <AddItem className='navigation-list-item-icon' />, text: 'Add Item'},
                {link: '/kit', icon: <Kit className='navigation-list-item-icon-stroke' />, text: 'Create Kit'},
                {link: '/checkin', icon: <CheckIn className='navigation-list-item-icon' />, text: 'Check In/Out'},
                {link: '/report', icon: <Report className='navigation-list-item-icon-stroke' />, text: 'Generate Report'}
            ];
        } else if (parseInt(role) === 1) { // student
            return [
                {link: '/reservations', icon: <Reservation className='navigation-list-item-icon' />, text: 'Reservations'},
                {link: '/inventory', icon: <List className='navigation-list-item-icon' />, text: 'Inventory'},
                {link: '/cart', icon: <Cart className='navigation-list-item-icon' />, text: 'My Cart'},
            ];
        } else if (parseInt(role) === 3) { // professor
            return [
                {link: '/reservations', icon: <Reservation className='navigation-list-item-icon' />, text: 'Reservations'},
                {link: '/inventory', icon: <List className='navigation-list-item-icon' />, text: 'Inventory'},
                {link: '/cart', icon: <Cart className='navigation-list-item-icon' />, text: 'My Cart'},
                {link: '/kit', icon: <Kit className='navigation-list-item-icon-stroke' />, text: 'Create Kit'}
            ];
        } else {
            return [];
        }
    }

}

export default Sidebar;