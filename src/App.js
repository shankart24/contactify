import { db } from "./firebase";
import {
    addDoc,
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot
} from "firebase/firestore";
import {
    useEffect,
    useState,
    Fragment,
    createContext,
    useCallback
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import ChatCard from "./components/ChatCard";
import Navbar from "./components/Navbar";
import ContactsTable from "./components/ContactsTable";
import ContactForm from "./components/ContactForm";

export const MyContext = createContext();

export default function App() {
    const [state, setState] = useState({
        allUsers: {},
        selectedUser: "",
        isLoading: false,
        showContactModal: false,
        contactUpdated: false
    });

    async function fetchAllUsers() {
        setState(state => ({ ...state, isLoading: true }));
        const usersRef = await getDocs(collection(db, "users"));
        const data = usersRef.docs.map(doc => doc.data());
        const allUsers = {};
        data.forEach(user => {
            allUsers[user.email] = { ...user };
        });
        setState(state => ({
            ...state,
            allUsers,
            selectedUser:
                state.selectedUser?.length === 0
                    ? data?.[0]?.email
                    : state.selectedUser,
            isLoading: false
        }));
    }

    const handleNewContact = () => {
        setState(state => ({
            ...state,
            contactUpdated: !state.contactUpdated,
            showContactModal: false
        }));
    };

    useEffect(() => {
        try {
            fetchAllUsers();
        } catch (err) {
            console.log(err);
        }
    }, [state.contactUpdated]);

    return (
        <>
            <MyContext.Provider value={{ state, setState, handleNewContact }}>
                <section className="">
                    <Navbar />

                    <div className="max-w-7xl mx-auto mt-8 px-3 sm:px-8">
                        <button
                            onClick={() =>
                                setState(state => ({
                                    ...state,
                                    showContactModal: true
                                }))
                            }
                            className="tracking-tight max-w-sm text-sm inline-flex items-center justify-center h-10 px-3 font-medium  text-gray-900 hover:bg-gray-100 transition duration-200 rounded border border-gray-900 focus:shadow-outline focus:outline-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Add Contact
                        </button>
                    </div>

                    <div className="px-4 sm:px-8 max-w-7xl mx-auto ">
                        <div className="py-6">
                            {state.isLoading ? (
                                <div className="flex justify-center items-center h-44">
                                    <svg
                                        aria-hidden="true"
                                        className="mr-2 w-7 h-7 text-gray-900 animate-spin  fill-gray-50"
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
                                </div>
                            ) : (
                                <>
                                    {Object.keys(state.allUsers)?.length > 1 ? (
                                        <ContactsTable />
                                    ) : (
                                        <p className="tracking-tighter text-md text-center  text-gray-400">
                                            No contacts to show
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <Transition
                        appear
                        show={state.showContactModal}
                        as={Fragment}
                    >
                        <Dialog
                            as="div"
                            className="fixed inset-0 z-10 bg-gray-900 bg-opacity-70 overflow-y-auto"
                            onClose={() =>
                                setState(state => ({
                                    ...state,
                                    showContactModal: false
                                }))
                            }
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
                                        <ContactForm
                                            {...{ type: "add", data: {} }}
                                        />
                                    </div>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition>
                </section>
            </MyContext.Provider>
        </>
    );
}
