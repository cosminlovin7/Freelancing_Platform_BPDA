import {useEffect, useState} from "react";
import {_useGetUserProjects} from "../../../hooks/queries/_useGetUserProjects.ts";

export const UserProjectsSection = () => {
    const [isLoading, setIsLoading] = useState(true);
    const userProjectsList = _useGetUserProjects();

    useEffect(() => {
        if (null != userProjectsList) {
            setIsLoading(false);
        }
    }, [userProjectsList])

    return (
        <>

            {
                ! isLoading ?
                    (
                        <div>
                            {
                                null != userProjectsList ? (
                                    <>
                                        <div>Projects: #todo</div>
                                        <ul>
                                            {userProjectsList.map((item, index) => (
                                                <li key={index}>{item.project_id} [PROJECT NAME]:{item.project_name} [PROJECT_DESCRIPTION]:{item.project_description} [STATUS]:{item.project_status.name}({item.project_status.discriminant})</li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <>
                                        <div>Couldn't fetch info about raised sum.</div>
                                    </>
                                )
                            }
                        </div>
                    ) :
                    (
                        <div>
                            Loading...
                        </div>
                    )
            }

        </>
    )
}