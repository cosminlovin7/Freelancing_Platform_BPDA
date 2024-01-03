import {Component} from 'react';
import "./Navbar.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import {BalanceSection} from "../HomePage/components/BalanceSection.tsx";

export type NavbarMenuItem = {
    name: string,
    onClickFunction?: () => void
}

interface NavbarProps {
    menuList?: NavbarMenuItem[],
    isLoggedIn: boolean,
    onClickLogin?: () => void,
    onClickLogout?: () => void,
    userRole?: string
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
                    <img src="https://icon-library.com/images/freelancer-icon/freelancer-icon-17.jpg" alt="Logo"
                         width="64"
                         height="64"/>
                </a>
                {
                    this.props.isLoggedIn && (
                        <div className="user-info">
                            <div style={{color: "white"}}><BalanceSection/></div>
                            <div style={{color: "white"}}>Role: {this.props.userRole? this.props.userRole : ''}</div>
                        </div>
                    )
                }
                <div>
                    <ul id="navbar" className={this.state.clicked ? "#navbar active" : "#navbar"}>
                        {this.props.menuList?.map((menuItem, index) => {
                            return <li key={index} onClick={menuItem.onClickFunction}><a>{menuItem.name}</a></li>
                        })}
                        {
                            this.props.isLoggedIn ? (
                                <li onClick={this.props.onClickLogout ? this.props.onClickLogout : () => {
                                    console.warn('logout function not specified')
                                }}><a>Logout</a></li>
                            ) : (
                                <li onClick={this.props.onClickLogin ? this.props.onClickLogin : () => {
                                    console.warn('login function not specified')
                                }}><a>Login</a></li>
                            )
                        }
                    </ul>
                </div>

                <div id="mobile" onClick={this.handleMenuButtonClick}>
                    {
                        this.state.clicked ? (
                            <FontAwesomeIcon icon={faXmark}
                                             style={{color: 'white', fontSize: '24px', cursor: 'pointer'}}/>
                        ) : (
                            <FontAwesomeIcon icon={faBars}
                                             style={{color: 'white', fontSize: '24px', cursor: 'pointer'}}/>
                        )
                    }
                </div>
            </nav>
        );
    }
}

export default Navbar;