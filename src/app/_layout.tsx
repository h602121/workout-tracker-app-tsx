import {Slot} from "expo-router";
import SessionProvider from "../context/sessionContext";

export default function RootLayout() {
    return(
        <SessionProvider>
        <Slot/>
        </SessionProvider>
    )
}