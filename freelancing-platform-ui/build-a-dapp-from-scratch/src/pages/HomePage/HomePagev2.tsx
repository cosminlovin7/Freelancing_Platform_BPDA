import {useGetAccountInfo, useGetIsLoggedIn} from "@multiversx/sdk-dapp/hooks";
import Navbar, {NavbarMenuItem} from "../ui/Navbar.tsx";
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
import {ChangeEvent, useEffect, useState} from "react";
import _TextArea from "../ui/_TextArea.tsx";
import {_useCreateProject} from "../../hooks/transactions/_useCreateProject.ts";
import { toast } from 'react-toastify';
import {ProxyNetworkProvider} from "@multiversx/sdk-network-providers/out";
import {API_URL} from "../../config";
import {_SmartContract} from "../../utils/_SmartContract.ts";
import {_ProjectDtoType} from "../../types/_ProjectDtoType.ts";
import {_ResponseProjectDtoType} from "../../types/_ResponseProjectDtoType.ts";
import {ResultsParser} from "@multiversx/sdk-core/out";
import {logout} from "@multiversx/sdk-dapp/utils";
import {useNavigate} from "react-router-dom";
import {_UserRoleType} from "../../types/_UserRoleType.ts";
import {_ResponseUserRoleType} from "../../types/_ResponseUserRoleType.ts";
import {_useAssignUserRole} from "../../hooks/transactions/_useAssignUserRole.ts";
import {_AgreementDtoType} from "../../types/_AgreementDtoType.ts";
import {_ResponseAgreementDtoType} from "../../types/_ResponseAgreementDtoType.ts";
import _InputField from "../ui/_InputField.tsx";
import {_useCreateAgreement} from "../../hooks/transactions/_useCreateAgreement.ts";
import {_useAcceptAgreement} from "../../hooks/transactions/_useAcceptAgreement.ts";

export const HomePagev2 = () => {
    const isLoggedIn = useGetIsLoggedIn();
    const [userRole, setUserRole] = useState<_UserRoleType | undefined | null>(null);
    const navigate = useNavigate();
    const {account} = useGetAccountInfo();
    const [isContainer1ImgLoaded, setIsContainer1ImgLoaded] = useState(false);
    const [isContainer2ImgLoaded, setIsContainer2ImgLoaded] = useState(false);
    const [optionProjectName, setOptionProjectName] = useState("");
    const [optionProjectDescription, setOptionProjectDescription] = useState("");
    const [hideCreateProjectSection, setHideCreateProjectSection] = useState(true);
    const [hideMyProjectsSection, setHideMyProjectsSection] = useState(true);
    const [hidePendingProjectsSection, setPendingProjectsSection] = useState(true);
    const {onCreateProject} = _useCreateProject();
    const {onAssignUserRole} = _useAssignUserRole();
    const {onCreateAgreement} = _useCreateAgreement();
    const {onAcceptAgreement} = _useAcceptAgreement();

    const [isMyProjectsSectionLoading, setIsMyProjectsSectionLoading] = useState(true);
    const [isPendingProjectsSectionLoading, setIsPendingProjectsSectionLoading] = useState(true);
    const [userProjectsList, setUserProjectsList] = useState<_ProjectDtoType[] | null | undefined>(null);
    const [pendingProjectsList, setPendingProjectsList] = useState<_ProjectDtoType[] | null | undefined>(null);
    const [userProjectsAgreementsSection, setUserProjectsAgreementsSection] = useState<Map<number, boolean>>(new Map());
    const [userProjectsAgreementsMap, setUserProjectsAgreementsMap] = useState<Map<number, _AgreementDtoType[] | null | undefined>>(new Map());
    const [userRoleSelection, setUserRoleSelection] = useState(0);
    const [userPendingProjectAgreementsSection, setUserPendingProjectAgreementsSection] = useState<Map<number, boolean>>(new Map());
    const [agreementOfferedValue, setAgreementOfferedValue] = useState<Map<number, number>>(new Map());

    useEffect(() => {
        if (null != userProjectsList) {
            console.log('projects loaded');
            setIsMyProjectsSectionLoading(false);
        }
    }, [userProjectsList])

    useEffect(() => {
        if (null != pendingProjectsList) {
            console.log('pending projects loaded');
            setIsPendingProjectsSectionLoading(false);
        }
    }, [pendingProjectsList])

    useEffect(() => {
        console.log('useEffect started');
        const networkProvider = new ProxyNetworkProvider(API_URL);
        const interaction = _SmartContract.methods.getUserRole([account.address]);
        const query = interaction.buildQuery();

        const queryResult = networkProvider.queryContract(query);

        queryResult.then((response) => {
            const {firstValue: userRoleResult} = new ResultsParser().parseQueryResponse(response, interaction.getEndpoint());

            if (userRoleResult) {
                const userRoleStatusDeserialized: _UserRoleType = (function(_userRole: _ResponseUserRoleType) {
                    const _discriminant = (function() {
                        switch(_userRole.name) {
                            case "Visitor":
                                return 0;
                            case "Freelancer":
                                return 1;
                            case "Client":
                                return 2;
                            default:
                                return -1;
                        }
                    })();

                    return {
                        discriminant: _discriminant,
                        name: _userRole.name
                    }
                })(userRoleResult.valueOf());

                // return userRoleStatusDeserialized;
                console.log(userRoleStatusDeserialized);
                setUserRole(userRoleStatusDeserialized);
            }
        }).catch((e) => console.warn(e));
    }, [account])

    const handleContainer1ImgLoad = () => {
        setIsContainer1ImgLoaded(true);
    }

    const handleContainer2ImgLoad = () => {
        setIsContainer2ImgLoaded(true);
    }

    const handleOptionProjectNameChange = (event:ChangeEvent<HTMLTextAreaElement>) => {
        setOptionProjectName(event.target.value);
    }

    const handleOptionProjectDescriptionChange = (event:ChangeEvent<HTMLTextAreaElement>) => {
        setOptionProjectDescription(event.target.value);
    }

    const handleCreateProjectButtonOnClick = () => {
        setHideCreateProjectSection(!hideCreateProjectSection);
    }

    const handleCreateProjectWithTransactionButtonOnClick = () => {
        if (optionProjectName.length > 50) {
            toast.error("Project name is too big");
            return;
        }
        if (optionProjectDescription.length > 50) {
            toast.error("Project description is too big");
            return;
        }

        onCreateProject(optionProjectName, optionProjectDescription).then(() => {
            setOptionProjectName("");
            setOptionProjectDescription("");
        }).catch(() => {
            console.warn("An error occurred while creating project...");
        })
    }

    const handleHomeButtonOnClick = () => {
        console.log("function clicked");
        setHideMyProjectsSection(!hideMyProjectsSection);
    }

    const handleMyProjectsButtonOnClick = () => {
        if (false == !hideMyProjectsSection) {
            const networkProvider = new ProxyNetworkProvider(API_URL);
            const interaction = _SmartContract.methods.getUserProjects([account.address]);
            const query = interaction.buildQuery();
            networkProvider
                .queryContract(query)
                .then((response) => {
                    const {firstValue: userProjectsList} = new ResultsParser().parseQueryResponse(response, interaction.getEndpoint());
                    if (userProjectsList) {
                        const userProjectsListDeserialized: _ProjectDtoType[] = (function(_userProjectsList: _ResponseProjectDtoType[]) {
                            const _userProjectsListDeserialized: _ProjectDtoType[] = [];

                            console.log(_userProjectsList);

                            _userProjectsList.map((userProject: _ResponseProjectDtoType) => {
                                const _discriminant = (function() {
                                    switch(userProject.project_status.name) {
                                        case "PendingAgreement":
                                            return 0;
                                        case "InProgress":
                                            return 1;
                                        case "Completed":
                                            return 2;
                                        case "Aborted":
                                            return 3;
                                        default:
                                            return -1;
                                    }
                                })();

                                _userProjectsListDeserialized.push({
                                    project_id: userProject.project_id.valueOf(),
                                    project_name: (function(hexString: string) {
                                        const hexArray = hexString.match(/.{1,2}/g) || [];
                                        const byteValues = hexArray.map(hex => parseInt(hex, 16));
                                        return String.fromCharCode(...byteValues);
                                    })(userProject.project_name.toString()),
                                    project_description: (function(hexString: string) {
                                        const hexArray = hexString.match(/.{1,2}/g) || [];
                                        const byteValues = hexArray.map(hex => parseInt(hex, 16));
                                        return String.fromCharCode(...byteValues);
                                    })(userProject.project_description.toString()),
                                    owner_address: userProject.owner_address,
                                    project_status: {
                                        discriminant: _discriminant,
                                        name: userProject.project_status.name
                                    }
                                })
                            });

                            return _userProjectsListDeserialized;
                        })(userProjectsList.valueOf());

                        setUserProjectsList(userProjectsListDeserialized);
                        setHideMyProjectsSection(!hideMyProjectsSection);
                    }
                })
                .catch((e) => console.warn(e));
        } else {
            setHideMyProjectsSection(!hideMyProjectsSection);
            setIsMyProjectsSectionLoading(true);
        }
    }

    const handlePendingProjectsButtonOnClick = () => {
        if (false == !hidePendingProjectsSection) {
            const networkProvider = new ProxyNetworkProvider(API_URL);
            const interaction = _SmartContract.methods.getPendingProjects([account.address]);
            const query = interaction.buildQuery();
            networkProvider
                .queryContract(query)
                .then((response) => {
                    const {firstValue: pendingProjectsList} = new ResultsParser().parseQueryResponse(response, interaction.getEndpoint());
                    if (pendingProjectsList) {
                        const pendingProjectsListDeserialized: _ProjectDtoType[] = (function(_pendingProjectsList: _ResponseProjectDtoType[]) {
                            const _pendingProjectsListDeserialized: _ProjectDtoType[] = [];

                            _pendingProjectsList.map((pendingProject: _ResponseProjectDtoType) => {
                                const _discriminant = (function() {
                                    switch(pendingProject.project_status.name) {
                                        case "PendingAgreement":
                                            return 0;
                                        case "InProgress":
                                            return 1;
                                        case "Completed":
                                            return 2;
                                        case "Aborted":
                                            return 3;
                                        default:
                                            return -1;
                                    }
                                })();

                                _pendingProjectsListDeserialized.push({
                                    project_id: pendingProject.project_id.valueOf(),
                                    project_name: (function(hexString: string) {
                                        const hexArray = hexString.match(/.{1,2}/g) || [];
                                        const byteValues = hexArray.map(hex => parseInt(hex, 16));
                                        return String.fromCharCode(...byteValues);
                                    })(pendingProject.project_name.toString()),
                                    project_description: (function(hexString: string) {
                                        const hexArray = hexString.match(/.{1,2}/g) || [];
                                        const byteValues = hexArray.map(hex => parseInt(hex, 16));
                                        return String.fromCharCode(...byteValues);
                                    })(pendingProject.project_description.toString()),
                                    owner_address: pendingProject.owner_address,
                                    project_status: {
                                        discriminant: _discriminant,
                                        name: pendingProject.project_status.name
                                    }
                                })
                            });

                            return _pendingProjectsListDeserialized;
                        })(pendingProjectsList.valueOf());

                        setPendingProjectsList(pendingProjectsListDeserialized);
                        setPendingProjectsSection(!hidePendingProjectsSection);
                    }
                })
                .catch((e) => console.warn(e));
        } else {
            setPendingProjectsSection(!hidePendingProjectsSection);
            setIsPendingProjectsSectionLoading(true);
        }
    }

    const handleSeeProjectAgreements = (index: number) => {
        console.log('SeeProjectAgrements button pressed ' + index);
        console.log(userProjectsAgreementsSection);

        const newMap = new Map(userProjectsAgreementsSection);
        if (newMap.has(index)) {
            const oldValue = newMap.get(index);
            newMap.set(index, !oldValue);
        } else {
            newMap.set(index, true);
        }

        if (newMap.get(index) == true && userProjectsList) {
            const networkProvider = new ProxyNetworkProvider(API_URL);
            const interaction = _SmartContract.methods.getProjectAgreements([userProjectsList[index].project_id, account.address]);
            const query = interaction.buildQuery();

            const queryResponse = networkProvider.queryContract(query);

            queryResponse.then((response) => {
                const {firstValue: projectAgreementsList} = new ResultsParser().parseQueryResponse(response, interaction.getEndpoint());

                if (projectAgreementsList) {
                    const projectAgreementsListDeserialized: _AgreementDtoType[] = (function(_projectAgreementsList: _ResponseAgreementDtoType[]) {
                        const _projectAgreementsListDeserialized: _AgreementDtoType[] = [];

                        _projectAgreementsList.map((projectAgreement: _ResponseAgreementDtoType) => {
                            const _discriminant = (function() {
                                switch(projectAgreement.status.name) {
                                    case "Proposal":
                                        return 0;
                                    case "InProgress":
                                        return 1;
                                    case "Declined":
                                        return 2;
                                    case "Completed":
                                        return 3;
                                    case "Aborted":
                                        return 4;
                                    default:
                                        return -1;
                                }
                            })();

                            _projectAgreementsListDeserialized.push({
                                agreement_id: projectAgreement.agreement_id.valueOf(),
                                deadline: projectAgreement.deadline.valueOf(),
                                employee_address: projectAgreement.employee_address,
                                employer_address: projectAgreement.employer_address,
                                project_id: projectAgreement.project_id.valueOf(),
                                value: projectAgreement.value.valueOf(),
                                status: {
                                    discriminant: _discriminant,
                                    name: projectAgreement.status.name
                                }
                            })
                        });

                        return _projectAgreementsListDeserialized;
                    })(projectAgreementsList.valueOf());

                    console.log(projectAgreementsListDeserialized);

                    const newProjectsAgreementsMap = new Map(userProjectsAgreementsMap);
                    newProjectsAgreementsMap.set(index, projectAgreementsListDeserialized);

                    setUserProjectsAgreementsMap(newProjectsAgreementsMap);
                }
            }).catch((e) => console.warn(e));
        }

        setUserProjectsAgreementsSection(newMap);
    }

    const navbarMenu: () => NavbarMenuItem[] = () => {
        const menu: NavbarMenuItem[] = [];

        menu.push({name:"Home", onClickFunction:handleHomeButtonOnClick});
        if (userRole) {
            switch(userRole.discriminant) {
                case 0:
                    break;
                case 1: //Freelancer
                    menu.push({name:"My Freelancer Agreements"});
                    menu.push({name:"Pending Projects", onClickFunction:handlePendingProjectsButtonOnClick});
                    break;
                case 2: //Client
                    menu.push({name:"My Client Agreements"});
                    menu.push({name:"My Projects", onClickFunction:handleMyProjectsButtonOnClick});
                    break;
                default:
                    break;
            }
        }

        return menu;
    }

    const handleUserRoleInputButtonOnClick = (userRoleIndex: number) => {
        if (userRoleSelection == userRoleIndex) {
            setUserRoleSelection(0);
        } else {
            setUserRoleSelection(userRoleIndex);
        }
    }

    const handleSetUserRoleButtonOnClick = () => {
        if (userRoleSelection == 0) {
            toast.error("No user role selected");
            return;
        }

        onAssignUserRole(userRoleSelection).then(() => {
            //noop
        }).catch(() => {
            console.warn("An error occurred while assigning the user role...");
        })
    }

    const handleSeeProjectAgreementProposal = (index: number) => {
        const newMap = new Map(userPendingProjectAgreementsSection);
        if (newMap.has(index)) {
            const oldValue = newMap.get(index);
            newMap.set(index, !oldValue);
        } else {
            newMap.set(index, true);
        }

        setUserPendingProjectAgreementsSection(newMap);

        const newMap2 = new Map(agreementOfferedValue);
        newMap2.set(index, 0);
        setAgreementOfferedValue(newMap2);
    }

    const handleOfferedValueChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const newMap = new Map(agreementOfferedValue);

        newMap.set(index, parseInt(event.target.value));

        setAgreementOfferedValue(newMap);
    }

    const handleCreateAgreementTransactionOnClick = (index: number) => {
        try {
            const proposedValue = agreementOfferedValue.get(index);
            if (undefined != proposedValue && proposedValue > 0 && null != pendingProjectsList) {
                onCreateAgreement(pendingProjectsList[index].owner_address, pendingProjectsList[index].project_id, proposedValue)
                    .then(() => {})
                    .catch((e) => console.warn(e));
            }
        } catch(e) {
            console.warn(e);
        }
    }

    const handleAcceptAgreementTransactionOnClick = (index: number) => {
        try {
            const userProjectAgreement = userProjectsAgreementsMap.get(index);
            if (userProjectAgreement) {
                onAcceptAgreement(userProjectAgreement[index].agreement_id)
                    .then(() => console.log("agreement succesfully accepted"))
                    .catch((e) => console.warn(e));
            }
        } catch (e) {
            console.warn(e);
        }
    }

    return(
        <>
            <Navbar isLoggedIn={isLoggedIn} menuList={navbarMenu()} onClickLogout={() => logout("/v2")} onClickLogin={() => navigate('/unlock')} userRole={userRole?.name}/>
            {
                null == userRole && isLoggedIn && (
                    <div className="user-role-error-container">
                        WARNING! User role not selected. Choose your user role:
                        <button className="user-role-input-button" onClick={() => handleUserRoleInputButtonOnClick(2)}
                                style={{backgroundColor: userRoleSelection == 2 ? '#17cf97' : '#1b2430'}}>Client</button>
                        OR
                        <button className="user-role-input-button" onClick={() => handleUserRoleInputButtonOnClick(1)}
                                style={{backgroundColor: userRoleSelection == 1 ? '#17cf97' : '#1b2430'}}>Freelancer</button>
                        and
                        <button className="user-role-set-button" onClick={handleSetUserRoleButtonOnClick}>Set Role</button>
                    </div>
                )
            }
            <div className="container-1">
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <img src="https://www.creativefabrica.com/wp-content/uploads/2021/09/13/1631555634/Turn-Ideas-Into-Reality.jpg" style={{borderRadius: 5, maxWidth: "100%", maxHeight: "100%", display: isContainer1ImgLoaded ? "block" : "none"}} onLoad={handleContainer1ImgLoad} alt="Ideas to Reality"/>
                        <LoadingSpinner style={{display: !isContainer1ImgLoaded ? "grid" : "none"}}/>
                </div>
                <div className="create-project-container">
                    {
                        userRole?.discriminant == 2 ? (
                            <button className="create-project-button" onClick={handleCreateProjectButtonOnClick}>
                                Create Project
                            </button>
                        ) : (
                            <button className="create-project-button" onClick={handlePendingProjectsButtonOnClick}>
                                Pending Projects
                            </button>
                        )
                    }
                </div>
            </div>
            {
                hideCreateProjectSection == false && (
                    <div className="container-4">
                        <_TextArea label="Project Name" value={optionProjectName} onChange={handleOptionProjectNameChange} borderColor="#1b2430" outlineColor="#17cf97" marginBottom={15}/>
                        <_TextArea label="Project Description" value={optionProjectDescription} onChange={handleOptionProjectDescriptionChange} borderColor="#1b2430" outlineColor="#17cf97" marginBottom={15}/>
                        <button className="create-project-with-transaction-button" onClick={handleCreateProjectWithTransactionButtonOnClick}>
                            Create
                        </button>
                    </div>
                )
            }
            {
                hideMyProjectsSection == false && (
                    <div className="container-5">
                        {
                            isMyProjectsSectionLoading ? (
                                <LoadingSpinner/>
                            ) : (
                                <>
                                    {userProjectsList?.map((item, index) => (
                                        <div className="user-project-agreement-container" key={index}>
                                            <div className="user-project-container" style={{backgroundColor: index % 2 == 0 ? "#17cf97" : "#1b2430", color: index % 2 == 0 ? "black" : "white"}}>
                                                <div className="user-project-info">
                                                    <div>ID: {item.project_id}</div>
                                                    <div>Name: {item.project_name}</div>
                                                    <div>Description: {item.project_description}</div>
                                                </div>
                                                <div className="user-project-action">
                                                    <button className="action-button" onClick={() => handleSeeProjectAgreements(index)}>Project Agreements</button>
                                                </div>
                                            </div>
                                            <div className="user-project-agreements">
                                            {
                                                true === userProjectsAgreementsSection.get(index) &&
                                                    (
                                                        <>
                                                            {
                                                                userProjectsAgreementsMap.get(index)?.map((agreement, index) => (
                                                                    <div className="sub-user-project-agreements" key={index}>
                                                                        <div className="agreement-info">
                                                                            <div>ID: {agreement.agreement_id}</div>
                                                                            <div>Freelancer Address: {agreement.employee_address.bech32()}</div>
                                                                            <div>Offered Sum: {agreement.value / 10 ** 18} (xEGLD)</div>
                                                                            <div>Offer Expiring Date: {(() => {
                                                                                const currentTimestamp = Date.now();

                                                                                if (currentTimestamp > agreement.deadline * 1000) {
                                                                                    return "Expired";
                                                                                }

                                                                                return new Date(agreement.deadline * 1000).toString();
                                                                            })()}</div>
                                                                            <div>Status: <span style={
                                                                                {color: agreement.status.discriminant == 0 ? "yellow"
                                                                                        : agreement.status.discriminant == 1 ? "pink"
                                                                                        : agreement.status.discriminant == 2 ? "green" : "red"}}>{agreement.status.name}</span></div>
                                                                        </div>
                                                                        <div className="agreement-action">
                                                                            {
                                                                                agreement.status.discriminant == 0 && (<button className="create-project-with-transaction-button" onClick={() => handleAcceptAgreementTransactionOnClick(index)} style={{marginBottom: 10}}>Accept</button>)
                                                                            }
                                                                            {
                                                                                agreement.status.discriminant == 0 && (<button className="create-project-with-transaction-button">Refuse</button>)
                                                                            }
                                                                            {
                                                                                agreement.status.discriminant == 1 && (<button className="create-project-with-transaction-button">Abort</button>)
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                    )
                                            }
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )
                        }
                    </div>
                )
            }
            {
                hidePendingProjectsSection == false && (
                    <div className="container-5">
                        {
                            isPendingProjectsSectionLoading ? (
                                <LoadingSpinner/>
                            ) : (
                                <>
                                    {pendingProjectsList?.map((item, index) => (
                                        <div className="user-project-agreement-container" key={index}>
                                            <div className="user-project-container" style={{backgroundColor: index % 2 == 0 ? "#17cf97" : "#1b2430", color: index % 2 == 0 ? "black" : "white"}}>
                                                <div className="user-project-info">
                                                    <div>ID: {item.project_id}</div>
                                                    <div>Name: {item.project_name}</div>
                                                    <div>Description: {item.project_description}</div>
                                                </div>
                                                <div className="user-project-action">
                                                    <button className="action-button" onClick={() => handleSeeProjectAgreementProposal(index)}>Propose Agreement</button>
                                                </div>
                                            </div>
                                            <div className="user-project-agreements">
                                                {
                                                    true === userPendingProjectAgreementsSection.get(index) &&
                                                    (
                                                        <>
                                                            <div className="agreement-action">
                                                                <_InputField label="Offered Value" type="number" value={agreementOfferedValue.get(index)} onChange={(event) => handleOfferedValueChange(index, event)} borderColor="#1b2430" outlineColor="#17cf97" marginBottom={15}/>
                                                                <button className="create-project-with-transaction-button" onClick={() => handleCreateAgreementTransactionOnClick(index)}>Propose</button>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )
                        }
                    </div>
                )
            }
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