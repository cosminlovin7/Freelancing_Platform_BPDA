import {Component} from 'react';
import "./Navbar.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

export type NavbarMenuItem = {
    name: string,
    url: string
}

interface NavbarProps {
    menuList?: NavbarMenuItem[],
    isLoggedIn: boolean
}

class Navbar extends Component<NavbarProps> {
    constructor(props: NavbarProps) {
        super(props);

    }

    state = {
        clicked: false
    };

    handleMenuButtonClick = () => {
        this.setState({clicked: !this.state.clicked});
    }

    render() {
        return (
            <nav>
                <a href="/">
                    <img src="https://icon-library.com/images/freelancer-icon/freelancer-icon-17.jpg" alt="Logo" width="64"
                         height="64"/>
                </a>
                <div>
                    <ul id="navbar" className={this.state.clicked ? "#navbar active" : "#navbar"}>
                        <li><a href="/">Home</a></li>
                        {this.props.menuList?.map((menuItem, index) => {
                            return <li key={index}><a href={menuItem.url}>{menuItem.name}</a></li>
                        })}
                        {
                            this.props.isLoggedIn ? (
                                <li><a href="/logout">Logout</a></li>
                            ) : (
                                <li><a href="/unlock">Login</a></li>
                            )
                        }
                    </ul>
                </div>

                <div id="mobile" onClick = {this.handleMenuButtonClick}>
                    {
                        this.state.clicked ? (
                            <FontAwesomeIcon icon={faXmark} style={{ color: 'white', fontSize: '24px', cursor: 'pointer'}}/>
                        ) : (
                            <FontAwesomeIcon icon={faBars} style={{ color: 'white', fontSize: '24px', cursor: 'pointer'}}/>
                        )
                    }
                </div>
            </nav>
        );
    }
}

export default Navbar;