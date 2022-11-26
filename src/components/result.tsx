// Create a tsx component and return it
interface ResultProps {
    text: string;
    correct: boolean;
}  

const Result = ({text, correct}: ResultProps) => {
    const txtColor = correct ? "text-green-800" : "text-red-800";
    const bgColor = correct ? "bg-green-200" : "bg-red-200";

    return (
        <div className="background-white">
            <h1 className={`text-xl ${txtColor} text-center p-2 ${bgColor} rounded-b-lg`}>{text}</h1>
        </div>
    );
};

export default Result;