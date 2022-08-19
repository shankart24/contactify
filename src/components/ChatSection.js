import { db } from "../firebase";
import { addDoc, collection, getDocs, getDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState, Fragment, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ChatCard from "./ChatCard";

export default function ChatSection({ email, fromEmail }) {
	const defaultState = {
		allMessages: [],
		currentMessage: "",
	};
	const [state, setState] = useState(defaultState);

	async function fetchChatData() {
		const docRef = doc(db, "chats", fromEmail);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			const reqData = docSnap.data()?.messages[email];
			setState((state) => ({
				...state,
				allMessages: reqData ?? [],
			}));
		}
	}
	fetchChatData();

	const handleSubmit = (e) => {
		e.preventDefault();
		const currentMsg = `${fromEmail}___${state.currentMessage}___${Date.now()}`;
		const updatedMsgsData = [...state.allMessages, currentMsg];
		try {
			// Current user
			setDoc(
				doc(db, "chats", fromEmail),
				{
					messages: {
						[email]: updatedMsgsData,
					},
				},
				{ merge: true }
			);
			// Sent  user
			setDoc(
				doc(db, "chats", email),
				{
					messages: {
						[fromEmail]: updatedMsgsData,
					},
				},
				{ merge: true }
			);
		} catch (err) {
			console.log(err);
		}

		setState((state) => ({
			...state,
			currentMessage: "",
			allMessages: updatedMsgsData,
		}));
	};

	return (
		<div className="w-full h-full">
			<div className="py-2  relative h-full mx-auto rounded-md">
				<div className=" py-4  rounded-b-lg">
					<div>
						{state?.allMessages?.length !== 0 ? (
							<>
								{state?.allMessages?.slice(0, state.allMessages.length - 1).map((msg) => {
									return (
										<div key={msg}>
											<ChatCard
												{...{
													chatString: msg,
													currentUser: fromEmail,
												}}
											/>
										</div>
									);
								})}

								<ChatCard
									{...{
										chatString: state?.allMessages[state.allMessages.length - 1],
										currentUser: fromEmail,
									}}
								/>
							</>
						) : (
							<div className="text-sm font-medium px-4 py-4">No messages yet</div>
						)}
					</div>

					<div className="mt-4 p-2 flex  ">
						<div className="w-full">
							<input
								id="message"
								name="message"
								type="text"
								placeholder="Your Message..."
								value={state.currentMessage}
								onChange={(e) =>
									setState({
										...state,
										currentMessage: e.target.value,
									})
								}
								className="w-full appearance-none border border-gray-300  block px-3 py-4  rounded-l-md bg-gray-50 placeholder-gray-500 focus:outline-none  focus:ring-primary-600 focus:border-primary-600 sm:text-sm"
							/>
						</div>
						<div className="bg-primary rounded-r-md">
							<button
								onClick={handleSubmit}
								className="w-full flex justify-center h-full items-center px-6 rounded-r-md shadow-sm text-sm font-medium bg-gray-900 text-white  focus:outline-none"
							>
								Send
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
