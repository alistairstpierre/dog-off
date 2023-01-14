import { type NextPage } from "next";
import Head from "next/head";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import type Dog from "../interfaces";
import Choice from "../components/choice";
import Score from "../components/score";
import Link from "next/link";

const dogsDisplayed = 4;

const getDogs = async (amount: number) => {
  const savedDogs = [];
  for (let i = 0; i < amount; i++) {
    const image = await axios
      .get(`https://dog.ceo/api/breeds/image/random`)
      .then((res) => res.data.message);
    const name = image.split("/")[4];
    savedDogs.push({ name, image });
  }
  console.log(savedDogs);
  return savedDogs;
};

const Home: NextPage = ({ dogs, dogs2, initialDogIndex }: any) => {
  const [dogIndex, setDogIndex] = useState(initialDogIndex);
  const [storedDogs, setStoredDogs] = useState(dogs);
  const [nextDogs, setNextDogs] = useState(dogs2);
  const [loadingDogs, setLoadingDogs] = useState(false);
  const [score, setScore] = useState([] as Array<boolean>);

  if (storedDogs.length === 0) {
    return <div>Loading...</div>;
  }

  const newDogs = async (correct: boolean) => {
    if (!loadingDogs) {
      setLoadingDogs(true);
      setTimeout(() => {
        setScore([...score, correct]);
        setStoredDogs([...nextDogs]);
        setDogIndex(Math.floor(Math.random() * dogsDisplayed));
        setLoadingDogs(false);
      }, 2000);
      const savedDogs = [];
      for (let i = 0; i < dogsDisplayed; i++) {
        const image = await axios
          .get(`https://dog.ceo/api/breeds/image/random`)
          .then((res) => res.data.message);
        const name = image.split("/")[4];
        savedDogs.push({ name, image });
      }
      setNextDogs(savedDogs);
    }
  };

  const reset = () => {
    setScore([]);
  };

  return (
    <>
      <Head>
        <title>Dog Off</title>
        <meta name="description" content="The ultimate dog guessing game for dog lovers." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-800">
        <div className="laptop: flex w-[1024px] justify-center">
          {score.length >= 10 ? (
            <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl text-white">
                  You Scored: {score.filter(Boolean).length}!
                </h1>
                <Link href="/game/standard">
                  <div
                    className="flex rounded-lg h-16 w-32 cursor-pointer items-center justify-center bg-white text-black"
                  >
                    <p>Restart</p>
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div>
                {/* <h1>Send this link to challenge someone to the same dogs!</h1> */}
                {storedDogs.length > 0 && (
                  <>
                    <h1 className="pb-4 text-center text-4xl font-bold text-white">
                      Which dog is the {storedDogs[dogIndex].name}?
                    </h1>
                    <div className="flex flex-wrap justify-center">
                      {storedDogs.slice(0, 2).map((dog: Dog, index: number) => (
                        <Choice
                          key={index}
                          dog={dog}
                          callback={newDogs}
                          clickable={loadingDogs}
                          correct={
                            dog.name == storedDogs[dogIndex].name ? true : false
                          }
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap justify-center">
                      {storedDogs.slice(2, 4).map((dog: Dog, index: number) => (
                        <Choice
                          key={index}
                          dog={dog}
                          callback={newDogs}
                          clickable={loadingDogs}
                          correct={
                            dog.name == storedDogs[dogIndex].name ? true : false
                          }
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <Score score={score} />
            </>
          )}
        </div>
        {nextDogs.length > 0 && (
          <div className="hidden">
            {nextDogs.slice(0, 4).map((dog: Dog, index: number) => (
              <Image
                key={index}
                width={300}
                height={300}
                priority={true}
                alt={dog.name}
                src={dog.image}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export async function getStaticProps() {
  // Instead of fetching your `/api` route you can call the same
  // function directly in `getStaticProps`
  const dogs = await getDogs(dogsDisplayed);
  const dogs2 = await getDogs(dogsDisplayed);
  const initialDogIndex = Math.floor(Math.random() * dogs.length);

  // Props returned will be passed to the page component
  return { props: { dogs, dogs2, initialDogIndex } };
}

export default Home;
