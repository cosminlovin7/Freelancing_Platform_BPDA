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
import {_useCompleteAgreement} from "../../hooks/transactions/_useCompleteAgreement.ts";
import {_useAbortFreelancerAgreement} from "../../hooks/transactions/onAbortFreelancerAgreement.ts";
import {_useAbortClientAgreement} from "../../hooks/transactions/onAbortClientAgreement.ts";
import {_useRateFreelancer} from "../../hooks/transactions/_useRateFreelancer.ts";

export const HomePagev2 = () => {
    const isLoggedIn = useGetIsLoggedIn();
    const [userRole, setUserRole] = useState<_UserRoleType | undefined | null>(null);
    const [userRating, setUserRating] = useState<number  | undefined>(NaN);
    const [userRatingCount, setUserRatingCount] = useState<number  | undefined>(NaN);
    const navigate = useNavigate();
    const {account} = useGetAccountInfo();
    const [isContainer1ImgLoaded, setIsContainer1ImgLoaded] = useState(false);
    const [isContainer2ImgLoaded, setIsContainer2ImgLoaded] = useState(false);
    const [optionProjectName, setOptionProjectName] = useState("");
    const [optionProjectDescription, setOptionProjectDescription] = useState("");
    const [hideCreateProjectSection, setHideCreateProjectSection] = useState(true);
    const [hideMyProjectsSection, setHideMyProjectsSection] = useState(true);
    const [hidePendingProjectsSection, setPendingProjectsSection] = useState(true);
    const [hideMyFreelancerAgreementsSection, setHideMyFreelancerAgreementsSection] = useState(true);
    const [hideMyClientAgreementsSection, setHideMyClientAgreementsSection] = useState(true);
    const {onCreateProject} = _useCreateProject();
    const {onAssignUserRole} = _useAssignUserRole();
    const {onCreateAgreement} = _useCreateAgreement();
    const {onAcceptAgreement} = _useAcceptAgreement();
    const {onCompleteAgreement} = _useCompleteAgreement();
    const {onAbortFreelancerAgreement} = _useAbortFreelancerAgreement();
    const {onAbortClientAgreement} = _useAbortClientAgreement();
    const {onRateFreelancer} = _useRateFreelancer();

    const [isMyProjectsSectionLoading, setIsMyProjectsSectionLoading] = useState(true);
    const [isPendingProjectsSectionLoading, setIsPendingProjectsSectionLoading] = useState(true);
    const [isMyFreelancerAgreementsSectionLoading, setIsMyFreelancerAgreementsSectionLoading] = useState(true);
    const [isMyClientAgreementsSectionLoading, setIsMyClientAgreementsSectionLoading] = useState(true);
    const [userProjectsList, setUserProjectsList] = useState<_ProjectDtoType[] | null | undefined>(null);
    const [pendingProjectsList, setPendingProjectsList] = useState<_ProjectDtoType[] | null | undefined>(null);
    const [userProjectsAgreementsSection, setUserProjectsAgreementsSection] = useState<Map<number, boolean>>(new Map());
    const [userProjectsAgreementsMap, setUserProjectsAgreementsMap] = useState<Map<number, _AgreementDtoType[] | null | undefined>>(new Map());
    const [userRoleSelection, setUserRoleSelection] = useState(0);
    const [userPendingProjectAgreementsSection, setUserPendingProjectAgreementsSection] = useState<Map<number, boolean>>(new Map());
    const [agreementOfferedValue, setAgreementOfferedValue] = useState<Map<number, number>>(new Map());
    const [agreementEmployeeRatingSection, setAgreementEmployeeRatingSection] = useState<Map<number, boolean>>(new Map());
    const [agreementEmployeeRatingValue, setAgreementEmployeeRatingValue] = useState<Map<number, number>>(new Map());
    const [agreementEmployeeCompleteSection, setAgreementEmployeeCompleteSection] = useState<Map<number, boolean>>(new Map());
    const [agreementEmployeeCompleteGitHubId, setAgreementEmployeeCompleteGitHubId] = useState<Map<number, string>>(new Map());
    const [agreementEmployeeCompleteRepoName, setAgreementEmployeeCompleteRepoName] = useState<Map<number, string>>(new Map());
    const [agreementEmployeeCompleteCommitHash, setAgreementEmployeeCompleteCommitHash] = useState<Map<number, string>>(new Map());
    const [myFreelancerAgreementsList, setMyFreelancerAgreementsList] = useState<_AgreementDtoType[] | null | undefined>(null);
    const [myClientAgreementsList, setMyClientAgreementsList] = useState<_AgreementDtoType[] | null | undefined>(null);

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
        if (null != myFreelancerAgreementsList) {
            console.log('my freelancing agreements');
            setIsMyFreelancerAgreementsSectionLoading(false);
        }
    }, [myFreelancerAgreementsList])

    useEffect(() => {
        if (null != myClientAgreementsList) {
            console.log('my client agreements');
            setIsMyClientAgreementsSectionLoading(false);
        }
    }, [myClientAgreementsList])

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

    useEffect(() => {
        if (userRole?.discriminant == 1) {
            const networkProvider = new ProxyNetworkProvider(API_URL);
            const interaction1 = _SmartContract.methods.getUserRating([account.address]);
            const interaction2 = _SmartContract.methods.getUserRatingCounter([account.address]);
            const query1 = interaction1.buildQuery();
            const query2 = interaction2.buildQuery();

            const queryResult1 = networkProvider.queryContract(query1);
            const queryResult2 = networkProvider.queryContract(query2);

            queryResult1.then((response) => {
                const {firstValue: userRatingResult} = new ResultsParser().parseQueryResponse(response, interaction1.getEndpoint());

                if (userRatingResult) {
                    const userRatingDeserialized: number = (function(_userRating: number) {
                        console.log(_userRating.valueOf());
                        const _userRatingDeserialized = _userRating.valueOf();

                        return _userRatingDeserialized;
                    })(userRatingResult.valueOf());

                    queryResult2.then((response) => {
                        const {firstValue: userRatingCounterResult} = new ResultsParser().parseQueryResponse(response, interaction2.getEndpoint());

                        if (userRatingCounterResult) {
                            const userRatingCounterDeserialized: number = (function(_userRatingCounter: number) {
                                console.log(_userRatingCounter);
                                const _userRatingCounterDeserialized = _userRatingCounter.valueOf();

                                return _userRatingCounterDeserialized;
                            })(userRatingCounterResult.valueOf());

                            // return userRoleStatusDeserialized;
                            console.log(userRatingCounterDeserialized);
                            setUserRatingCount(userRatingCounterDeserialized);
                        }
                    }).catch((e) => console.warn(e));

                    // return userRoleStatusDeserialized;
                    console.log(userRatingDeserialized);
                    setUserRating(userRatingDeserialized);
                }
            }).catch((e) => console.warn(e));

            queryResult2.then((response) => {
                const {firstValue: userRatingCounterResult} = new ResultsParser().parseQueryResponse(response, interaction2.getEndpoint());

                if (userRatingCounterResult) {
                    const userRatingCounterDeserialized: number = (function(_userRatingCounter: number) {
                        console.log(_userRatingCounter);
                        const _userRatingCounterDeserialized = _userRatingCounter.valueOf();

                        return _userRatingCounterDeserialized;
                    })(userRatingCounterResult.valueOf());

                    // return userRoleStatusDeserialized;
                    console.log(userRatingCounterDeserialized);
                    setUserRatingCount(userRatingCounterDeserialized);
                }
            }).catch((e) => console.warn(e));
        }
    }, [account, userRole])

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
            setHideMyProjectsSection(true);
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

                            _userProjectsList.slice().sort((a, b) => b.project_id - a.project_id).map((userProject: _ResponseProjectDtoType) => {
                                const _discriminant = (function() {
                                    switch(userProject.project_status.name) {
                                        case "None":
                                            return 0;
                                        case "PendingAgreement":
                                            return 1;
                                        case "InProgress":
                                            return 2;
                                        case "Completed":
                                            return 3;
                                        case "Aborted":
                                            return 4;
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

                            _pendingProjectsList.slice().sort((a, b) => b.project_id - a.project_id).map((pendingProject: _ResponseProjectDtoType) => {
                                const _discriminant = (function() {
                                    switch(pendingProject.project_status.name) {
                                        case "None":
                                            return 0;
                                        case "PendingAgreement":
                                            return 1;
                                        case "InProgress":
                                            return 2;
                                        case "Completed":
                                            return 3;
                                        case "Aborted":
                                            return 4;
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

                        _projectAgreementsList.slice().sort((a, b) => b.agreement_id - a.agreement_id).map((projectAgreement: _ResponseAgreementDtoType) => {
                            const _discriminant = (function() {
                                switch(projectAgreement.status.name) {
                                    case "None":
                                        return 0;
                                    case "Proposal":
                                        return 1;
                                    case "InProgress":
                                        return 2;
                                    case "Declined":
                                        return 3;
                                    case "Completed":
                                        return 4;
                                    case "Aborted":
                                        return 5;
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
                                },
                                employee_rated: projectAgreement.employee_rated
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

    const handleMyFreelancerAgreementsButtonOnClick = () => {
        console.log('My freelancer agreements function called');

        if (false == !hideMyFreelancerAgreementsSection) {
            const networkProvider = new ProxyNetworkProvider(API_URL);
            const interaction = _SmartContract.methods.getEmployeeAgreements([account.address]);
            const query = interaction.buildQuery();
            networkProvider
                .queryContract(query)
                .then((response) => {
                    const {firstValue: myFreelancerAgreementsList} = new ResultsParser().parseQueryResponse(response, interaction.getEndpoint());
                    if (myFreelancerAgreementsList) {
                        const myFreelaancerAgreementsListDeserialiezd: _AgreementDtoType[] = (function(_myFreelancerAgreementsList: _ResponseAgreementDtoType[]) {
                            const _myFreelancerAgreementsListDeserialized: _AgreementDtoType[] = [];

                            _myFreelancerAgreementsList.slice().sort((a, b) => b.agreement_id - a.agreement_id).map((freelancerAgreement: _ResponseAgreementDtoType) => {
                                const _discriminant = (function() {
                                    switch(freelancerAgreement.status.name) {
                                        case "None":
                                            return 0;
                                        case "Proposal":
                                            return 1;
                                        case "InProgress":
                                            return 2;
                                        case "Declined":
                                            return 3;
                                        case "Completed":
                                            return 4;
                                        case "Aborted":
                                            return 5;
                                        default:
                                            return -1;
                                    }
                                })();

                                _myFreelancerAgreementsListDeserialized.push({
                                    agreement_id: freelancerAgreement.agreement_id.valueOf(),
                                    deadline: freelancerAgreement.deadline.valueOf(),
                                    employee_address: freelancerAgreement.employee_address,
                                    employer_address: freelancerAgreement.employer_address,
                                    project_id: freelancerAgreement.project_id.valueOf(),
                                    value: freelancerAgreement.value.valueOf(),
                                    status: {
                                        discriminant: _discriminant,
                                        name: freelancerAgreement.status.name
                                    },
                                    employee_rated: freelancerAgreement.employee_rated
                                })
                            });

                            return _myFreelancerAgreementsListDeserialized;
                        })(myFreelancerAgreementsList.valueOf());

                        setMyFreelancerAgreementsList(myFreelaancerAgreementsListDeserialiezd);
                        setHideMyFreelancerAgreementsSection(!hideMyFreelancerAgreementsSection);
                    }
                })
                .catch((e) => console.warn(e));
        } else {
            setHideMyFreelancerAgreementsSection(!hideMyFreelancerAgreementsSection);
            setIsMyFreelancerAgreementsSectionLoading(true);
        }
    }

    const handleMyClientAgreementsButtonOnClick = () => {
        console.log('My client agreements function called');

        if (false == !hideMyClientAgreementsSection) {
            const networkProvider = new ProxyNetworkProvider(API_URL);
            const interaction = _SmartContract.methods.getEmployerAgreements([account.address]);
            const query = interaction.buildQuery();
            networkProvider
                .queryContract(query)
                .then((response) => {
                    const {firstValue: myClientAgreementsList} = new ResultsParser().parseQueryResponse(response, interaction.getEndpoint());
                    if (myClientAgreementsList) {
                        const myClientAgreementsListDeserialiezd: _AgreementDtoType[] = (function(_myClientAgreementsList: _ResponseAgreementDtoType[]) {
                            const _myClientAgreementsListDeserialized: _AgreementDtoType[] = [];

                            console.log(_myClientAgreementsList);

                            _myClientAgreementsList.slice().sort((a, b) => b.agreement_id - a.agreement_id).map((clientAgreement: _ResponseAgreementDtoType) => {
                                const _discriminant = (function() {
                                    switch(clientAgreement.status.name) {
                                        case "None":
                                            return 0;
                                        case "Proposal":
                                            return 1;
                                        case "InProgress":
                                            return 2;
                                        case "Declined":
                                            return 3;
                                        case "Completed":
                                            return 4;
                                        case "Aborted":
                                            return 5;
                                        default:
                                            return -1;
                                    }
                                })();

                                _myClientAgreementsListDeserialized.push({
                                    agreement_id: clientAgreement.agreement_id.valueOf(),
                                    deadline: clientAgreement.deadline.valueOf(),
                                    employee_address: clientAgreement.employee_address,
                                    employer_address: clientAgreement.employer_address,
                                    project_id: clientAgreement.project_id.valueOf(),
                                    value: clientAgreement.value.valueOf(),
                                    status: {
                                        discriminant: _discriminant,
                                        name: clientAgreement.status.name
                                    },
                                    employee_rated: clientAgreement.employee_rated
                                })
                            });

                            return _myClientAgreementsListDeserialized;
                        })(myClientAgreementsList.valueOf());

                        console.log(myClientAgreementsListDeserialiezd);

                        setMyClientAgreementsList(myClientAgreementsListDeserialiezd);
                        setHideMyClientAgreementsSection(!hideMyClientAgreementsSection);
                    }
                })
                .catch((e) => console.warn(e));
        } else {
            setHideMyClientAgreementsSection(!hideMyClientAgreementsSection);
            setIsMyClientAgreementsSectionLoading(true);
        }
    }

    const navbarMenu: () => NavbarMenuItem[] = () => {
        const menu: NavbarMenuItem[] = [];

        menu.push({name:"Home", onClickFunction:handleHomeButtonOnClick});
        if (userRole) {
            switch(userRole.discriminant) {
                case 0:
                    break;
                case 1: //Freelancer
                    menu.push({name:"My Freelancer Agreements", onClickFunction:handleMyFreelancerAgreementsButtonOnClick});
                    menu.push({name:"Pending Projects", onClickFunction:handlePendingProjectsButtonOnClick});
                    break;
                case 2: //Client
                    menu.push({name:"My Client Agreements", onClickFunction:handleMyClientAgreementsButtonOnClick});
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

    const handleSeeAgreementEmployeeRatingSection = (index: number) => {
        const newMap = new Map(agreementEmployeeRatingSection);
        if (newMap.has(index)) {
            const oldValue = newMap.get(index);
            newMap.set(index, !oldValue);
        } else {
            newMap.set(index, true);
        }

        setAgreementEmployeeRatingSection(newMap);

        const newMap2 = new Map(agreementEmployeeRatingValue);
        newMap2.set(index, 0);
        setAgreementEmployeeRatingValue(newMap2);
    }

    const handleAgreementEmployeeRatingValueChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const newMap = new Map(agreementEmployeeRatingValue);

        newMap.set(index, parseInt(event.target.value));

        setAgreementEmployeeRatingValue(newMap);
    }

    const handleSeeAgreementEmployeeCompleteSection = (index: number) => {
        const newMap = new Map(agreementEmployeeCompleteSection);
        if (newMap.has(index)) {
            const oldValue = newMap.get(index);
            newMap.set(index, !oldValue);
        } else {
            newMap.set(index, true);
        }

        setAgreementEmployeeCompleteSection(newMap);

        const newMap3 = new Map(agreementEmployeeCompleteRepoName);
        newMap3.set(index, "");
        setAgreementEmployeeCompleteRepoName(newMap3);

        const newMap4 = new Map(agreementEmployeeCompleteGitHubId);
        newMap4.set(index, "");
        setAgreementEmployeeCompleteGitHubId(newMap4);

        const newMap5 = new Map(agreementEmployeeCompleteCommitHash);
        newMap5.set(index, "");
        setAgreementEmployeeCompleteCommitHash(newMap5);
    }

    const handleAgreementEmployeeCompleteRepoNameChange = (index: number, event: ChangeEvent<HTMLTextAreaElement>) => {
        const newMap= new Map(agreementEmployeeCompleteRepoName);

        newMap.set(index, event.target.value);

        setAgreementEmployeeCompleteRepoName(newMap);
    }

    const handleAgreementEmployeeCompleteGitHubIdChange = (index: number, event: ChangeEvent<HTMLTextAreaElement>) => {
        const newMap= new Map(agreementEmployeeCompleteGitHubId);

        newMap.set(index, event.target.value);

        setAgreementEmployeeCompleteGitHubId(newMap);
    }

    const handleAgreementEmployeeCompleteCommitHashChange = (index: number, event: ChangeEvent<HTMLTextAreaElement>) => {
        const newMap= new Map(agreementEmployeeCompleteCommitHash);

        newMap.set(index, event.target.value);

        setAgreementEmployeeCompleteCommitHash(newMap);
    }

    const handleCreateAgreementTransactionOnClick = (index: number) => {
        try {
            const proposedValue = agreementOfferedValue.get(index);
            console.log(typeof proposedValue);
            if (undefined != proposedValue && proposedValue > 0 && null != pendingProjectsList) {
                onCreateAgreement(pendingProjectsList[index].owner_address, pendingProjectsList[index].project_id, proposedValue)
                    .then(() => {})
                    .catch((e) => console.warn(e));
            }
        } catch(e) {
            console.warn(e);
        }
    }

    const handleAcceptAgreementTransactionOnClick = (index: number, index2: number) => {
        console.log('button pressed, button_index ' + index2);
        try {
            const userProjectAgreement = userProjectsAgreementsMap.get(index);
            console.log(userProjectsAgreementsMap);
            if (userProjectAgreement) {
                onAcceptAgreement(userProjectAgreement[index2].agreement_id, userProjectAgreement[index2].value)
                    .then(() => {
                        console.log("agreement succesfully accepted");
                        setHideMyProjectsSection(true);
                    })
                    .catch((e) => console.warn(e));
            }
        } catch (e) {
            console.warn(e);
        }
    }

    const handleAbortFreelancerAgreementButtonOnClick = (index: number) => {
        try {
            if (null != myFreelancerAgreementsList) {
                const freelancerAgreement = myFreelancerAgreementsList[index];
                if (freelancerAgreement) {
                    onAbortFreelancerAgreement(freelancerAgreement.agreement_id)
                        .then(() => {
                            console.log("agreement succesfully aborted")
                            setHideMyFreelancerAgreementsSection(true);
                        })
                        .catch((e) => console.warn(e));
                }
            }
        } catch (e) {
            console.warn(e);
        }
    }

    const handleAbortClientAgreementButtonOnClick = (index: number) => {
        try {
            if (null != myClientAgreementsList) {
                const clientAgreement = myClientAgreementsList[index];
                if (clientAgreement) {
                    onAbortClientAgreement(clientAgreement.agreement_id)
                        .then(() => {
                            console.log("agreement succesfully aborted");
                            setHideMyClientAgreementsSection(true);
                        })
                        .catch((e) => console.warn(e));
                }
            }
        } catch (e) {
            console.warn(e);
        }
    }

    const handleSubmitEmployeeRatingOnClick = (index: number) => {
        const agreementRating = agreementEmployeeRatingValue.get(index);

        if (null != agreementRating && (agreementRating < 1 || agreementRating > 5)) {
            toast.error("Rating value incorrect. Please provide a value between 1 and 5.");
            return;
        }

        try {
            if (null != myClientAgreementsList) {
                const agreementInfo = myClientAgreementsList[index];
                if (null != agreementInfo && null != agreementRating) {
                    onRateFreelancer(agreementInfo.agreement_id, agreementInfo.employee_address, agreementRating)
                        .then(() => {
                            console.log("Freelancer successfully rated.");
                            setHideMyClientAgreementsSection(true);
                        })
                        .catch((e) => console.warn(e));
                }
            }
        } catch (e) {
            console.warn(e);
        }
    }

    const handleSubmitEmployeeCompleteOnClick = (index: number) => {
        const agreementRepoName = agreementEmployeeCompleteRepoName.get(index);
        const agreementGitHubId = agreementEmployeeCompleteGitHubId.get(index);
        const agreementCommitHash = agreementEmployeeCompleteCommitHash.get(index);

        if (null != agreementRepoName && agreementRepoName.length == 0) {
            toast.error("GitHub repository name is invalid.");
            return;
        }

        if (null != agreementGitHubId && agreementGitHubId.length == 0) {
            toast.error("GitHub id is invalid");
            return;
        }

        if (null != agreementCommitHash && agreementCommitHash.length == 0) {
            toast.error("GitHub commit hash is invalid");
            return;
        }

        const gitHubCommitCheckUrl = "https://api.github.com/search/commits?q=repo:"
            + agreementGitHubId
            + "/"
            + agreementRepoName
            + "+hash:"
            + agreementCommitHash;

        fetch(gitHubCommitCheckUrl)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.total_count >= 1) {
                    toast.success("GitHub Commit validated successfully!");
                    try {
                        if (null != myFreelancerAgreementsList) {
                            const freelancerAgreement = myFreelancerAgreementsList[index];
                            if (freelancerAgreement) {
                                onCompleteAgreement(freelancerAgreement.agreement_id)
                                    .then(() => {
                                        console.log("agreement succesfully completed");
                                        setHideMyFreelancerAgreementsSection(true);
                                    })
                                    .catch((e) => console.warn(e));
                            }
                        }
                    } catch (e) {
                        console.warn(e);
                    }
                } else {
                    toast.error("GitHub Commit validation failed");
                }
            })
            .catch(() => {
                toast.error("Error fetching data from GitHub");
            });
    }

    return(
        <>
            <Navbar isLoggedIn={isLoggedIn} menuList={navbarMenu()} onClickLogout={() => logout("/v2")} onClickLogin={() => navigate('/unlock')} userRole={userRole?.name} userRating={userRating} userRatingCount={userRatingCount}/>
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
                                    {userProjectsList?.slice().sort((a, b) => b.project_id - a.project_id).map((item, index) => (
                                        <div className="user-project-agreement-container" key={index}>
                                            <div className="user-project-container" style={{backgroundColor: index % 2 == 0 ? "#17cf97" : "#1b2430", color: index % 2 == 0 ? "black" : "white"}}>
                                                <div className="user-project-info" style={{width: item.project_status.discriminant == 1 ? '50%' : '100%'}}>
                                                    <div style={{width: '100%'}}>ID: {item.project_id}</div>
                                                    <div style={{width: '100%'}}>Name: {item.project_name}</div>
                                                    <div style={{width: '100%'}}>Description: {item.project_description}</div>
                                                    <div style={{width: '100%'}}>Status: {item.project_status.name}</div>
                                                </div>
                                                {
                                                    item.project_status.discriminant == 1 && (<div className="user-project-action">
                                                        <button className="action-button" onClick={() => handleSeeProjectAgreements(index)}>Project Agreements</button>
                                                    </div>)
                                                }
                                            </div>
                                            <div className="user-project-agreements">
                                            {
                                                true === userProjectsAgreementsSection.get(index) &&
                                                    (
                                                        <>
                                                            {
                                                                userProjectsAgreementsMap.get(index)?.slice().sort((a, b) => b.agreement_id - a.agreement_id).map((agreement, index2) => (
                                                                    <div className="sub-user-project-agreements" key={index2} style={{backgroundColor: "#17cf97", padding: 10}}>
                                                                        <div className="agreement-info">
                                                                            <div style={{width: '100%'}}>ID: {agreement.agreement_id}</div>
                                                                            <div style={{width: '100%'}}>Freelancer Address: {agreement.employee_address.bech32()}</div>
                                                                            <div style={{width: '100%'}}>Offered Sum: {agreement.value} (xEGLD)</div>
                                                                            <div style={{width: '100%'}}>Offer Expiring Date: {(() => {
                                                                                const currentTimestamp = Date.now();

                                                                                if (currentTimestamp > agreement.deadline * 1000) {
                                                                                    return "Expired";
                                                                                }

                                                                                return new Date(agreement.deadline * 1000).toString();
                                                                            })()}</div>
                                                                            <div style={{width: '100%'}}>Status: <span style={
                                                                                {color: agreement.status.discriminant == 1 ? "yellow"
                                                                                        : agreement.status.discriminant == 2 ? "pink"
                                                                                        : agreement.status.discriminant == 3 ? "green" : "red"}}>{agreement.status.name}</span></div>
                                                                            <div style={{width: '100%'}}>
                                                                                Employee rated: {agreement.employee_rated ? 'True' : 'False'}
                                                                            </div>
                                                                        </div>
                                                                        <div className="agreement-action">
                                                                            {
                                                                                agreement.status.discriminant == 1 && (<button className="create-project-with-transaction-button" onClick={() => handleAcceptAgreementTransactionOnClick(index, index2)} style={{marginBottom: 10}}>Accept</button>)
                                                                            }
                                                                            {
                                                                                agreement.status.discriminant == 2 && (<button className="create-project-with-transaction-button">Refuse</button>)
                                                                            }
                                                                            {
                                                                                agreement.status.discriminant == 3 && (<button className="create-project-with-transaction-button">Abort</button>)
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
                                    {pendingProjectsList?.slice().sort((a, b) => b.project_id - a.project_id).map((item, index) => (
                                        <div className="user-project-agreement-container" key={index}>
                                            <div className="user-project-container" style={{backgroundColor: index % 2 == 0 ? "#17cf97" : "#1b2430", color: index % 2 == 0 ? "black" : "white"}}>
                                                <div className="user-project-info">
                                                    <div style={{width: '100%'}}>ID: {item.project_id}</div>
                                                    <div style={{width: '100%'}}>Name: {item.project_name}</div>
                                                    <div style={{width: '100%'}}>Description: {item.project_description}</div>
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
            {
                hideMyFreelancerAgreementsSection == false && (
                    <div className="container-5">
                        {
                            isMyFreelancerAgreementsSectionLoading ? (
                                <LoadingSpinner/>
                            ) : (
                                <>
                                    {myFreelancerAgreementsList?.slice().sort((a, b) => b.agreement_id - a.agreement_id).map((agreement, index) => (
                                        <div className="user-project-agreement-container" key={index}>
                                            <div className="user-project-container" style={{
                                                backgroundColor: index % 2 == 0 ? "#17cf97" : "#1b2430",
                                                color: index % 2 == 0 ? "black" : "white"
                                            }}>
                                                <div className="user-project-info">
                                                    <div style={{width: '100%'}}>ID: {agreement.agreement_id}</div>
                                                    <div style={{width: '100%'}}>Client
                                                        Address: {agreement.employer_address.bech32()}</div>
                                                    <div style={{width: '100%'}}>Offered
                                                        Sum: {agreement.value} (xEGLD)
                                                    </div>
                                                    <div style={{width: '100%'}}>Offer Expiring Date: {(() => {
                                                        const currentTimestamp = Date.now();

                                                        if (currentTimestamp > agreement.deadline * 1000) {
                                                            return "Expired";
                                                        }

                                                        return new Date(agreement.deadline * 1000).toString();
                                                    })()}</div>
                                                    <div style={{width: '100%'}}>Status: <span style={
                                                        {
                                                            color: agreement.status.discriminant == 1 ? "yellow"
                                                                : agreement.status.discriminant == 2 ? "pink"
                                                                    : agreement.status.discriminant == 3 ? "red"
                                                                        : agreement.status.discriminant == 4 ? "green" : "orange"
                                                        }}>{agreement.status.name}</span></div>
                                                    <div style={{width: '100%'}}>
                                                        Employee rated: {agreement.employee_rated ? 'True' : 'False'}
                                                    </div>
                                                </div>
                                                <div className="user-project-action">
                                                    {
                                                        agreement.status.discriminant == 2 && (
                                                            <button className="action-button"
                                                                    onClick={() => handleSeeAgreementEmployeeCompleteSection(index)}
                                                                    style={{marginRight: 10}}>Complete</button>
                                                        )
                                                    }
                                                    {
                                                        (
                                                            // agreement.status.discriminant == 1
                                                            agreement.status.discriminant == 2
                                                        ) && (<button className="action-button"
                                                                      onClick={() => handleAbortFreelancerAgreementButtonOnClick(index)}>Abort</button>
                                                        )
                                                    }
                                                </div>
                                                <div className="user-project-agreements">
                                                    {
                                                        true === agreementEmployeeCompleteSection.get(index) &&
                                                        (
                                                            <>
                                                                <div className="agreement-action">
                                                                    <_TextArea label="GitHub Repository:"
                                                                               onChange={(event) => handleAgreementEmployeeCompleteRepoNameChange(index, event)}
                                                                               borderColor="#1b2430"
                                                                               outlineColor="#17cf97"
                                                                               marginBottom={15}/>
                                                                    <_TextArea label="GitHub ID:"
                                                                               onChange={(event) => handleAgreementEmployeeCompleteGitHubIdChange(index, event)}
                                                                               borderColor="#1b2430"
                                                                               outlineColor="#17cf97"
                                                                               marginBottom={15}/>
                                                                    <_TextArea label="GitHub Commit Hash:"
                                                                               onChange={(event) => handleAgreementEmployeeCompleteCommitHashChange(index, event)}
                                                                               borderColor="#1b2430"
                                                                               outlineColor="#17cf97"
                                                                               marginBottom={15}/>
                                                                    <button
                                                                        className="create-project-with-transaction-button"
                                                                        onClick={() => handleSubmitEmployeeCompleteOnClick(index)}>Submit
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            {/*<div className="user-project-agreements">*/}
                                            {/*    {*/}
                                            {/*        true === userPendingProjectAgreementsSection.get(index) &&*/}
                                            {/*        (*/}
                                            {/*            <>*/}
                                            {/*                <div className="agreement-action">*/}
                                            {/*                    <_InputField label="Offered Value" type="number" value={agreementOfferedValue.get(index)} onChange={(event) => handleOfferedValueChange(index, event)} borderColor="#1b2430" outlineColor="#17cf97" marginBottom={15}/>*/}
                                            {/*                    <button className="create-project-with-transaction-button" onClick={() => handleCreateAgreementTransactionOnClick(index)}>Propose</button>*/}
                                            {/*                </div>*/}
                                            {/*            </>*/}
                                            {/*        )*/}
                                            {/*    }*/}
                                            {/*</div>*/}
                                        </div>
                                    ))}
                                </>
                            )
                        }
                    </div>
                )
            }
            {
                hideMyClientAgreementsSection == false && (
                    <div className="container-5">
                        {
                            isMyClientAgreementsSectionLoading ? (
                                <LoadingSpinner/>
                            ) : (
                                <>
                                    {myClientAgreementsList?.slice().sort((a, b) => b.agreement_id - a.agreement_id).map((agreement, index) => (
                                        <div className="user-project-agreement-container" key={index}>
                                            <div className="user-project-container" style={{
                                                backgroundColor: index % 2 == 0 ? "#17cf97" : "#1b2430",
                                                color: index % 2 == 0 ? "black" : "white"
                                            }}>
                                                <div className="user-project-info">
                                                    <div style={{width: '100%'}}>ID: {agreement.agreement_id}</div>
                                                    <div style={{width: '100%'}}>Client
                                                        Address: {agreement.employer_address.bech32()}</div>
                                                    <div style={{width: '100%'}}>Offered
                                                        Sum: {agreement.value} (xEGLD)
                                                    </div>
                                                    <div style={{width: '100%'}}>Offer Expiring Date: {(() => {
                                                        const currentTimestamp = Date.now();

                                                        if (currentTimestamp > agreement.deadline * 1000) {
                                                            return "Expired";
                                                        }

                                                        return new Date(agreement.deadline * 1000).toString();
                                                    })()}</div>
                                                    <div style={{width: '100%'}}>Status: <span style={
                                                        {
                                                            color: agreement.status.discriminant == 1 ? "yellow"
                                                                : agreement.status.discriminant == 2 ? "pink"
                                                                    : agreement.status.discriminant == 3 ? "green" : "red"
                                                        }}>{agreement.status.name}</span></div>
                                                    <div style={{width: '100%'}}>
                                                        Employee rated: {agreement.employee_rated ? 'True' : 'False'}
                                                    </div>
                                                </div>
                                                <div className="user-project-action">
                                                    {/*<button className="action-button"*/}
                                                    {/*        onClick={() => handleSeeProjectAgreementProposal(index)}*/}
                                                    {/*        style={{marginRight: 10}}>Mark as complete</button>*/}
                                                    {
                                                        !agreement.employee_rated
                                                        && agreement.status.discriminant == 4
                                                        && <button className="action-button" style={{marginRight: 10}}
                                                                   onClick={() => handleSeeAgreementEmployeeRatingSection(index)}>Rate</button>
                                                    }
                                                    {
                                                        agreement.status.discriminant == 2
                                                        && <button className="action-button"
                                                                   onClick={() => handleAbortClientAgreementButtonOnClick(index)}>Abort</button>
                                                    }
                                                </div>
                                                <div className="user-project-agreements">
                                                    {
                                                        true === agreementEmployeeRatingSection.get(index) &&
                                                        (
                                                            <>
                                                                <div className="agreement-action">
                                                                    <_InputField label="Rating(1-5):" type="number"
                                                                                 value = {agreementEmployeeRatingValue.get(index)}
                                                                                 onChange={(event) => handleAgreementEmployeeRatingValueChange(index, event)}
                                                                                 borderColor="#1b2430"
                                                                                 outlineColor="#17cf97"
                                                                                 marginBottom={15}/>
                                                                    <button
                                                                        className="create-project-with-transaction-button"
                                                                        onClick={() => handleSubmitEmployeeRatingOnClick(index)}>Submit
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            {/*<div className="user-project-agreements">*/}
                                            {/*    {*/}
                                            {/*        true === userPendingProjectAgreementsSection.get(index) &&*/}
                                            {/*        (*/}
                                            {/*            <>*/}
                                            {/*                <div className="agreement-action">*/}
                                            {/*                    <_InputField label="Offered Value" type="number" value={agreementOfferedValue.get(index)} onChange={(event) => handleOfferedValueChange(index, event)} borderColor="#1b2430" outlineColor="#17cf97" marginBottom={15}/>*/}
                                            {/*                    <button className="create-project-with-transaction-button" onClick={() => handleCreateAgreementTransactionOnClick(index)}>Propose</button>*/}
                                            {/*                </div>*/}
                                            {/*            </>*/}
                                            {/*        )*/}
                                            {/*    }*/}
                                            {/*</div>*/}
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