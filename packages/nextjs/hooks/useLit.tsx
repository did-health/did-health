import {
    createContext,
    FunctionComponent,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

const LitClientContext = createContext({
    litNodeClient: null as any,
    litConnected: false,
});

export const LitProvider: FunctionComponent<{
    children?: React.ReactNode;
}> = ({ children }) => {
    const client = useMemo(

        () => new LitNodeClient({ debug: false }),
        []
    );
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        client
            .connect()
            .then(() => {
                {
                    setConnected(true);
                }
            })
            .catch(() =>
                alert(
                    "Failed connecting to Lit network! Refresh the page to try again."
                )
            );
    }, [client]);

    return (
        <LitClientContext.Provider
            value={{ litNodeClient: client, litConnected: connected }}
        >
            {children}
        </LitClientContext.Provider>
    );
};

export default function useLit() {
    return useContext(LitClientContext);
}