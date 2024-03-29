import Head from "next/head";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import type Dog from "../../interfaces";
import Choice from "../../components/choice";
import Score from "../../components/score";
import type { DogQuery } from "../../interfaces";
import seedrandom from "seedrandom";
import { FacebookShareButton, FacebookIcon, LineIcon, LineShareButton, RedditShareButton, RedditIcon, TelegramShareButton, TelegramIcon, TumblrShareButton, TumblrIcon, TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, WeiboShareButton, WeiboIcon } from "next-share";
import Link from "next/link";

interface PageProps {
  gameDogs: any;
  dogs1: Dog[];
  dogs2: Dog[];
  queries: DogQuery[];
  challenge: string;
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
    } catch (e) {
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

const Standard = ({
  gameDogs,
  dogs1,
  dogs2,
  queries,
  challenge,
}: PageProps) => {
  //   const parsedDogs = parseDogs(dogs);
  const [dogQueries, setDogQueries] = useState(queries);
  const [dogIndex, setDogIndex] = useState(0);
  const [storedDogs, setStoredDogs] = useState(dogs1);
  const [nextDogs, setNextDogs] = useState(dogs2);
  const [loadingDogs, setLoadingDogs] = useState(false);
  const [score, setScore] = useState([] as Array<boolean>);
  const [queryIndex, setQueryIndex] = useState(8);
  const [challengeLink, setChallengeLink] = useState(challenge);

  const newDogs = async (correct: boolean) => {
    if (!loadingDogs) {
      setLoadingDogs(true);
      setTimeout(() => {
        setScore([...score, correct]);
        setStoredDogs([...nextDogs]);
        setDogIndex(dogIndex + dogsDisplayed);
        setLoadingDogs(false);
      }, 2000);
      const savedDogs = await getDogs(dogQueries, queryIndex, dogsDisplayed);
      setQueryIndex(queryIndex + dogsDisplayed);
      setNextDogs(savedDogs);
    }
  };

  const reset = async () => {
    setScore([]);
    const rngString = Math.random().toString(36).substring(2, 10);
    const rng = seedrandom(rngString);
    setDogQueries(getQueries(gameDogs, rng));
    const dogs1 = await getDogs(dogQueries, 0, dogsDisplayed);
    setStoredDogs(dogs1);
    const dogs2 = await getDogs(dogQueries, 4, dogsDisplayed);
    setNextDogs(dogs2);
    setDogIndex(0);
    const challengeL = `https://dogoff.co/game/standard/${rngString}`;
    setChallengeLink(challengeL);
  };

  return (
    <>
      <Head>
      <title>Dog Off</title>
        <meta name="description" content="The ultimate dog guessing game." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-800">
        <div className="laptop: flex w-[1024px] justify-center min-h-[500px] bg-slate-700 p-10 rounded-3xl">
          {score.length >= 10 ? (
            <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl text-white">
                  You Scored: {score.filter(Boolean).length}/10!
                </h1>
                <p className="text-white text-center">Share to challenge someone to the same dogs!</p>
                <div className="flex justify-center">
                  <FacebookShareButton
                    url={`${challengeLink}`}
                    quote={'Can you identify dogs breeds better than the average dog lover?'}
                    hashtag={'#dogoff'}
                  >
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <LineShareButton
                    url={`${challengeLink}`}
                    title={'Can you identify dogs breeds better than the average dog lover?'}
                  >
                    <LineIcon size={32} />
                  </LineShareButton>
                  <RedditShareButton
                    url={`${challengeLink}`}
                    title={'Can you identify dogs breeds better than the average dog lover?'}
                  >
                    <RedditIcon size={32} round />
                  </RedditShareButton>
                  <TelegramShareButton
                    url={`${challengeLink}`}
                    title={'Can you identify dogs breeds better than the average dog lover?'}
                  >
                    <TelegramIcon size={32} round />
                  </TelegramShareButton>
                  <TumblrShareButton
                    url={`${challengeLink}`}
                    title={'Can you identify dogs breeds better than the average dog lover?'}
                    tags={['#dogoff', '#dogchallenge']}
                  >
                    <TumblrIcon size={32} round />
                  </TumblrShareButton>
                  <TwitterShareButton
                    url={`${challengeLink}`}
                    title={'Can you identify dogs breeds better than the average dog lover?'}
                    hashtags={['#dogoff', '#dogchallenge']}
                  >
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <WhatsappShareButton
                    url={`${challengeLink}`}
                    title={'Can you identify dogs breeds better than the average dog lover?'}
                    separator=":: "
                  >
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                  <WeiboShareButton
                    url={`${challengeLink}`}
                    title={'你是否比普通的狗爱好者更擅长识别狗的品种？'}
                  >
                    <WeiboIcon size={32} round />
                  </WeiboShareButton>
                </div>
                <Link href={challengeLink}><p className="text-blue-500 text-center">{challengeLink}</p></Link>
                <div
                  onClick={reset}
                  className="flex h-16 w-32 rounded-lg cursor-pointer items-center justify-center bg-white text-black"
                >
                  <p>Restart</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div>
                {storedDogs.length > 0 && (
                  <>
                    <h1 className="pb-4 text-center text-4xl font-bold text-white">
                      Which dog is the {dogQueries[dogIndex]?.name}?
                    </h1>
                    <div className="flex flex-wrap justify-center">
                      {storedDogs.slice(0, 2).map((dog: Dog, index: number) => (
                        <Choice
                          key={index}
                          dog={dog}
                          callback={newDogs}
                          clickable={loadingDogs}
                          correct={
                            dog.name == dogQueries[dogIndex]?.name
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
                            dog.name == dogQueries[dogIndex]?.name
                              ? true
                              : false
                          }
                        />
                      ))}
                    </div>
                  </>
                )}
                <p className="text-white text-center">Share to challenge someone to the same dogs!</p>
                <div className="flex justify-center">
                  <FacebookShareButton
                    url={`${challengeLink}`}
                    quote={'Can you identify dogs breeds better than the average dog lover?'}
                    hashtag={'#dogoff'}
                  >
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <LineShareButton
                    url={`${challengeLink}`}
                    title={'Can you identify dogs breeds better than the average dog lover?'}
                  >
                    <LineIcon size={32} />
                  </LineShareButton>
                  <RedditShareButton
                    url={`${challengeLink}`}
                    title={'Can you identify dogs breeds better than the average dog lover?'}
                  >
                    <RedditIcon size={32} round />
                  </RedditShareButton>
                  <TelegramShareButton
                    url={`${challengeLink}`}
                    title={'Can you identify dogs breeds better than the average dog lover?'}
                  >
                    <TelegramIcon size={32} round />
                  </TelegramShareButton>
                  <TumblrShareButton
                    url={`${challengeLink}`}
                    title={'Can you identify dogs breeds better than the average dog lover?'}
                    tags={['#dogoff', '#dogchallenge']}
                  >
                    <TumblrIcon size={32} round />
                  </TumblrShareButton>
                  <TwitterShareButton
                    url={`${challengeLink}`}
                    title={'Can you identify dogs breeds better than the average dog lover?'}
                    hashtags={['#dogoff', '#dogchallenge']}
                  >
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <WhatsappShareButton
                    url={`${challengeLink}`}
                    title={'Can you identify dogs breeds better than the average dog lover?'}
                    separator=":: "
                  >
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                  <WeiboShareButton
                    url={`${challengeLink}`}
                    title={'你是否比普通的狗爱好者更擅长识别狗的品种？'}
                  >
                    <WeiboIcon size={32} round />
                  </WeiboShareButton>
                </div>
                <Link href={challengeLink}><p className="text-blue-500 text-center">{challengeLink}</p></Link>
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

export async function getServerSideProps() {
  // Fetch data from external API
  const dogList: DogListProps[] = await getDogList();
  const gameDogs = getGameDogList(dogList);
  const rngString = Math.random().toString(36).substring(2, 10);
  const rng = seedrandom(rngString)
  const queries = getQueries(gameDogs, rng);
  const dogs1 = await getDogs(queries, 0, dogsDisplayed);
  const dogs2 = await getDogs(queries, 4, dogsDisplayed);
  const challenge = `https://dogoff.co/game/standard/${rngString}`;

  // Props returned will be passed to the page component
  return { props: { dogs1, dogs2, queries, challenge, gameDogs } };
}

export default Standard;
