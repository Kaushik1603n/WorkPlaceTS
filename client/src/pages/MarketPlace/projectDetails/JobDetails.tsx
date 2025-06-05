import React, { useEffect, useState } from "react";
import NavigationBar from "../../../components/navigationBar/NavigationBar";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import JobDetailsSkeleton from "./JobDetailsSkeleton";
import type { AppDispatch } from "../../../app/store";
import { useDispatch } from "react-redux";
import { getJobDetails } from "../../../features/marketPlace/marketPlaceSlice";

interface User {
    role: string;
}

interface Client {
    fullName?: string;
    email?: string;
}

interface Job {
    title?: string;
    description?: string;
    stack?: string;
    time?: string;
    reference?: string;
    requiredFeatures?: string | React.ReactNode;
    budgetType?: string;
    budget?: string | number;
    experienceLevel?: string;
    clientId?: Client;
}

interface AuthState {
    auth: {
        user: User;
    };
}


function JobDetails() {
    const { jobId } = useParams<{ jobId: string }>();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true); // Add loading state

    const { user } = useSelector((store: AuthState) => store.auth);
    // const baseURL: string = import.meta.env.VITE_API_BASE_URL;
    const dispatch: AppDispatch = useDispatch();


    useEffect(() => {
        setLoading(true);
        dispatch(getJobDetails({ jobId })).unwrap().then((res) => {setLoading(false);
            setJob(res.data)
            console.log(res.data);
            
        })
    }, [dispatch, jobId]);

    if (loading) {
        return <JobDetailsSkeleton />
    }


    return (
        <>
            <NavigationBar />
            <div className="max-w-4xl mx-auto my-8 p-6 bg-[#EFFFF6] rounded-lg shadow-sm border border-[#27AE60]">
                <h1 className="text-2xl font-bold text-center mb-8">{job?.title}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div>
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-2">Discription</h2>
                            <p className="text-gray-700">{job?.description}</p>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-2">Tech Preferences</h2>
                            <p className="text-gray-700">{job?.stack}</p>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-2">Time</h2>
                            <p className="text-gray-700"> {job?.time} only</p>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-2">Reference</h2>
                            <a
                                href={job?.reference ? job?.reference : "#"}
                                className="text-gray-700 break-words text-sm pointer"
                            >
                                {job?.reference}
                            </a>
                        </div>
                    </div>

                    <div>
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-2">
                                Required Features / Pages
                            </h2>
                            <ul className="text-gray-700 space-y-1">
                                {job?.requiredFeatures}
                            </ul>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-2">Budget</h2>
                            <p className="text-gray-700">
                                Budget Type: <b>{job?.budgetType}</b> <br />
                                Budget : <b>{job?.budget}</b>
                            </p>
                        </div>
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-2">Experience Level</h2>
                            <p className="text-gray-700">{job?.experienceLevel}</p>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-2">Posted by</h2>
                            <div className=" py-2  rounded ">
                                {job?.clientId?.fullName} <br />
                                {job?.clientId?.email}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    {user?.role === "freelancer" && (
                        <Link
                            to="apply-job"
                            className="bg-[#2ECC71] hover:bg-[#27AE60] text-white py-2 px-6 rounded-lg transition-colors"
                        >
                            Apply Now
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}

export default JobDetails;