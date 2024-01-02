import {useGetIsLoggedIn} from "@multiversx/sdk-dapp/hooks";
import Navbar from "../ui/Navbar.tsx";
import "./HomePagev2.css";
import {Footer} from "../ui/Footer.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import businessicon from "icons/business.svg";
import dataicon from "icons/data.svg";
import graphicsdesignicon from "icons/graphics-design.svg";
import lifestyleicon from "icons/lifestyle.svg";
import musicaudioicon from "icons/music-audio.svg";
import onlinemarketingicon from "icons/online-marketing.svg";
import photographyicon from "icons/photography.svg";
import programmingicon from "icons/programming.svg";
import videoanimationicon from "icons/video-animation.svg";
import writingtranslationicon from "icons/writing-translation.svg";
import businesspeopleimage from "images/business-people.jpg";
import {LoadingSpinner} from "../ui/LoadingSpinner.tsx";
import {useState} from "react";

export const HomePagev2 = () => {
    const isLoggedIn = useGetIsLoggedIn();
    const [isContainer1ImgLoaded, setIsContainer1ImgLoaded] = useState(false);
    const [isContainer2ImgLoaded, setIsContainer2ImgLoaded] = useState(false);
    const handleContainer1ImgLoad = () => {
        setIsContainer1ImgLoaded(true);
    }

    const handleContainer2ImgLoad = () => {
        setIsContainer2ImgLoaded(true);
    }

    return(
        <>
            <Navbar isLoggedIn={isLoggedIn} menuList={[{name:"My Projects", url:"/projects"}, {name:"My Agreements", url:"/agreements"}]}/>
            <div className="container-1">
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <img src="https://www.creativefabrica.com/wp-content/uploads/2021/09/13/1631555634/Turn-Ideas-Into-Reality.jpg" style={{display: isContainer1ImgLoaded ? "block" : "none"}} onLoad={handleContainer1ImgLoad} alt="Ideas to Reality"/>
                        <LoadingSpinner style={{display: !isContainer1ImgLoaded ? "grid" : "none"}}/>
                </div>
                <div className="create-project-container">
                    <button className="create-project-button">
                        Create Project
                    </button>
                </div>
            </div>
            <div className="container-2">
                <div>
                    <h2 style={{paddingBottom: 24, lineHeight: "120%", fontSize: 30}}>
                        The best part? Everything.
                    </h2>
                    <h6 style={{fontSize: 20, paddingBottom: 5}}>
                        <FontAwesomeIcon icon={faCircleCheck}
                                         style={{color: "white", fontSize: '24px', paddingRight: '10px'}}/>
                        <span>Stick to your budget</span>
                    </h6>
                    <div style={{color: 'rgba(255,255,255, 0.6', paddingBottom: 15}}>
                        Find the right service for every price point. No hourly rates, just project-based pricing.
                    </div>
                    <h6 style={{fontSize: 20, paddingBottom: 5}}>
                        <FontAwesomeIcon icon={faCircleCheck}
                                         style={{color: "white", fontSize: '24px', paddingRight: '10px'}}/>
                        <span>Get quality work done quickly</span>
                    </h6>
                    <div style={{color: 'rgba(255,255,255, 0.6', paddingBottom: 15}}>
                        Hand your project over to a talented freelancer in minutes, get long-lasting results.
                    </div>
                    <h6 style={{fontSize: 20, paddingBottom: 5}}>
                        <FontAwesomeIcon icon={faCircleCheck}
                                         style={{color: "white", fontSize: '24px', paddingRight: '10px'}}/>
                        <span>Count on 24/7 support</span>
                    </h6>
                    <div style={{color: 'rgba(255,255,255, 0.6', paddingBottom: 15}}>
                        Our round-the-clock support team is available to help anytime, anywhere.
                    </div>
                    <h6 style={{fontSize: 20, paddingBottom: 5}}>
                        <FontAwesomeIcon icon={faCircleCheck}
                                         style={{color: "white", fontSize: '24px', paddingRight: '10px'}}/>
                        <span>Pay when you're happy</span>
                    </h6>
                    <div style={{color: 'rgba(255,255,255, 0.6', paddingBottom: 15}}>
                        Upfront quotes mean no surprises. Payments only get released when you approve.
                    </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <img src={businesspeopleimage} style={{borderRadius: 5, maxWidth: "100%", maxHeight: "100%", display: isContainer2ImgLoaded ? "block" : "none"}} onLoad={handleContainer2ImgLoad} alt="Successful business"/>
                    <LoadingSpinner style={{display: !isContainer2ImgLoaded ? "grid" : "none"}}/>
                </div>
            </div>
            <div className="container-3">
                <h2 style={{paddingBottom: 24, lineHeight: "120%", fontSize: 30}}>
                    You need it, we've got it
                </h2>
                <div className="container-3-grid">
                    <div>
                        <div style={{padding: 0}}>
                            <img src={businessicon} alt="Business Icon" width="48" height="48"/>
                        </div>
                        <div style={{padding: 0, paddingTop: 10}}>Business</div>
                    </div>
                    <div>
                        <div style={{padding: 0}}>
                            <img src={dataicon} alt="Data Icon" width="48" height="48"/>
                        </div>
                        <div style={{padding: 0, paddingTop: 10}}>Data</div>
                    </div>
                    <div>
                        <div style={{padding: 0}}>
                            <img src={graphicsdesignicon} alt="Graphics Design Icon" width="48" height="48"/>
                        </div>
                        <div style={{padding: 0, paddingTop: 10}}>Graphics & Design</div>
                    </div>
                    <div>
                        <div style={{padding: 0}}>
                            <img src={lifestyleicon} alt="Lifestyle Icon" width="48" height="48"/>
                        </div>
                        <div style={{padding: 0, paddingTop: 10}}>Lifestyle</div>
                    </div>
                    <div>
                        <div style={{padding: 0}}>
                            <img src={musicaudioicon} alt="Music Audio Icon" width="48" height="48"/>
                        </div>
                        <div style={{padding: 0, paddingTop: 10}}>Music Audio</div>
                    </div>
                    <div>
                        <div style={{padding: 0}}>
                            <img src={onlinemarketingicon} alt="Online-Marketing Icon" width="48" height="48"/>
                        </div>
                        <div style={{padding: 0, paddingTop: 10}}>Online-Marketing</div>
                    </div>
                    <div>
                        <div style={{padding: 0}}>
                            <img src={photographyicon} alt="Photography Icon" width="48" height="48"/>
                        </div>
                        <div style={{padding: 0, paddingTop: 10}}>Photography</div>
                    </div>
                    <div>
                        <div style={{padding: 0}}>
                            <img src={programmingicon} alt="Programming Icon" width="48" height="48"/>
                        </div>
                        <div style={{padding: 0, paddingTop: 10}}>Programming</div>
                    </div>
                    <div>
                        <div style={{padding: 0}}>
                            <img src={videoanimationicon} alt="Video Animation Icon" width="48" height="48"/>
                        </div>
                        <div style={{padding: 0, paddingTop: 10}}>Video Animation</div>
                    </div>
                    <div>
                        <div style={{padding: 0}}>
                            <img src={writingtranslationicon} alt="Writing Translation Icon" width="48" height="48"/>
                        </div>
                        <div style={{padding: 0, paddingTop: 10}}>Writing Translation</div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
}