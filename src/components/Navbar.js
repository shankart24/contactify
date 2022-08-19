import { useState, useContext } from "react";
import { MyContext } from "../App";

export default function Navbar() {
	const { state, setState } = useContext(MyContext);
	return (
		<nav className="bg-gray-100">
			<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 ">
				<div className="relative flex items-center justify-between h-20 ">
					<div className="flex items-center justify-center sm:items-stretch sm:justify-start ">
						<h1 className="text-2xl tracking-tighter font-semibold">Contactify</h1>
					</div>
					<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
						<div className="ml-3 relative">
							<div>
								<button
									onClick={() => {
										setState((state) => ({ ...state, viewDropdown: !state.viewDropdown }));
									}}
									type="button"
									className="flex text-sm rounded-full focus:outline-none  items-center"
									id="user-menu-button"
									aria-expanded="false"
									aria-haspopup="true"
								>
									<span className="sr-only">Open user menu</span>
									<img
										className="hidden sm:block h-8 w-8 rounded-full"
										src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
										alt=""
									/>
									<h2 className="text-md tracking-tight font-medium ml-2">{state.selectedUser}</h2>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className={`${state.viewDropdown ? "rotate-180" : ""} transition-transform h-5 w-5`}
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
							</div>

							{state.viewDropdown && (
								<div
									className="transition-all origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg py-1 bg-white  focus:outline-none"
									role="menu"
									aria-orientation="vertical"
									aria-labelledby="user-menu-button"
									tabindex="-1"
								>
									{Object.keys(state.allUsers).map((userEmail) => {
										const fullName = state.allUsers[userEmail]?.fullName;
										return (
											<>
												{state.selectedUser !== userEmail && (
													<a
														key={userEmail}
														onClick={() =>
															setState((state) => ({
																...state,
																selectedUser: userEmail,
																viewDropdown: false,
															}))
														}
														className="cursor-pointer hover:bg-gray-50 block px-4 py-2 text-sm text-gray-700"
													>
														{fullName}
													</a>
												)}
											</>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
