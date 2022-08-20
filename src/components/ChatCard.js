import React from "react";

export default function ChatCard({ chatString, currentUser }) {
    const [author, message, sentOn] = chatString.split("___");

    return (
        <div
            className={`${
                author === currentUser ? "justify-end" : "justify-start"
            } w-full flex mb-3`}
        >
            <div className="w-full sm:w-1/2 md:w-1/2   mx-4 rounded-lg whitespace-normal text-md tracking-tight text-gray-900 overflow-auto">
                <div className="text-sm bg-gray-200 text-gray-900 font-medium px-3 pt-2">
                    {message}
                </div>
                <div className="bg-gray-200  flex items-center justify-between  px-2 pb-2">
                    <div
                        className={`${
                            chatString.split("___").length === 2
                                ? "hidden"
                                : "visible"
                        } flex flex-col items-end w-full text-xs  font-medium text-gray-500`}
                    >
                        <div className="text-[0.6rem] mt-1">
                            <span className="float-right">
                                {" "}
                                {displayDate(Number(sentOn))}
                            </span>
                            <br />
                            <span className="mr-1 text-gray-900 font-medium">
                                {author === currentUser ? "Sent:" : ""}
                            </span>
                            {new Date(Number(sentOn)).toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const displayDate = theDate => {
    const dt = new Date(theDate);
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    const month = dt.getMonth();
    const day = dt.getDate();
    const year = dt.getFullYear();
    return `${monthNames[month]} ${day}`;
};
