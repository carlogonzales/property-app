import ClipLoader from "react-spinners/ClipLoader";


const overide = {
    display: "block",
    margin: "100px auto"
};

const LoadingPage = ({loading})=> {
    return (
        <ClipLoader
            color={"#3b82f6"}
            loading={loading}
            cssOverride={overide}
            size={150}
            aria-label="Loading Spinner" />

    );
};

export default LoadingPage;