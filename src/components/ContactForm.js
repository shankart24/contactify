import { db } from "../firebase";
import {
    addDoc,
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc,
    deleteDoc
} from "firebase/firestore";
import { useEffect, useState, Fragment, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MyContext } from "../App";

export default function ContactForm({ type, data }) {
    const { handleNewContact } = useContext(MyContext);
    const defaultState = {
        newContact: {
            fullName: data?.fullName ?? "",
            email: data?.email ?? "",
            phone: data?.phone ?? "",
            companyName: data?.companyName ?? ""
        },
        isLoading: false
    };

    const [state, setState] = useState(defaultState);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setState(state => ({
            ...state,
            newContact: { ...state.newContact, [name]: value }
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        const { fullName, email, phone, companyName } = state.newContact;
        if (
            fullName.length !== 0 &&
            email.length !== 0 &&
            phone.length !== 0 &&
            companyName.length !== 0
        ) {
            setState(state => ({
                ...state,
                isLoading: true
            }));
            try {
                setDoc(
                    doc(db, "users", state.newContact.email),
                    {
                        ...state.newContact
                    },
                    { merge: true }
                ).then(() => {
                    if (
                        type !== "add" &&
                        data?.email !== state.newContact?.email
                    ) {
                        deleteDoc(doc(db, "users", data?.email)).then(() => {
                            setState({
                                newContact: {
                                    fullName: "",
                                    email: "",
                                    phone: "",
                                    companyName: ""
                                },
                                isLoading: false
                            });

                            handleNewContact();
                        });
                    } else {
                        setState({
                            newContact: {
                                fullName: "",
                                email: "",
                                phone: "",
                                companyName: ""
                            },
                            isLoading: false
                        });
                        handleNewContact();
                    }
                });
            } catch (err) {
                console.log(err);
            }
        } else {
            alert("Please fill all the fields!");
        }
    };

    const allFieldsInfo = [
        {
            field: "fullName",
            label: "Full Name",
            placeholder: "Mary Jing",
            type: "text"
        },
        {
            field: "email",
            label: "Email",
            placeholder: "mary@gmail.com",
            type: "email"
        },
        {
            field: "phone",
            label: "Contact No",
            placeholder: "+222-340922",
            type: "text"
        },
        {
            field: "companyName",
            label: "Company Name",
            placeholder: "Aliot pvt",
            type: "text"
        }
    ];

    return (
        <div className=" p-2 rounded-md">
            <form className="grid grid-cols-2 gap-x-6 gap-y-3 ">
                {allFieldsInfo?.map(info => {
                    const { field, label, placeholder, type } = info;
                    return (
                        <div
                            key={field}
                            className="mb-1 sm:mb-2 col-span-2 sm:col-span-1"
                        >
                            <label
                                htmlFor={field}
                                className="text-sm inline-block mb-1 font-medium"
                            >
                                {label}
                            </label>
                            <input
                                required
                                placeholder={placeholder}
                                type="text"
                                className="flex-grow w-full h-12 px-4 mb-2 text-sm transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none  focus:outline-none focus:shadow-outline"
                                id={field}
                                name={field}
                                value={state.newContact[field]}
                                onChange={handleInputChange}
                            />
                        </div>
                    );
                })}

                <div className="mb-1 sm:mb-2 col-span-2">
                    {state.isLoading ? (
                        <button className="w-full text-sm inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded  bg-gray-900 focus:shadow-outline focus:outline-none">
                            <svg
                                aria-hidden="true"
                                class="mr-2 w-6 h-6 text-gray-600 animate-spin  fill-gray-50"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="w-full text-sm inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded  bg-gray-900 focus:shadow-outline focus:outline-none"
                        >
                            {type === "add" ? "Add Contact" : "Update Contact"}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
