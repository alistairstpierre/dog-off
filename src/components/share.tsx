import type Dog from "../interfaces";
import { useEffect, useState } from "react";
import { FacebookShareButton, FacebookIcon, LineIcon, LineShareButton, RedditShareButton, RedditIcon, TelegramShareButton, TelegramIcon, TumblrShareButton, TumblrIcon, TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, WeiboShareButton, WeiboIcon } from "next-share";
import Link from "next/link";

// Create a tsx component and return it
interface ShareProps {
    url: string;
    quote: string;
}  

const Share = ({url, quote}: ShareProps) => {
    return (
        <div className="p-2">
        <p className="text-white text-center">Share to challenge someone to the same dogs!</p>
        <div className="flex justify-center">
          <FacebookShareButton
            url={`${url}`}
            quote={`${quote}`}
            hashtag={'#dogoff'}
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <LineShareButton
            url={`${url}`}
            title={`${quote}`}
          >
            <LineIcon size={32} />
          </LineShareButton>
          <RedditShareButton
            url={`${url}`}
            title={`${quote}`}
          >
            <RedditIcon size={32} round />
          </RedditShareButton>
          <TelegramShareButton
            url={`${url}`}
            title={`${quote}`}
          >
            <TelegramIcon size={32} round />
          </TelegramShareButton>
          <TumblrShareButton
            url={`${url}`}
            title={`${quote}`}
            tags={['#dogoff', '#dogchallenge']}
          >
            <TumblrIcon size={32} round />
          </TumblrShareButton>
          <TwitterShareButton
            url={`${url}`}
            title={`${quote}`}
            hashtags={['#dogoff', '#dogchallenge']}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton
            url={`${url}`}
            title={`${quote}`}
            separator=":: "
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <WeiboShareButton
            url={`${url}`}
            title={'你是否比普通的狗爱好者更擅长识别狗的品种？'}
          >
            <WeiboIcon size={32} round />
          </WeiboShareButton>
        </div>
        <Link href={url}><p className="text-blue-500 text-center">{url}</p></Link>
      </div>
    );
};

export default Share;