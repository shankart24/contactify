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
import ContactForm from "./ContactForm";
import ChatSection from "./ChatSection";

export default function ContactsTable() {
    const { state, setState } = useContext(MyContext);
    return (
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            {[
                                "Full Name",
                                "Email",
                                "Contact No",
                                "Company Name",
                                "Chat",
                                "Edit",
                                "Delete"
                            ].map(item => (
                                <th
                                    key={item}
                                    scope="col"
                                    className="px-5 py-3 bg-gray-100  border-b border-gray-200 text-gray-800 whitespace-nowrap text-left text-sm "
                                >
                                    {item}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(state.allUsers).map((userEmail, index) => {
                            return (
                                state.selectedUser !== userEmail && (
                                    <ContactRow
                                        key={userEmail}
                                        {...{
                                            data: state.allUsers[userEmail],
                                            fromEmail: state.selectedUser
                                        }}
                                    />
                                )
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const ContactRow = ({ data, fromEmail }) => {
    const { handleNewContact } = useContext(MyContext);
    const { fullName, phone, email, companyName } = data;
    const [state, setState] = useState({
        showChatModal: false,
        showEditModal: false,
        isDeleting: false
    });

    const handleDeleteContact = () => {
        handleSetState("isDeleting", true);
        try {
            deleteDoc(doc(db, "users", email)).then(() => {
                handleSetState("isDeleting", false);
                handleNewContact();
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleSetState = (field, bool) => {
        setState(state => ({ ...state, [field]: bool }));
    };

    return (
        <>
            <tr key={email}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm ">
                    <p className="text-gray-900 whitespace-no-wrap ">
                        {fullName}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{email}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{phone}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {companyName}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 hover:text-gray-700 cursor-pointer whitespace-no-wrap">
                        <svg
                            onClick={() =>
                                handleSetState("showChatModal", true)
                            }
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 hover:text-gray-700 cursor-pointer whitespace-no-wrap">
                        <svg
                            onClick={() =>
                                handleSetState("showEditModal", true)
                            }
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path
                                fillRule="evenodd"
                                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 hover:text-gray-700 cursor-pointer whitespace-no-wrap">
                        {state.isDeleting ? (
                            <svg
                                aria-hidden="true"
                                className=" w-5 h-5 text-red-700 animate-spin  fill-gray-50"
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
                        ) : (
                            <svg
                                onClick={handleDeleteContact}
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-red-700"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </p>
                </td>
            </tr>

            <Transition appear show={state.showEditModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 bg-gray-900 bg-opacity-70 overflow-y-auto"
                    onClose={() => handleSetState("showEditModal", false)}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-2xl p-4  overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                                <ContactForm {...{ type: "edit", data }} />
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>

            <Transition.Root show={state.showChatModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 overflow-hidden z-50"
                    onClose={() => handleSetState("showChatModal", false)}
                >
                    <div className="absolute inset-0 overflow-hidden">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-in-out duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in-out duration-500"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <div className="pointer-events-auto relative w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                        <div className="px-4  flex items-center justify-between">
                                            <Dialog.Title className="text-lg my-2 leading-6 font-bold  text-primary">
                                                Chat with {fullName}
                                            </Dialog.Title>
                                            <button
                                                type="button"
                                                className="rounded-md text-gray-400 hover:text-gray-600  focus:outline-none "
                                                onClick={() =>
                                                    handleSetState(
                                                        "showChatModal",
                                                        false
                                                    )
                                                }
                                            >
                                                <span className="sr-only">
                                                    Close panel
                                                </span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="relative  flex-1 ">
                                            <ChatSection
                                                {...{ email, fromEmail }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
};
