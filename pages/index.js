import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {
  // Don't retry more than 20 times
  const maxRetries = 20;

  const [input, setInput] = useState('');
  const [inputArtist, setInputArtist] = useState('');
  const [inputMedium, setInputMedium] = useState('');
  const [inputVibe, setInputVibe] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [inputConceptArt, setInputConceptArt] = useState('');
  const [inputCartoon, setInputCartoon] = useState('');
  const [inputFantasy, setInputFantasy] = useState('');

  const [img, setImg] = useState(''); 
  // Numbers of retries 
  const [retry, setRetry] = useState(0);
  // Number of retries left
  const [retryCount, setRetryCount] = useState(maxRetries);
  // Add isGenerating state
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState('');

  // Add this function
  const conceptArt = () => {
    console.log("Concept Art");
    setInputConceptArt('Concept Art');
  };

  const cartoon = () => {
    console.log("Cartoon");
    setInputCartoon('Cartoon');
  };

  const fantasy = () => {
    console.log("Fantasy");
    setInputFantasy('Fantasy');
  };

  const onChangeArtist = (event) => {
    setInputArtist(event.target.value);
  };
  const onChangeMedium = (event) => {
    setInputMedium(event.target.value);
  };
  const onChangeVibe = (event) => {
    setInputVibe(event.target.value);
  };
  const onChangeDescription = (event) => {
    setInputDescription(event.target.value);
  };
 


  // Add generateAction
  const generateAction = async () => {
    console.log('Generating...');

    const input = "A man named Minhka" + inputConceptArt + inputCartoon + inputFantasy + ", " + inputArtist + ", " + inputMedium + ", " + inputVibe + ", " + inputDescription;
    
    // Add this check to make sure there is no double click
    if (isGenerating && retry === 0) return;
    // Set loading has started
    setIsGenerating(true);

    // If this is a retry request, take away retryCount
    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });

      setRetry(0);
    }

  
    // Add the fetch request
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ input  }),
    });
  
    const data = await response.json();
    // If model still loading, drop that retry time
    if (response.status === 503) {
      // Set the estimated_time property in state
      setRetry(data.estimated_time);
      return;
    }

    // If another error, drop error
    if (!response.ok) {
      console.log(`Error: ${data.error}`);
      // Stop loading
      setIsGenerating(false);
      return;
    }

    // Set final prompt here
    setFinalPrompt(input);
    // Remove content from input box
    setInput('');
    // Set image data into state property
    setImg(data.image);
    // Everything is all done -- stop loading!
    setIsGenerating(false);
  };

  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  // Add useEffect here
  useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(`Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`);
        setRetryCount(maxRetries);
        return;
        }

      console.log(`Trying again in ${retry} seconds.`);

      await sleep(retry * 1000);

      await generateAction();
    };

    if (retry === 0) {
      return;
    }

    runRetry();
  }, [retry]);

  return (
    <div className="root">
      <Head>
        <title>AMAZING PICTURE and 😂🤣😁  | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>AMAZING PICTURE and 😂🤣😁</h1>
          </div>
          <div className="header-subtitle">
            <h2>Do you want to see me and 🤣 every day?</h2>
          </div>
          {/* Add prompt container here */}
          <div className="prompt-container">
            
            <div className="art-genre">
              <div>
                <button onClick={conceptArt}>Concept Art</button>
                <p className="art-genre-p">{inputConceptArt}</p>
              </div>
              <div>
                <button onClick={cartoon}>Cartoon</button>
                <p className="art-genre-p">{inputCartoon}</p>
              </div>
              <div>
                <button onClick={fantasy}>Fantasy</button>
                <p className="art-genre-p">{inputFantasy}</p>
              </div>
            </div>
            

            <div> 
              <p className="title">Artist </p>
              <input className="prompt-box" value={inputArtist} onChange={onChangeArtist} placeholder="Type the artists you like: Van Gogh, Picasso, Akira Toriyama... "/>
            </div>
            
            <div> 
              <p className="title">Medium </p>
              <input className="prompt-box" value={inputMedium} onChange={onChangeMedium} placeholder="Acrylic, watercolor, microsoft paint, pixel art, illustration, 3D..." />
            </div>

            <div> 
              <p className="title">Vibe </p>
              <input className="prompt-box" value={inputVibe} onChange={onChangeVibe} placeholder="Smile, laugh, haha, wow wow, amazing... " />
            </div>

            <div> 
              <p className="title">Descriptors </p>
              <input className="prompt-box" value={inputDescription} onChange={onChangeDescription} placeholder="1990s, stone age, ancient, summer, halloween, hyper-realistic, detailed..."/>
            </div>

            <div className="prompt-buttons">
              {/* Tweak classNames to change classes */}
              <a
                className={
                  isGenerating ? 'generate-button loading' : 'generate-button'
                }
                onClick={generateAction}
              >
                {/* Tweak to show a loading indicator */}
                <div className="generate">
                  {isGenerating ? (
                      <span className="loader"></span>
                  ) : (
                    <p>Generate</p>
                  )}
                </div>
              </a>
            </div>
            <div>{isGenerating && <p classname="notification">Wait 1-3 minutes to get a amazing picture (only first picture)</p>}</div>
          </div>
        </div>
        {/* Add output container */}
        {img && (
          <div className="output-content">
            <Image src={img} width={512} height={512} alt={input} />
            {/* Add prompt here */}
            <p>{finalPrompt}</p>
          </div>
        )}
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-avatar"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
