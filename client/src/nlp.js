const CLIENT_TOKEN = 'LWHBAEALMXLLXSMQQAKKSHUYSQVOPVAP';

function getRequestBody(audioFile)
{
    console.log(audioFile);
    return {
        method: 'POST',
        body: audioFile,
        //mode: 'no-cors',
        headers: {
            'Authorization': `Bearer ${CLIENT_TOKEN}`,
            //'Transfer-encoding': 'chunked',
            'Accept': 'application/json',
            'Content-Type': 'audio/wav',
            'Content-Length': audioFile.size,
        }
    }
}

export function processAudio(audioFile)
{
    const uri = 'https://api.wit.ai/speech';
    const content = getRequestBody(audioFile);
    return fetch(uri, content).then(r => r.json());
}