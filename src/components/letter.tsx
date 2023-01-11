import type Dog from "../interfaces";
import Result from "./result";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LetterProps {
    letter: string;
    guessed: boolean;
}

const Letter = ({ letter, guessed }: LetterProps) => {
    const visible = guessed ? "visible" : "invisible";

    return (
        <div className="border-b-2 border-black w-5 text-2xl font-bold uppercase">
            <p className={`${visible}`}>
                {letter}
            </p>
        </div>
    );
};

export default Letter;