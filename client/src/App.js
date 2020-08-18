import React from 'react';
import WaveStream from 'react-wave-stream';
import './App.css';
import Recorder from "recorder-js/src";
import * as nlp from "./nlp"

export default class App extends React.Component {
    constructor(...args) {
        super(...args);

        this.state = {
            blob: null,
            isRecording: false,
            stream: null,
            analyserData: {data: [], lineTo: 0},
        };

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.download = this.download.bind(this);
    }

    initialize() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        this.recorder = new Recorder(this.audioContext, {
            onAnalysed: data => {
                if (this.state.isRecording)
                    this.setState({analyserData: data})
                //console.log(data);
            },
        });

        navigator.mediaDevices.getUserMedia({audio: true})
            .then((stream) => {
                this.setState({stream});
                this.recorder.init(stream);
            })
            .catch(this.dontGotStream);
    }

    componentDidMount() {
    }

    start() {
        if (!this.recorder)
            this.initialize();
        this.recorder.start()
            .then(() => this.setState({isRecording: true}));
    }

    stop() {
        this.recorder.stop()
            .then(({blob}) => this.setState({
                isRecording: false,
                blob: blob,
            }))
            .then(() => {
                nlp.processAudio(this.state.blob).then(r => console.log(r));
            });
    }

    dontGotStream(error) {
        console.log('Get stream failed', error);
    }

    download() {
        //Recorder.download(this.state.blob, 'react-audio');
        console.log(this.state.blob);
        //processAudio(this.state.blob);
        this.setState({blob: null});
    }

    render() {
        const {isRecording, blob, stream} = this.state;

        return (
            <div className="App">
                <div className="App-header">
                    <h2>Recording Studio</h2>
                    <div className="App-buttons">
                        {isRecording ? (
                            <button onClick={this.stop}>Stop</button>
                        ) : (
                            <button onClick={this.start}>Start</button>
                        )}
                        {blob && (
                            <button
                                onClick={this.download}
                            >
                                Download
                            </button>
                        )}
                    </div>
                </div>
                <div className="App-studio">
                    <WaveStream {...this.state.analyserData} />
                </div>
            </div>
        );
    }
}
