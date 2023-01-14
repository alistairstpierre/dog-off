import { type NextPage } from "next";
import Head from "next/head";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import type Dog from "../../../interfaces";
import Choice from "../../../components/choice";
import Score from "../../../components/score";
import { useRouter } from "next/router";
import { DogQuery } from "../../../interfaces";
import seedrandom from "seedrandom";
import { FacebookShareButton, FacebookIcon, LineIcon, LineShareButton, RedditShareButton, RedditIcon, TelegramShareButton, TelegramIcon, TumblrShareButton, TumblrIcon, TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, WeiboShareButton, WeiboIcon } from "next-share";
import Link from "next/link";
import Share from "../../../components/share";

interface PageProps {
  dogs1: Dog[];
  dogs2: Dog[];
  queries: DogQuery[];
  challengeLink: string;
}

const dogsDisplayed = 4;

const getDogs = async (queries: DogQuery[], index: number, amount: number) => {
  const savedDogs = [];
  for (let i = index; i < index + amount; i++) {
    try {
        const image = await axios
        .get(`${queries[i]?.query}`)
        .then((res) => res.data.message);
      const name = image.split("/")[4];
      savedDogs.push({ name, image });
    }catch (e) {
        console.log(e);
    }
  }
  const shuffled = savedDogs
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    console.log(shuffled);
  return shuffled;
};

const StandardChallenge = ({
  dogs1,
  dogs2,
  queries,
  challengeLink,
}: PageProps) => {
  //   const parsedDogs = parseDogs(dogs);
  const [dogIndex, setDogIndex] = useState(0);
  const [storedDogs, setStoredDogs] = useState(dogs1);
  const [nextDogs, setNextDogs] = useState(dogs2);
  const [loadingDogs, setLoadingDogs] = useState(false);
  const [score, setScore] = useState([] as Array<boolean>);
  const [queryIndex, setQueryIndex] = useState(8);

  const newDogs = async (correct: boolean) => {
    if (!loadingDogs) {
      setLoadingDogs(true);
      setTimeout(() => {
        setScore([...score, correct]);
        setStoredDogs([...nextDogs]);
        setDogIndex(dogIndex + dogsDisplayed);
        setLoadingDogs(false);
      }, 2000);
      const savedDogs = await getDogs(queries, queryIndex, dogsDisplayed);
      setQueryIndex(queryIndex + dogsDisplayed);
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
        <meta name="description" content="The ultimate dog guessing game." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-800">
        <div className="flex w-[320px] tablet:w-[640px] laptop:w-[1024px] justify-center min-h-[500px] tablet:bg-slate-700 py-10 my-4 rounded-3xl">
          {score.length >= 10 ? (
            <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl text-white">
                  You Scored: {score.filter(Boolean).length}/10!
                </h1>
                <Share url={challengeLink} quote={`I got ${score.filter(Boolean).length}/10! Can you identify dogs breeds better than me?`}/>
                <Link href="/">
                    <div
                    className="flex h-16 w-32 rounded-lg cursor-pointer items-center justify-center bg-white text-black"
                    >
                    <p>Restart</p>
                    </div>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div>
                {storedDogs.length > 0 && (
                  <>
                    <h1 className="pb-4 text-center text-2xl tablet:text-4xl font-bold text-white">
                      Which dog is the {queries[dogIndex]?.name}?
                    </h1>
                    <div className="flex flex-wrap justify-center">
                      {storedDogs.slice(0, 2).map((dog: Dog, index: number) => (
                        <Choice
                          key={index}
                          dog={dog}
                          callback={newDogs}
                          clickable={loadingDogs}
                          correct={
                            dog.name == queries[dogIndex]?.name
                              ? true
                              : false
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
                            dog.name == queries[dogIndex]?.name
                              ? true
                              : false
                          }
                        />
                      ))}
                    </div>
                  </>
                )}
              <Share url={challengeLink} quote="Can you identify dogs breeds better than the average dog lover?"/>
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

const getDogList = async () => {
  const savedDogs: DogListProps[] = await axios
    .get(`https://dog.ceo/api/breeds/list/all`)
    .then((res) => res.data.message);
  return savedDogs;
};

interface DogListProps {
  [key: string]: Array<string>;
}

const getGameDogList = (dogList: any) => {
  const gameDogsList = [];
  for (const property in dogList) {
    if (dogList[property].length > 0) {
      for (let i = 0; i < dogList[property].length; i++) {
        gameDogsList.push(`${property}/${dogList[property][i]}`);
      }
    } else {
      gameDogsList.push(`${property}`);
    }
  }
  return gameDogsList;
};

const getQueries = (gameDogsList: any, rng: seedrandom.PRNG) => {
  const queries = [];
  const dogSet = new Set<number>();
  while (dogSet.size < 40) {
    dogSet.add(Math.floor(rng() * gameDogsList.length));
  }
  for (const dog of dogSet) {
    queries.push({
      index: dog,
      name: gameDogsList[dog].replace("/", "-"),
      query: `https://dog.ceo/api/breed/${gameDogsList[dog]}/images/random`,
    });
  }
  return queries;
};

export async function getServerSideProps(context: { query: { dogs: any } }) {
  const dogs = context.query.dogs;
  console.log("dogs", dogs);
  // Fetch data from external API
  const dogList: DogListProps[] = await getDogList();
  const gameDogs = getGameDogList(dogList);
  const rng = seedrandom(dogs)
  const queries = getQueries(gameDogs, rng);
  const dogs1 = await getDogs(queries, 0, dogsDisplayed);
  const dogs2 = await getDogs(queries, 4, dogsDisplayed);
  const challengeLink = `https://dogoff.co/game/standard/${dogs}`;
  
  // Props returned will be passed to the page component
  return { props: { dogs1, dogs2, queries, challengeLink } };
}

export default StandardChallenge;
