import type Dog from "../interfaces";
import Result from "./result";
import Image from "next/image";
import { useEffect, useState } from "react";

// Create a tsx component and return it
interface ChoiceProps {
    dog: Dog;
    correct: boolean;
    callback: (correct:boolean) => void;
    key: number;
    clickable: boolean;
}  

const Choice = ({dog, correct, callback ,clickable}: ChoiceProps) => {
    const [resultState, setResultState] = useState(false);
    const showResult = () => {
        setResultState(true);
    }

    useEffect(() => {
        setResultState(false);
    }, [dog]);

    return (
        <div className="flex flex-col mx-2 my-1 hover:outline hover:outline-4 hover:outline-white rounded-lg">
            <Image
                width={300}
                height={300}
                alt={dog.name}
                src={dog.image}
                className="h-48 w-64 cursor-pointer rounded-lg object-cover"
                onClick={() => {
                    if(!clickable) {
                        showResult();
                        callback(correct);
                    }
                }}
            />
            {resultState && <Result text={dog.name} correct={correct}/>}
        </div>
    );
};

export default Choice;