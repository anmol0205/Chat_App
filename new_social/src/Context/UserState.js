import React, { useState } from "react";
import UserContext from "./UserContext";

const UserState = ({children}) => {
    const [data, setData] = useState({ name: "dadsdad" });

    const update = (newData) => {
        setData(newData);
    };

    return (
        <UserContext.Provider value={{data , update}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserState;
