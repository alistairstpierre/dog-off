import Image from "next/image";

interface ScoreProps {
  score: Array<boolean>;
}

const Score = ({ score }: ScoreProps) => {
  return (
    <>
      <div className="ml-8 mr-4">
        <h1 className="text-center text-2xl text-green-800 font-black">{score.filter(Boolean).length}</h1>
        <h1 className="text-center text-2xl text-red-800">{score.filter((item) => !Boolean(item)).length}</h1>
      </div>
      <div className="flex w-12 flex-col items-center gap-2 rounded-lg bg-white p-2">
        {score.map((correct, index) => {
          const bgColor = correct ? "bg-green-100" : "bg-red-100";
          return (
            <div
              key={index}
              className={`h-8 w-8 rounded-sm ${bgColor} flex items-center justify-center`}
            >
              <Image
                width={20}
                height={20}
                alt={"score"}
                src={correct ? "/score_correct.svg" : "/score_wrong.svg"}
                className="fill-green-800"
              />
            </div>
          );
        })}
      </div>
      ;
    </>
  );
};

export default Score;
