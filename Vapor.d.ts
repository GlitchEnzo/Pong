declare module Vapor {
    /**
    * A wrapper around the Web Audio API AudioContext object
    * @class Represents an AudioManager
    */
    class AudioManager {
        /**
        * The Web Audio API AudioContext.
        */
        public context: AudioContext;
        constructor();
    }
}
declare module Vapor {
    /**
    * A wrapper around the Web AudioSource API AudioBuffer object
    * @class Represents an AudioManager
    */
    class AudioSource {
        /**
        * The Web Audio API AudioBuffer.
        */
        public buffer: AudioBuffer;
        /**
        * The Web Audio API Source Buffer.
        */
        public source: AudioBufferSourceNode;
        /**
        * The AudioManager managing this AudioSource.
        */
        public manager: AudioManager;
        public loaded: boolean;
        constructor(manager: AudioManager);
        public LoadAudio(url: string, callback: (source: AudioSource) => any): void;
        public Play(): void;
        static FromFile(manager: AudioManager, url: string, callback: (source: AudioSource) => any): void;
    }
}
/**
* This interface represents a set of AudioNode objects and their connections. It allows for arbitrary routing of signals to the AudioDestinationNode (what the user ultimately hears). Nodes are created from the context and are then connected together. In most use cases, only a single AudioContext is used per document. An AudioContext is constructed as follows:
*
*     var context = new AudioContext();
*/
interface AudioContext {
    /**
    * An AudioDestinationNode with a single input representing the final destination for all audio (to be rendered to the audio hardware). All AudioNodes actively rendering audio will directly or indirectly connect to destination.
    */
    destination: AudioDestinationNode;
    /**
    * The sample rate (in sample-frames per second) at which the AudioContext handles audio. It is assumed that all AudioNodes in the context run at this rate. In making this assumption, sample-rate converters or "varispeed" processors are not supported in real-time processing.
    */
    sampleRate: number;
    /**
    * This is a time in seconds which starts at zero when the context is created and increases in real-time. All scheduled times are relative to it. This is not a "transport" time which can be started, paused, and re-positioned. It is always moving forward. A GarageBand-like timeline transport system can be very easily built on top of this (in JavaScript). This time corresponds to an ever-increasing hardware timestamp.
    */
    currentTime: number;
    /**
    * An AudioListener which is used for 3D spatialization.
    */
    listener: AudioListener;
    /**
    * The number of AudioBufferSourceNodes that are currently playing.
    */
    activeSourceCount: number;
    /**
    * Creates an AudioBuffer of the given size. The audio data in the buffer will be zero-initialized (silent). An exception will be thrown if the numberOfChannels or sampleRate are out-of-bounds.
    * @param numberOfChannels how many channels the buffer will have. An implementation must support at least 32 channels.
    * @param length the size of the buffer in sample-frames.
    * @param sampleRate the sample-rate of the linear PCM audio data in the buffer in sample-frames per second. An implementation must support sample-rates in at least the range 22050 to 96000.
    */
    createBuffer(numberOfChannels: number, length: number, sampleRate: number): AudioBuffer;
    /**
    * Creates an AudioBuffer given the audio file data contained in the ArrayBuffer. The ArrayBuffer can, for example, be loaded from an XMLHttpRequest's response attribute after setting the responseType to "arraybuffer". Audio file data can be in any of the formats supported by the audio element.
    * The following steps must be performed:
    * 1. Decode the encoded buffer from the AudioBuffer into linear PCM. If a decoding error is encountered due to the audio format not being recognized or supported, or because of corrupted/unexpected/inconsistent data then return NULL (and these steps will be terminated).
    * 2. If mixToMono is true, then mixdown the decoded linear PCM data to mono.
    * 3. Take the decoded (possibly mixed-down) linear PCM audio data, and resample it to the sample-rate of the AudioContext if it is different from the sample-rate of buffer. The final result will be stored in an AudioBuffer and returned as the result of this method.
    * @param buffer the audio file data (for example from a .wav file).
    * @param mixToMono if a mixdown to mono will be performed. Normally, this would not be set.
    */
    createBuffer(buffer: ArrayBuffer, mixToMono: boolean): AudioBuffer;
    /**
    * Asynchronously decodes the audio file data contained in the ArrayBuffer. The ArrayBuffer can, for example, be loaded from an XMLHttpRequest's response attribute after setting the responseType to "arraybuffer". Audio file data can be in any of the formats supported by the audio element.
    * The decodeAudioData() method is preferred over the createBuffer() from ArrayBuffer method because it is asynchronous and does not block the main JavaScript thread.
    *
    * The following steps must be performed:
    * 1. Temporarily neuter the audioData ArrayBuffer in such a way that JavaScript code may not access or modify the data.
    * 2. Queue a decoding operation to be performed on another thread.
    * 3. The decoding thread will attempt to decode the encoded audioData into linear PCM. If a decoding error is encountered due to the audio format not being recognized or supported, or because of corrupted/unexpected/inconsistent data then the audioData neutered state will be restored to normal and the errorCallback will be scheduled to run on the main thread's event loop and these steps will be terminated.
    * 4. The decoding thread will take the result, representing the decoded linear PCM audio data, and resample it to the sample-rate of the AudioContext if it is different from the sample-rate of audioData. The final result (after possibly sample-rate converting) will be stored in an AudioBuffer.
    * 5. The audioData neutered state will be restored to normal
    * 6. The successCallback function will be scheduled to run on the main thread's event loop given the AudioBuffer from step (4) as an argument.
    *
    * @param ArrayBuffer containing audio file data.
    * @param  callback function which will be invoked when the decoding is finished. The single argument to this callback is an AudioBuffer representing the decoded PCM audio data.
    * @param callback function which will be invoked if there is an error decoding the audio file data.
    */
    decodeAudioData(audioData: ArrayBuffer, successCallback: any, errorCallback?: any): void;
    /**
    * Creates an AudioBufferSourceNode.
    */ 
    createBufferSource(): AudioBufferSourceNode;
    /**
    * Creates a MediaElementAudioSourceNode given an HTMLMediaElement. As a consequence of calling this method, audio playback from the HTMLMediaElement will be re-routed into the processing graph of the AudioContext.
    */
    createMediaElementSource(mediaElement: HTMLMediaElement): MediaElementAudioSourceNode;
    /**
    * Creates a MediaStreamAudioSourceNode given a MediaStream. As a consequence of calling this method, audio playback from the MediaStream will be re-routed into the processing graph of the AudioContext.
    */ 
    createMediaStreamSource(mediaStream: any): MediaStreamAudioSourceNode;
    /**
    * Creates a ScriptProcessorNode for direct audio processing using JavaScript. An exception will be thrown if bufferSize or numberOfInputChannels or numberOfOutputChannels are outside the valid range.
    * It is invalid for both numberOfInputChannels and numberOfOutputChannels to be zero.
    * @param bufferSize  the buffer size in units of sample-frames. It must be one of the following values: 256, 512, 1024, 2048, 4096, 8192, 16384. This value controls how frequently the onaudioprocess event handler is called and how many sample-frames need to be processed each call. Lower values for bufferSize will result in a lower (better) latency. Higher values will be necessary to avoid audio breakup and glitches. The value chosen must carefully balance between latency and audio quality.
    * @param numberOfInputChannels (defaults to 2) the number of channels for this node's input. Values of up to 32 must be supported.
    * @param numberOfOutputChannels (defaults to 2) the number of channels for this node's output. Values of up to 32 must be supported.
    */ 
    createScriptProcessor(bufferSize: number, numberOfInputChannels?: number, numberOfOutputChannels?: number): ScriptProcessorNode;
    /**
    * Creates a AnalyserNode.
    */
    createAnalyser(): AnalyserNode;
    /**
    * Creates a GainNode.
    */
    createGain(): GainNode;
    /**
    * Creates a DelayNode representing a variable delay line. The initial default delay time will be 0 seconds.
    * @param maxDelayTime the maximum delay time in seconds allowed for the delay line. If specified, this value must be greater than zero and less than three minutes or a NOT_SUPPORTED_ERR exception will be thrown.
    */
    createDelay(maxDelayTime?: number): DelayNode;
    /**
    * Creates a BiquadFilterNode representing a second order filter which can be configured as one of several common filter types.
    */
    createBiquadFilter(): BiquadFilterNode;
    /**
    * Creates a WaveShaperNode representing a non-linear distortion.
    */
    createWaveShaper(): WaveShaperNode;
    /**
    * Creates an PannerNode.
    */
    createPanner(): PannerNode;
    /**
    * Creates a ConvolverNode.
    */
    createConvolver(): ConvolverNode;
    /**
    * Creates an ChannelSplitterNode representing a channel splitter. An exception will be thrown for invalid parameter values.
    * @param numberOfOutputs the number of outputs. Values of up to 32 must be supported. If not specified, then 6 will be used.
    */
    createChannelSplitter(numberOfOutputs?: number): ChannelSplitterNode;
    /**
    * Creates an ChannelMergerNode representing a channel merger. An exception will be thrown for invalid parameter values.
    * @param numberOfInputs the number of inputs. Values of up to 32 must be supported. If not specified, then 6 will be used.
    */
    createChannelMerger(numberOfInputs?: number): ChannelMergerNode;
    /**
    * Creates a DynamicsCompressorNode.
    */
    createDynamicsCompressor(): DynamicsCompressorNode;
    /**
    * Creates an OscillatorNode.
    */
    createOscillator(): OscillatorNode;
    /**
    * Creates a WaveTable representing a waveform containing arbitrary harmonic content. The real and imag parameters must be of type Float32Array of equal lengths greater than zero and less than or equal to 4096 or an exception will be thrown. These parameters specify the Fourier coefficients of a Fourier series representing the partials of a periodic waveform. The created WaveTable will be used with an OscillatorNode and will represent a normalized time-domain waveform having maximum absolute peak value of 1. Another way of saying this is that the generated waveform of an OscillatorNode will have maximum peak value at 0dBFS. Conveniently, this corresponds to the full-range of the signal values used by the Web Audio API. Because the WaveTable will be normalized on creation, the real and imag parameters represent relative values.
    * @param real an array of cosine terms (traditionally the A terms). In audio terminology, the first element (index 0) is the DC-offset of the periodic waveform and is usually set to zero. The second element (index 1) represents the fundamental frequency. The third element represents the first overtone, and so on.
    * @param imag an array of sine terms (traditionally the B terms). The first element (index 0) should be set to zero (and will be ignored) since this term does not exist in the Fourier series. The second element (index 1) represents the fundamental frequency. The third element represents the first overtone, and so on.
    */
    createWaveTable(real: any, imag: any): WaveTable;
}
declare var AudioContext: new() => AudioContext;
declare var webkitAudioContext: new() => AudioContext;
interface OfflineRenderSuccessCallback {
    (renderedData: AudioBuffer): void;
}
/**
* OfflineAudioContext is a particular type of AudioContext for rendering/mixing-down (potentially) faster than real-time. It does not render to the audio hardware, but instead renders as quickly as possible, calling a render callback function upon completion with the result provided as an AudioBuffer. It is constructed by specifying the numberOfChannels, length, and sampleRate as follows:
*
*     var offlineContext = new OfflineAudioContext(unsigned long numberOfChannels, unsigned long length, float sampleRate);
*/
interface OfflineAudioContext extends AudioContext {
    startRendering(): void;
    oncomplete: OfflineRenderSuccessCallback;
}
declare var webkitOfflineAudioContext: new(numberOfChannels: number, length: number, sampleRate: number) => OfflineAudioContext;
/**
* AudioNodes are the building blocks of an AudioContext. This interface represents audio sources, the audio destination, and intermediate processing modules. These modules can be connected together to form processing graphs for rendering audio to the audio hardware. Each node can have inputs and/or outputs. An AudioSourceNode has no inputs and a single output. An AudioDestinationNode has one input and no outputs and represents the final destination to the audio hardware. Most processing nodes such as filters will have one input and one output. Each type of AudioNode differs in the details of how it processes or synthesizes audio. But, in general, AudioNodes will process its inputs (if it has any), and generate audio for its outputs (if it has any).
*
* An output may connect to one or more AudioNode inputs, thus fanout is supported. An input may be connected from one or more AudioNode outputs, thus fanin is supported.
*
* In order to handle this fanin, any AudioNode with inputs performs an up-mixing of all connections for each input:
*
* 1. Calculate N: the maximum number of channels of all the connections to the input. For example, if an input has a mono connection and a stereo connection then this number will be 2.
* 2. For each connection to the input, up-mix to N channels.
* 3. Mix together all the up-mixed streams from (2). This is a straight-forward mixing together of each of the corresponding channels from each connection.
*
* Please see Mixer Gain Structure for more informative details.
*
* For performance reasons, practical implementations will need to use block processing, with each AudioNode processing a fixed number of sample-frames of size block-size. In order to get uniform behavior across implementations, we will define this value explicitly. block-size is defined to be 128 sample-frames which corresponds to roughly 3ms at a sample-rate of 44.1KHz.
*/
interface AudioNode {
    /**
    * Connects the AudioNode to another AudioNode.
    *
    *  It is possible to connect an AudioNode output to more than one input with multiple calls to connect(). Thus, "fanout" is supported.
    *
    *  It is possible to connect an AudioNode to another AudioNode which creates a cycle. In other words, an AudioNode may connect to another AudioNode, which in turn connects back to the first AudioNode. This is allowed only if there is at least one DelayNode in the cycle or an exception will be thrown.
    *
    * There can only be one connection between a given output of one specific node and a given input of another specific node. Multiple connections with the same termini are ignored. For example:
    *
    *     nodeA.connect(nodeB);
    *     nodeA.connect(nodeB);
    *
    * will have the same effect as
    *
    *     nodeA.connect(nodeB);
    *
    * @param destination the AudioNode to connect to.
    * @param output an index describing which output of the AudioNode from which to connect. An out-of-bound value throws an exception.
    * @param input an index describing which input of the destination AudioNode to connect to. An out-of-bound value throws an exception.
    */
    connect(destination: AudioNode, output?: number, input?: number): void;
    /**
    * Connects the AudioNode to an AudioParam, controlling the parameter value with an audio-rate signal.
    *
    * It is possible to connect an AudioNode output to more than one AudioParam with multiple calls to connect(). Thus, "fanout" is supported.
    *
    * It is possible to connect more than one AudioNode output to a single AudioParam with multiple calls to connect(). Thus, "fanin" is supported.
    *
    * An AudioParam will take the rendered audio data from any AudioNode output connected to it and convert it to mono by down-mixing if it is not already mono, then mix it together with other such outputs and finally will mix with the intrinsic parameter value (the value the AudioParam would normally have without any audio connections), including any timeline changes scheduled for the parameter.
    *
    * There can only be one connection between a given output of one specific node and a specific AudioParam. Multiple connections with the same termini are ignored. For example:
    *
    *     nodeA.connect(param);
    *     nodeA.connect(param);
    *
    * will have the same effect as
    *
    *     nodeA.connect(param);
    *
    * @param destination the AudioParam to connect to.
    * @param output an index describing which output of the AudioNode from which to connect. An out-of-bound value throws an exception.
    */
    connect(destination: AudioParam, output?: number): void;
    /**
    * Disconnects an AudioNode's output.
    * @param output an index describing which output of the AudioNode to disconnect. An out-of-bound value throws an exception.
    */
    disconnect(output?: number): void;
    /**
    * The AudioContext which owns this AudioNode.
    */
    context: AudioContext;
    /**
    * The number of inputs feeding into the AudioNode. This will be 0 for an AudioSourceNode.
    */
    numberOfInputs: number;
    /**
    * The number of outputs coming out of the AudioNode. This will be 0 for an AudioDestinationNode.
    */
    numberOfOutputs: number;
}
/**
* This is an abstract interface representing an audio source, an AudioNode which has no inputs and a single output:
*
*    numberOfInputs  : 0
*    numberOfOutputs : 1
*
* Subclasses of AudioSourceNode will implement specific types of audio sources.
*/
interface AudioSourceNode extends AudioNode {
}
/**
* This is an AudioNode representing the final audio destination and is what the user will ultimately hear. It can be considered as an audio output device which is connected to speakers. All rendered audio to be heard will be routed to this node, a "terminal" node in the AudioContext's routing graph. There is only a single AudioDestinationNode per AudioContext, provided through the destination attribute of AudioContext.
*
*    numberOfInputs  : 1
*    numberOfOutputs : 0
*/
interface AudioDestinationNode extends AudioNode {
    /**
    * The maximum number of channels that the numberOfChannels attribute can be set to. An AudioDestinationNode representing the audio hardware end-point (the normal case) can potentially output more than 2 channels of audio if the audio hardware is multi-channel. maxNumberOfChannels is the maximum number of channels that this hardware is capable of supporting. If this value is 0, then this indicates that maxNumberOfChannels may not be changed. This will be the case for an AudioDestinationNode in an OfflineAudioContext.
    * @readonly
    */
    maxNumberOfChannels: number;
    /**
    * The number of channels of the destination's input. This value will default to 2, and may be set to any non-zero value less than or equal to maxNumberOfChannels. An exception will be thrown if this value is not within the valid range. Giving a concrete example, if the audio hardware supports 8-channel output, then we may set numberOfChannels to 8, and render 8-channels of output.
    */
    numberOfChannels: number;
}
/**
* AudioParam controls an individual aspect of an AudioNode's functioning, such as volume. The parameter can be set immediately to a particular value using the "value" attribute. Or, value changes can be scheduled to happen at very precise times (in the coordinate system of AudioContext.currentTime), for envelopes, volume fades, LFOs, filter sweeps, grain windows, etc. In this way, arbitrary timeline-based automation curves can be set on any AudioParam. Additionally, audio signals from the outputs of AudioNodes can be connected to an AudioParam, summing with the intrinsic parameter value.
*
* Some synthesis and processing AudioNodes have AudioParams as attributes whose values must be taken into account on a per-audio-sample basis. For other AudioParams, sample-accuracy is not important and the value changes can be sampled more coarsely. Each individual AudioParam will specify that it is either an a-rate parameter which means that its values must be taken into account on a per-audio-sample basis, or it is a k-rate parameter.
*
* Implementations must use block processing, with each AudioNode processing 128 sample-frames in each block.
*
* For each 128 sample-frame block, the value of a k-rate parameter must be sampled at the time of the very first sample-frame, and that value must be used for the entire block. a-rate parameters must be sampled for each sample-frame of the block.
*/
interface AudioParam {
    /**
    *  The parameter's floating-point value. This attribute is initialized to the defaultValue. If a value is set outside the allowable range described by minValue and maxValue no exception is thrown, because these limits are just nominal and may be exceeded. If a value is set during a time when there are any automation events scheduled then it will be ignored and no exception will be thrown.
    */
    value: number;
    /**
    * Nominal minimum value. This attribute is informational and value may be set lower than this value.
    */
    minValue: number;
    /**
    * Nominal maximum value. This attribute is informational and value may be set higher than this value.
    */
    maxValue: number;
    /**
    * Initial value for the value attribute
    */
    defaultValue: number;
    /**
    * Schedules a parameter value change at the given time.
    *
    * If there are no more events after this SetValue event, then for t >= startTime, v(t) = value. In other words, the value will remain constant.
    *
    * If the next event (having time T1) after this SetValue event is not of type LinearRampToValue or ExponentialRampToValue, then, for t: startTime <= t < T1, v(t) = value. In other words, the value will remain constant during this time interval, allowing the creation of "step" functions.
    *
    * If the next event after this SetValue event is of type LinearRampToValue or ExponentialRampToValue then please see details below.
    *
    * @param value the value the parameter will change to at the given time
    * @param startTime parameter is the time in the same time coordinate system as AudioContext.currentTime.
    */
    setValueAtTime(value: number, startTime: number): void;
    /**
    * Schedules a linear continuous change in parameter value from the previous scheduled parameter value to the given value.
    *
    * The value during the time interval T0 <= t < T1 (where T0 is the time of the previous event and T1 is the endTime parameter passed into this method) will be calculated as:
    *
    *      v(t) = V0 + (V1 - V0) * ((t - T0) / (T1 - T0))
    *
    * Where V0 is the value at the time T0 and V1 is the value parameter passed into this method.
    *
    * If there are no more events after this LinearRampToValue event then for t >= T1, v(t) = V1
    *
    * @param value the value the parameter will linearly ramp to at the given time.
    * @param endTime the time in the same time coordinate system as AudioContext.currentTime.
    */
    linearRampToValueAtTime(value: number, time: number): void;
    /**
    * Schedules an exponential continuous change in parameter value from the previous scheduled parameter value to the given value. Parameters representing filter frequencies and playback rate are best changed exponentially because of the way humans perceive sound.
    *
    * The value during the time interval T0 <= t < T1 (where T0 is the time of the previous event and T1 is the endTime parameter passed into this method) will be calculated as:
    *
    *     v(t) = V0 * (V1 / V0) ^ ((t - T0) / (T1 - T0))
    *
    * Where V0 is the value at the time T0 and V1 is the value parameter passed into this method.
    *
    * If there are no more events after this ExponentialRampToValue event then for t >= T1, v(t) = V1
    *
    * @param value the value the parameter will exponentially ramp to at the given time. An exception will be thrown if this value is less than or equal to 0, or if the value at the time of the previous event is less than or equal to 0.
    * @param endTime the time in the same time coordinate system as AudioContext.currentTime.
    */
    exponentialRampToValueAtTime(value: number, endTime: number): void;
    /**
    * Start exponentially approaching the target value at the given time with a rate having the given time constant. Among other uses, this is useful for implementing the "decay" and "release" portions of an ADSR envelope. Please note that the parameter value does not immediately change to the target value at the given time, but instead gradually changes to the target value.
    *
    * More precisely, timeConstant is the time it takes a first-order linear continuous time-invariant system to reach the value 1 - 1/e (around 63.2%) given a step input response (transition from 0 to 1 value).
    *
    * During the time interval: T0 <= t < T1, where T0 is the startTime parameter and T1 represents the time of the event following this event (or infinity if there are no following events):
    *
    *      v(t) = V1 + (V0 - V1) * exp(-(t - T0) / timeConstant)
    *
    * Where V0 is the initial value (the .value attribute) at T0 (the startTime parameter) and V1 is equal to the target parameter.
    *
    * @param target the value the parameter will start changing to at the given time.
    * @param startTime the time in the same time coordinate system as AudioContext.currentTime.
    * @param timeConstant the time-constant value of first-order filter (exponential) approach to the target value. The larger this value is, the slower the transition will be.
    */
    setTargetValueAtTime(target: number, startTime: number, timeConstant: number): void;
    /**
    * Sets an array of arbitrary parameter values starting at the given time for the given duration. The number of values will be scaled to fit into the desired duration.
    *
    * During the time interval: startTime <= t < startTime + duration, values will be calculated:
    *
    *     v(t) = values[N * (t - startTime) / duration], where N is the length of the values array.
    *
    * After the end of the curve time interval (t >= startTime + duration), the value will remain constant at the final curve value, until there is another automation event (if any).
    *
    * @param values a Float32Array representing a parameter value curve. These values will apply starting at the given time and lasting for the given duration.
    * @param startTime the time in the same time coordinate system as AudioContext.currentTime.
    * @param duration the amount of time in seconds (after the time parameter) where values will be calculated according to the values parameter..
    *
    */
    setValueCurveAtTime(values: Float32Array, time: number, duration: number): void;
    /**
    * Cancels all scheduled parameter changes with times greater than or equal to startTime.
    *
    * @param startTime the starting time at and after which any previously scheduled parameter changes will be cancelled. It is a time in the same time coordinate system as AudioContext.currentTime.
    */
    cancelScheduledValues(startTime: number): void;
}
/**
* Changing the gain of an audio signal is a fundamental operation in audio applications. The GainNode is one of the building blocks for creating mixers. This interface is an AudioNode with a single input and single output:
*
*     numberOfInputs  : 1
*     numberOfOutputs : 1
*
* which multiplies the input audio signal by the (possibly time-varying) gain attribute, copying the result to the output. By default, it will take the input and pass it through to the output unchanged, which represents a constant gain change of 1.
*
* As with other AudioParams, the gain parameter represents a mapping from time (in the coordinate system of AudioContext.currentTime) to floating-point value. Every PCM audio sample in the input is multiplied by the gain parameter's value for the specific time corresponding to that audio sample. This multiplied value represents the PCM audio sample for the output.
*
* The number of channels of the output will always equal the number of channels of the input, with each channel of the input being multiplied by the gain values and being copied into the corresponding channel of the output.
*
* The implementation must make gain changes to the audio stream smoothly, without introducing noticeable clicks or glitches. This process is called "de-zippering".
*/
interface GainNode extends AudioNode {
    /**
    * Represents the amount of gain to apply. Its default value is 1 (no gain change). The nominal minValue is 0, but may be set negative for phase inversion. The nominal maxValue is 1, but higher values are allowed (no exception thrown).This parameter is a-rate
    */
    gain: AudioParam;
}
/**
* A delay-line is a fundamental building block in audio applications. This interface is an AudioNode with a single input and single output:
*
*     numberOfInputs  : 1
*     numberOfOutputs : 1
*
* which delays the incoming audio signal by a certain amount. The default amount is 0 seconds (no delay). When the delay time is changed, the implementation must make the transition smoothly, without introducing noticeable clicks or glitches to the audio stream.
*/
interface DelayNode extends AudioNode {
    /**
    * An AudioParam object representing the amount of delay (in seconds) to apply. The default value (delayTime.value) is 0 (no delay). The minimum value is 0 and the maximum value is determined by the maxDelayTime argument to the AudioContext method createDelay. This parameter is k-rate
    */
    delayTime: AudioParam;
}
/**
* This interface represents a memory-resident audio asset (for one-shot sounds and other short audio clips). Its format is non-interleaved IEEE 32-bit linear PCM with a nominal range of -1 -> +1. It can contain one or more channels. It is analogous to a WebGL texture. Typically, it would be expected that the length of the PCM data would be fairly short (usually somewhat less than a minute). For longer sounds, such as music soundtracks, streaming should be used with the audio element and MediaElementAudioSourceNode.
*
* An AudioBuffer may be used by one or more AudioContexts.
*/
interface AudioBuffer {
    /**
    * The sample-rate for the PCM audio data in samples per second.
    * @readonly
    */
    sampleRate: number;
    /**
    * Length of the PCM audio data in sample-frames.
    * @readonly
    */
    length: number;
    /**
    * Duration of the PCM audio data in seconds.
    * @readonly
    */
    duration: number;
    /**
    * The number of discrete audio channels.
    * @readonly
    */
    numberOfChannels: number;
    /**
    * Returns the Float32Array representing the PCM audio data for the specific channel.
    *
    * The channel parameter is an index representing the particular channel to get data for. An index value of 0 represents the first channel. This index value MUST be less than numberOfChannels or an exception will be thrown.
    */
    getChannelData(channel: number): Float32Array;
}
/**
* This interface represents an audio source from an in-memory audio asset in an AudioBuffer. It generally will be used for short audio assets which require a high degree of scheduling flexibility (can playback in rhythmically perfect ways). The playback state of an AudioBufferSourceNode goes through distinct stages during its lifetime in this order: UNSCHEDULED_STATE, SCHEDULED_STATE, PLAYING_STATE, FINISHED_STATE. The start() method causes a transition from the UNSCHEDULED_STATE to SCHEDULED_STATE. Depending on the time argument passed to start(), a transition is made from the SCHEDULED_STATE to PLAYING_STATE, at which time sound is first generated. Following this, a transition from the PLAYING_STATE to FINISHED_STATE happens when either the buffer's audio data has been completely played (if the loop attribute is false), or when the stop() method has been called and the specified time has been reached. Please see more details in the start() and stop() description. Once an AudioBufferSourceNode has reached the FINISHED state it will no longer emit any sound. Thus start() and stop() may not be issued multiple times for a given AudioBufferSourceNode.
*
*     numberOfInputs  : 0
*     numberOfOutputs : 1
*/
interface AudioBufferSourceNode extends AudioSourceNode {
    /**
    * The playback state, initialized to UNSCHEDULED_STATE.
    */
    playbackState: number;
    /**
    * Represents the audio asset to be played.
    */
    buffer: AudioBuffer;
    /**
    * The speed at which to render the audio stream. The default playbackRate.value is 1. This parameter is a-rate
    */
    playbackRate: AudioParam;
    /**
    * Indicates if the audio data should play in a loop. The default value is false.
    */
    loop: boolean;
    /**
    * An optional value in seconds where looping should begin if the loop attribute is true. Its default value is 0, and it may usefully be set to any value between 0 and the duration of the buffer.
    */
    loopStart: number;
    /**
    * An optional value in seconds where looping should end if the loop attribute is true. Its default value is 0, and it may usefully be set to any value between 0 and the duration of the buffer.
    */
    loopEnd: number;
    /**
    * A property used to set the EventHandler for the ended event that is dispatched to AudioBufferSourceNode node types. When the playback of the buffer for an AudioBufferSourceNode is finished, an event of type Event will be dispatched to the event handler.
    */
    onended: EventListener;
    /**
    * Schedules a sound to playback at an exact time.
    *
    * @param when time (in seconds) the sound should start playing. It is in the same time coordinate system as AudioContext.currentTime. If 0 is passed in for this value or if the value is less than currentTime, then the sound will start playing immediately. start may only be called one time and must be called before stop is called or an exception will be thrown.
    * @param offset the offset time in the buffer (in seconds) where playback will begin. This parameter is optional with a default value of 0 (playing back from the beginning of the buffer).
    * @param duration the duration of the portion (in seconds) to be played. This parameter is optional, with the default value equal to the total duration of the AudioBuffer minus the offset parameter. Thus if neither offset nor duration are specified then the implied duration is the total duration of the AudioBuffer.
    */
    start(when: number, offset?: number, duration?: number): void;
    /**
    * Schedules a sound to stop playback at an exact time. Please see deprecation section for the old method name.
    *
    * The when parameter describes at what time (in seconds) the sound should stop playing. It is in the same time coordinate system as AudioContext.currentTime. If 0 is passed in for this value or if the value is less than currentTime, then the sound will stop playing immediately. stop must only be called one time and only after a call to start or stop, or an exception will be thrown.
    */
    stop(when: number): void;
}
interface MediaElementAudioSourceNode extends AudioSourceNode {
}
/**
* This interface is an AudioNode which can generate, process, or analyse audio directly using JavaScript.
*
*     numberOfInputs  : 1
*     numberOfOutputs : 1
*
* The ScriptProcessorNode is constructed with a bufferSize which must be one of the following values: 256, 512, 1024, 2048, 4096, 8192, 16384. This value controls how frequently the onaudioprocess event handler is called and how many sample-frames need to be processed each call. Lower numbers for bufferSize will result in a lower (better) latency. Higher numbers will be necessary to avoid audio breakup and glitches. The value chosen must carefully balance between latency and audio quality.
*
* numberOfInputChannels and numberOfOutputChannels determine the number of input and output channels. It is invalid for both numberOfInputChannels and numberOfOutputChannels to be zero.
*
*     var node = context.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
*/
interface ScriptProcessorNode extends AudioNode {
    /**
    * An event listener which is called periodically for audio processing. An event of type AudioProcessingEvent will be passed to the event handler.
    */
    onaudioprocess: EventListener;
    /**
    * The size of the buffer (in sample-frames) which needs to be processed each time onprocessaudio is called. Legal values are (256, 512, 1024, 2048, 4096, 8192, 16384).
    */
    bufferSize: number;
}
/**
* This interface is a type of Event which is passed to the onaudioprocess event handler used by ScriptProcessorNode.
*
* The event handler processes audio from the input (if any) by accessing the audio data from the inputBuffer attribute. The audio data which is the result of the processing (or the synthesized data if there are no inputs) is then placed into the outputBuffer.
*/
interface AudioProcessingEvent extends Event {
    /**
    * The ScriptProcessorNode associated with this processing event.
    */
    node: ScriptProcessorNode;
    /**
    * The time when the audio will be played in the same time coordinate system as AudioContext.currentTime. playbackTime allows for very tight synchronization between processing directly in JavaScript with the other events in the context's rendering graph.
    */
    playbackTime: number;
    /**
    * An AudioBuffer containing the input audio data. It will have a number of channels equal to the numberOfInputChannels parameter of the createScriptProcessor() method. This AudioBuffer is only valid while in the scope of the onaudioprocess function. Its values will be meaningless outside of this scope.
    */
    inputBuffer: AudioBuffer;
    /**
    * An AudioBuffer where the output audio data should be written. It will have a number of channels equal to the numberOfOutputChannels parameter of the createScriptProcessor() method. Script code within the scope of the onaudioprocess function is expected to modify the Float32Array arrays representing channel data in this AudioBuffer. Any script modifications to this AudioBuffer outside of this scope will not produce any audible effects.
    */
    outputBuffer: AudioBuffer;
}
declare enum PanningModelType {
    /**
    * A simple and efficient spatialization algorithm using equal-power panning.
    */
    equalpower,
    /**
    * A higher quality spatialization algorithm using a convolution with measured impulse responses from human subjects. This panning method renders stereo output.
    */
    HRTF,
    /**
    * An algorithm which spatializes multi-channel audio using sound field algorithms.
    */
    soundfield,
}
declare enum DistanceModelType {
    /**
    * A linear distance model which calculates distanceGain according to:
    *     1 - rolloffFactor * (distance - refDistance) / (maxDistance - refDistance)
    */
    linear,
    /**
    * An inverse distance model which calculates distanceGain according to:
    *     refDistance / (refDistance + rolloffFactor * (distance - refDistance))
    */
    inverse,
    /**
    * An exponential distance model which calculates distanceGain according to:
    *     pow(distance / refDistance, -rolloffFactor)
    */
    exponential,
}
/**
* This interface represents a processing node which positions / spatializes an incoming audio stream in three-dimensional space. The spatialization is in relation to the AudioContext's AudioListener (listener attribute).
*
*     numberOfInputs  : 1
*     numberOfOutputs : 1
*
* The audio stream from the input will be either mono or stereo, depending on the connection(s) to the input.
*
* The output of this node is hard-coded to stereo (2 channels) and currently cannot be configured.
*/
interface PannerNode extends AudioNode {
    /**
    * Determines which spatialization algorithm will be used to position the audio in 3D space. The default is "HRTF".
    */
    panningModel: PanningModelType;
    /**
    * Sets the position of the audio source relative to the listener attribute. A 3D cartesian coordinate system is used.
    *
    * The default value is (0,0,0)
    *
    * @param x the x coordinates in 3D space.
    * @param y the y coordinates in 3D space.
    * @param z the z coordinates in 3D space.
    */
    setPosition(x: number, y: number, z: number): void;
    /**
    * Describes which direction the audio source is pointing in the 3D cartesian coordinate space. Depending on how directional the sound is (controlled by the cone attributes), a sound pointing away from the listener can be very quiet or completely silent.
    *
    * The default value is (1,0,0)
    *
    * @param x
    * @param y
    * @param z
    */
    setOrientation(x: number, y: number, z: number): void;
    /**
    * Sets the velocity vector of the audio source. This vector controls both the direction of travel and the speed in 3D space. This velocity relative to the listener's velocity is used to determine how much doppler shift (pitch change) to apply. The units used for this vector is meters / second and is independent of the units used for position and orientation vectors.
    *
    * The default value is (0,0,0)
    *
    * @param x a direction vector indicating direction of travel and intensity.
    * @param y
    * @param z
    */
    setVelocity(x: number, y: number, z: number): void;
    /**
    * Determines which algorithm will be used to reduce the volume of an audio source as it moves away from the listener. The default is "inverse".
    */
    distanceModel: DistanceModelType;
    /**
    * A reference distance for reducing volume as source move further from the listener. The default value is 1.
    */
    refDistance: number;
    /**
    * The maximum distance between source and listener, after which the volume will not be reduced any further. The default value is 10000.
    */
    maxDistance: number;
    /**
    * Describes how quickly the volume is reduced as source moves away from listener. The default value is 1.
    */
    rolloffFactor: number;
    /**
    * A parameter for directional audio sources, this is an angle, inside of which there will be no volume reduction. The default value is 360.
    */
    coneInnerAngle: number;
    /**
    * A parameter for directional audio sources, this is an angle, outside of which the volume will be reduced to a constant value of coneOuterGain. The default value is 360.
    */
    coneOuterAngle: number;
    /**
    * A parameter for directional audio sources, this is the amount of volume reduction outside of the coneOuterAngle. The default value is 0.
    */
    coneOuterGain: number;
}
/**
* This interface represents the position and orientation of the person listening to the audio scene. All PannerNode objects spatialize in relation to the AudioContext's listener. See this section for more details about spatialization.
*/
interface AudioListener {
    /**
    * A constant used to determine the amount of pitch shift to use when rendering a doppler effect. The default value is 1.
    */
    dopplerFactor: number;
    /**
    * The speed of sound used for calculating doppler shift. The default value is 343.3 meters / second.
    */
    speedOfSound: number;
    /**
    * Sets the position of the listener in a 3D cartesian coordinate space. PannerNode objects use this position relative to individual audio sources for spatialization.
    *
    * The default value is (0,0,0)
    *
    * @param x
    * @param y
    * @param z
    */
    setPosition(x: number, y: number, z: number): void;
    /**
    * Describes which direction the listener is pointing in the 3D cartesian coordinate space. Both a front vector and an up vector are provided. In simple human terms, the front vector represents which direction the person's nose is pointing. The up vector represents the direction the top of a person's head is pointing. These values are expected to be linearly independent (at right angles to each other). For normative requirements of how these values are to be interpreted, see the spatialization section.
    *
    * @param x x coordinate of a front direction vector in 3D space, with the default value being 0
    * @param y y coordinate of a front direction vector in 3D space, with the default value being 0
    * @param z z coordinate of a front direction vector in 3D space, with the default value being -1
    * @param xUp x coodinate of an up direction vector in 3D space, with the default value being 0
    * @param yUp y coodinate of an up direction vector in 3D space, with the default value being 1
    * @param zUp z coodinate of an up direction vector in 3D space, with the default value being 0
    */
    setOrientation(x: number, y: number, z: number, xUp: number, yUp: number, zUp: number): void;
    /**
    * Sets the velocity vector of the listener. This vector controls both the direction of travel and the speed in 3D space. This velocity relative to an audio source's velocity is used to determine how much doppler shift (pitch change) to apply. The units used for this vector is meters / second and is independent of the units used for position and orientation vectors.
    *
    * @param x x coordinate of a direction vector indicating direction of travel and intensity. The default value is 0
    * @param y y coordinate of a direction vector indicating direction of travel and intensity. The default value is 0
    * @param z z coordinate of a direction vector indicating direction of travel and intensity. The default value is 0
    */
    setVelocity(x: number, y: number, z: number): void;
}
/**
* This interface represents a processing node which applies a linear convolution effect given an impulse response. Normative requirements for multi-channel convolution matrixing are described [here](http://www.w3.org/TR/2012/WD-webaudio-20121213/#Convolution-reverb-effect).
*
*    numberOfInputs  : 1
*    numberOfOutputs : 1
*/
interface ConvolverNode extends AudioNode {
    /**
    * A mono, stereo, or 4-channel AudioBuffer containing the (possibly multi-channel) impulse response used by the ConvolverNode. At the time when this attribute is set, the buffer and the state of the normalize attribute will be used to configure the ConvolverNode with this impulse response having the given normalization.
    */
    buffer: AudioBuffer;
    /**
    * Controls whether the impulse response from the buffer will be scaled by an equal-power normalization when the buffer atttribute is set. Its default value is true in order to achieve a more uniform output level from the convolver when loaded with diverse impulse responses. If normalize is set to false, then the convolution will be rendered with no pre-processing/scaling of the impulse response. Changes to this value do not take effect until the next time the buffer attribute is set.
    */
    normalize: boolean;
}
/**
* This interface represents a node which is able to provide real-time frequency and time-domain analysis information. The audio stream will be passed un-processed from input to output.
*
*    numberOfInputs  : 1
*    numberOfOutputs : 1    Note that this output may be left unconnected.
*/
interface AnalyserNode extends AudioNode {
    /**
    * Copies the current frequency data into the passed floating-point array. If the array has fewer elements than the frequencyBinCount, the excess elements will be dropped.
    * @param array where frequency-domain analysis data will be copied.
    */
    getFloatFrequencyData(array: any): void;
    /**
    * Copies the current frequency data into the passed unsigned byte array. If the array has fewer elements than the frequencyBinCount, the excess elements will be dropped.
    * @param Tarray where frequency-domain analysis data will be copied.
    */
    getByteFrequencyData(array: any): void;
    /**
    * Copies the current time-domain (waveform) data into the passed unsigned byte array. If the array has fewer elements than the frequencyBinCount, the excess elements will be dropped.
    * @param array where time-domain analysis data will be copied.
    */
    getByteTimeDomainData(array: any): void;
    /**
    * The size of the FFT used for frequency-domain analysis. This must be a power of two.
    */ 
    fftSize: number;
    /**
    * Half the FFT size.
    */
    frequencyBinCount: number;
    /**
    * The minimum power value in the scaling range for the FFT analysis data for conversion to unsigned byte values.
    */
    minDecibels: number;
    /**
    * The maximum power value in the scaling range for the FFT analysis data for conversion to unsigned byte values.
    */
    maxDecibels: number;
    /**
    * A value from 0 -> 1 where 0 represents no time averaging with the last analysis frame.
    */
    smoothingTimeConstant: number;
}
/**
* The ChannelSplitterNode is for use in more advanced applications and would often be used in conjunction with ChannelMergerNode.
*
*    numberOfInputs  : 1
*    numberOfOutputs : Variable N (defaults to 6) // number of "active" (non-silent) outputs is determined by number of channels in the input
*/
interface ChannelSplitterNode extends AudioNode {
}
/**
* The ChannelMergerNode is for use in more advanced applications and would often be used in conjunction with ChannelSplitterNode.
*
*    numberOfInputs  : Variable N (default to 6)  // number of connected inputs may be less than this
*    numberOfOutputs : 1
*/
interface ChannelMergerNode extends AudioNode {
}
/**
* DynamicsCompressorNode is an AudioNode processor implementing a dynamics compression effect.
*
* Dynamics compression is very commonly used in musical production and game audio. It lowers the volume of the loudest parts of the signal and raises the volume of the softest parts. Overall, a louder, richer, and fuller sound can be achieved. It is especially important in games and musical applications where large numbers of individual sounds are played simultaneous to control the overall signal level and help avoid clipping (distorting) the audio output to the speakers.
*
*    numberOfInputs  : 1
*    numberOfOutputs : 1
*/
interface DynamicsCompressorNode extends AudioNode {
    /**
    * The decibel value above which the compression will start taking effect. Its default value is -24, with a nominal range of -100 to 0.
    */
    threshold: AudioParam;
    /**
    * A decibel value representing the range above the threshold where the curve smoothly transitions to the "ratio" portion. Its default value is 30, with a nominal range of 0 to 40.
    */
    knee: AudioParam;
    /**
    * The amount of dB change in input for a 1 dB change in output. Its default value is 12, with a nominal range of 1 to 20.
    */
    ratio: AudioParam;
    /**
    * A read-only decibel value for metering purposes, representing the current amount of gain reduction that the compressor is applying to the signal. If fed no signal the value will be 0 (no gain reduction). The nominal range is -20 to 0.
    */
    reduction: AudioParam;
    /**
    * The amount of time (in seconds) to reduce the gain by 10dB. Its default value is 0.003, with a nominal range of 0 to 1.
    */
    attack: AudioParam;
    /**
    * The amount of time (in seconds) to increase the gain by 10dB. Its default value is 0.250, with a nominal range of 0 to 1.
    */
    release: AudioParam;
}
declare enum BiquadFilterType {
    /**
    * A lowpass filter allows frequencies below the cutoff frequency to pass through and attenuates frequencies above the cutoff. It implements a standard second-order resonant lowpass filter with 12dB/octave rolloff.
    *
    * ## frequency
    * The cutoff frequency
    * ## Q
    * Controls how peaked the response will be at the cutoff frequency. A large value makes the response more peaked. Please note that for this filter type, this value is not a traditional Q, but is a resonance value in decibels.
    * ## gain
    * Not used in this filter type
    */
    lowpass,
    /**
    * A highpass filter is the opposite of a lowpass filter. Frequencies above the cutoff frequency are passed through, but frequencies below the cutoff are attenuated. It implements a standard second-order resonant highpass filter with 12dB/octave rolloff.
    *
    * ## frequency
    * The cutoff frequency below which the frequencies are attenuated
    * ## Q
    * Controls how peaked the response will be at the cutoff frequency. A large value makes the response more peaked. Please note that for this filter type, this value is not a traditional Q, but is a resonance value in decibels.
    * ## gain
    * Not used in this filter type
    */
    highpass,
    /**
    * A bandpass filter allows a range of frequencies to pass through and attenuates the frequencies below and above this frequency range. It implements a second-order bandpass filter.
    *
    * ## frequency
    * The center of the frequency band
    * ## Q
    * Controls the width of the band. The width becomes narrower as the Q value increases.
    * ## gain
    * Not used in this filter type
    */
    bandpass,
    /**
    * The lowshelf filter allows all frequencies through, but adds a boost (or attenuation) to the lower frequencies. It implements a second-order lowshelf filter.
    *
    * ## frequency
    * The upper limit of the frequences where the boost (or attenuation) is applied.
    * ## Q
    * Not used in this filter type.
    * ## gain
    * The boost, in dB, to be applied. If the value is negative, the frequencies are attenuated.
    */
    lowshelf,
    /**
    * The highshelf filter is the opposite of the lowshelf filter and allows all frequencies through, but adds a boost to the higher frequencies. It implements a second-order highshelf filter
    *
    * ## frequency
    * The lower limit of the frequences where the boost (or attenuation) is applied.
    * ## Q
    * Not used in this filter type.
    * ## gain
    * The boost, in dB, to be applied. If the value is negative, the frequencies are attenuated.
    */
    highshelf,
    /**
    * The peaking filter allows all frequencies through, but adds a boost (or attenuation) to a range of frequencies.
    *
    * ## frequency
    * The center frequency of where the boost is applied.
    * ## Q
    * Controls the width of the band of frequencies that are boosted. A large value implies a narrow width.
    * ## gain
    * The boost, in dB, to be applied. If the value is negative, the frequencies are attenuated.
    */
    peaking,
    /**
    * The notch filter (also known as a band-stop or band-rejection filter) is the opposite of a bandpass filter. It allows all frequencies through, except for a set of frequencies.
    *
    * ## frequency
    * The center frequency of where the notch is applied.
    * ## Q
    * Controls the width of the band of frequencies that are attenuated. A large value implies a narrow width.
    * ## gain
    * Not used in this filter type.
    */
    notch,
    /**
    * An allpass filter allows all frequencies through, but changes the phase relationship between the various frequencies. It implements a second-order allpass filter
    *
    * ## frequency
    * The frequency where the center of the phase transition occurs. Viewed another way, this is the frequency with maximal group delay.
    * ## Q
    * Controls how sharp the phase transition is at the center frequency. A larger value implies a sharper transition and a larger group delay.
    * ## gain
    * Not used in this filter type.
    */
    allpass,
}
/**
* BiquadFilterNode is an AudioNode processor implementing very common low-order filters.
*
* Low-order filters are the building blocks of basic tone controls (bass, mid, treble), graphic equalizers, and more advanced filters. Multiple BiquadFilterNode filters can be combined to form more complex filters. The filter parameters such as "frequency" can be changed over time for filter sweeps, etc. Each BiquadFilterNode can be configured as one of a number of common filter types as shown in the IDL below. The default filter type is "lowpass"
*
*    numberOfInputs  : 1
*    numberOfOutputs : 1
*
* The filter types are briefly described below. We note that all of these filters are very commonly used in audio processing. In terms of implementation, they have all been derived from standard analog filter prototypes. For more technical details, we refer the reader to the excellent reference by Robert Bristow-Johnson.
*
* All parameters are k-rate with the following default parameter values:
*
* ## frequency
* 350Hz, with a nominal range of 10 to the Nyquist frequency (half the sample-rate).
* ## Q
* 1, with a nominal range of 0.0001 to 1000.
* ## gain
* 0, with a nominal range of -40 to 40.
*/
interface BiquadFilterNode extends AudioNode {
    type: BiquadFilterType;
    frequency: AudioParam;
    Q: AudioParam;
    gain: AudioParam;
    /**
    * Given the current filter parameter settings, calculates the frequency response for the specified frequencies.
    * @param frequencyHz an array of frequencies at which the response values will be calculated.
    * @param magResponse an output array receiving the linear magnitude response values.
    * @param phaseResponse an output array receiving the phase response values in radians.
    */
    getFrequencyResponse(frequencyHz: any, magResponse: any, phaseResponse: any): void;
}
/**
* WaveShaperNode is an AudioNode processor implementing non-linear distortion effects.
*
* Non-linear waveshaping distortion is commonly used for both subtle non-linear warming, or more obvious distortion effects. Arbitrary non-linear shaping curves may be specified.
*
*    numberOfInputs  : 1
*    numberOfOutputs : 1
*/
interface WaveShaperNode extends AudioNode {
    /**
    * The shaping curve used for the waveshaping effect. The input signal is nominally within the range -1 -> +1. Each input sample within this range will index into the shaping curve with a signal level of zero corresponding to the center value of the curve array. Any sample value less than -1 will correspond to the first value in the curve array. Any sample value less greater than +1 will correspond to the last value in the curve array.
    */
    curve: Float32Array;
}
declare enum OscillatorType {
    sine,
    square,
    sawtooth,
    triangle,
    custom,
}
/**
* OscillatorNode represents an audio source generating a periodic waveform. It can be set to a few commonly used waveforms. Additionally, it can be set to an arbitrary periodic waveform through the use of a WaveTable object.
*
* Oscillators are common foundational building blocks in audio synthesis. An OscillatorNode will start emitting sound at the time specified by the start() method.
*
* Mathematically speaking, a continuous-time periodic waveform can have very high (or infinitely high) frequency information when considered in the frequency domain. When this waveform is sampled as a discrete-time digital audio signal at a particular sample-rate, then care must be taken to discard (filter out) the high-frequency information higher than the Nyquist frequency (half the sample-rate) before converting the waveform to a digital form. If this is not done, then aliasing of higher frequencies (than the Nyquist frequency) will fold back as mirror images into frequencies lower than the Nyquist frequency. In many cases this will cause audibly objectionable artifacts. This is a basic and well understood principle of audio DSP.
*
* There are several practical approaches that an implementation may take to avoid this aliasing. But regardless of approach, the idealized discrete-time digital audio signal is well defined mathematically. The trade-off for the implementation is a matter of implementation cost (in terms of CPU usage) versus fidelity to achieving this ideal.
*
* It is expected that an implementation will take some care in achieving this ideal, but it is reasonable to consider lower-quality, less-costly approaches on lower-end hardware.
*
* Both .frequency and .detune are a-rate parameters and are used together to determine a computedFrequency value:
*
*     computedFrequency(t) = frequency(t) * pow(2, detune(t) / 1200)
*
* The OscillatorNode's instantaneous phase at each time is the time integral of computedFrequency.
*
*     numberOfInputs  : 0
*     numberOfOutputs : 1 (mono output)
*/
interface OscillatorNode extends AudioSourceNode {
    /**
    * The shape of the periodic waveform. It may directly be set to any of the type constant values except for "custom". The setWaveTable() method can be used to set a custom waveform, which results in this attribute being set to "custom". The default value is "sine".
    */
    type: OscillatorType;
    /**
    * defined as in AudioBufferSourceNode.
    * @readonly
    */
    playbackState: number;
    /**
    * The frequency (in Hertz) of the periodic waveform. This parameter is a-rate
    * @readonly
    */
    frequency: AudioParam;
    /**
    * A detuning value (in Cents) which will offset the frequency by the given amount. This parameter is a-rate
    */
    detune: AudioParam;
    /**
    * defined as in AudioBufferSourceNode.
    */
    start(when: number): void;
    /**
    * defined as in AudioBufferSourceNode.
    */
    stop(when: number): void;
    /**
    * Sets an arbitrary custom periodic waveform given a WaveTable.
    */
    setWaveTable(waveTable: WaveTable): void;
}
/**
* WaveTable represents an arbitrary periodic waveform to be used with an OscillatorNode. Please see createWaveTable() and setWaveTable() and for more details.
*/
interface WaveTable {
}
/**
* This interface represents an audio source from a MediaStream. The first AudioMediaStreamTrack from the MediaStream will be used as a source of audio.
*
*    numberOfInputs  : 0
*    numberOfOutputs : 1
*/
interface MediaStreamAudioSourceNode extends AudioSourceNode {
}
declare module Vapor {
    /**
    * The base class of all objects in Vapor.
    */
    class VaporObject {
        private name;
        /**
        * Gets the name of this VaporObject.
        */
        /**
        * Sets the name of this VaporObject.
        */
        public Name : string;
        /**
        * Creates a new instance of a VaporObject.
        */
        constructor(name?: string);
    }
}
declare module Vapor {
    /**
    * The base class for all functionality that is added to GameObjects.
    * @class Represents a Component
    */
    class Component extends VaporObject {
        /**
        * True if the component is enabled, and therefore Updated and Rendered.
        */
        private enabled;
        /**
        * Gets the enabled state of this Component.
        */
        /**
        * Sets the enabled state of this Component.
        */
        public Enabled : boolean;
        /**
        * The GameObject this Component is attached to
        */
        public gameObject: GameObject;
        /**
        * The Transform of the GameObject
        */
        public transform : Transform;
        /**
        * The Scene that this Component belongs to.
        */
        public scene : Scene;
        /**
        * Called as soon as this Component gets added to a GameObject
        */
        public Awake(): void;
        /**
        * Called when the parent GameObject gets added to a Scene.
        */
        public Start(): void;
        /**
        * Called once per frame.
        */
        public Update(): void;
        /**
        * Called once per frame.  Put rendering code inside here.
        */
        public Render(): void;
        /**
        * Called whenver collisions are detected via the physics engine (Box2D).
        */
        public OnCollision(contact: Box2D.Dynamics.Contacts.b2Contact): void;
    }
}
declare module Vapor {
    /**
    * Represents a Transform.
    * A Transform is what determines the translation (position), rotation (orientation),
    * and scale of a GameObject.
    */
    class Transform extends Component {
        /**
        * Gets the model (aka world, aka transformation) Matrix of the GameObject (before scaling).
        */
        public modelMatrix: Matrix;
        /**
        * The model matrix with the current scaling applied.
        */
        public ScaledModelMatrix : Matrix;
        /**
        * Gets the Quaternion representing the rotation of the GameObject.
        */
        public rotation: Quaternion;
        private eulerAngles;
        private scale;
        private scaleMatrix;
        constructor();
        /**
        * Gets and sets the position of the Transform.
        * @name Vapor.Transform.prototype.position
        * @property
        */
        public position : Vector3;
        /**
        * Gets the location relative to its parent.
        */
        /**
        * Sets the location relative to its parent.
        */
        public localPosition : Vector3;
        /**
        * Gets and sets the right Vector of the Transform.
        * TODO: Convert to use Quaternion:
        * http://nic-gamedev.blogspot.com/2011/11/quaternion-math-getting-local-axis.html
        * @name Vapor.Transform.prototype.right
        */
        public right : Vector3;
        /**
        * Gets and sets the up Vector of the Transform.
        * @name Vapor.Transform.prototype.up
        * @field
        */
        public up : Vector3;
        /**
        * Gets and sets the forward Vector of the Transform.
        * @name Vapor.Transform.prototype.forward
        * @field
        */
        public forward : Vector3;
        /**
        * Gets and sets the euler angles (rotation around X, Y, and Z) of the Transform.
        * @name Vapor.Transform.prototype.eulerAngles
        * @field
        */
        public EulerAngles : Vector3;
        /**
        * Gets and sets the position of the Transform.
        * @name Vapor.Transform.prototype.position
        * @property
        */
        public Scale : Vector3;
        /**
        * Sets the Transform to point at the given target position with the given world up vector.
        * @param {vec3} targetPosition The target position to look at.
        * @param {vec3} worldUp The world up vector.
        */
        public LookAt(targetPosition: Vector3, worldUp: Vector3): void;
        public Rotate(axis: Vector3, angle: number): void;
        public RotateLocalX(angle: number): void;
        public RotateLocalY(angle: number): void;
    }
}
declare module Vapor {
    /**
    * Represents the base object of everything that is in a Scene.
    * @class Represents a GameObject
    */
    class GameObject extends VaporObject {
        /**
        * The list of Components attached to this GameObject.
        */
        public components: Component[];
        /**
        * The list of GameObjects that are children to this GameObject.
        */
        public children: GameObject[];
        /**
        * The parent that this GameObject is a child of.
        */
        public parent: GameObject;
        /**
        * The Scene that this GameObject belongs to.
        */
        public scene: Scene;
        /**
        * The Transform attached to this GameObject.
        */
        public transform: Transform;
        /**
        * The Renderer attached to this GameObject, if there is one.
        */
        public renderer: Renderer;
        /**
        * The Collider attached to this GameObject, if there is one.
        */
        public collider: Collider;
        /**
        * The Box2D Body attached to this GameObject, if there is one.
        */
        public rigidbody: RigidBody;
        /**
        * The Camera attached to this GameObject, if there is one.
        */
        public camera: Camera;
        constructor();
        /**
        * Adds the given Component to this GameObject.
        * @param {Vapor.Component} component The Component to add.
        */
        public AddComponent(component: Component): void;
        /**
        * Called when the GameObject gets added to a Scene.
        */
        public Start(): void;
        /**
        * Gets the Component with the given name attached to this GameObject.
        * @param {string} name The name of the Component to get.
        * @returns {Vapor.Component} The Component, if it's found. Otherwise, null.
        */
        public GetComponentByName(name: string): Component;
        /**
        * Gets the component of the given type (including child types) attached to this GameObject, if there is one.
        * @param {any} type The type of the Component to get.  This can be a parent type as well.
        */
        public GetComponentByType(type: any): Component;
        /**
        * Adds the given GameObject as a child to this GameObject.
        * @param {Vapor.GameObject} child The GameObject child to add.
        */
        public AddChild(child: GameObject): void;
        /**
        * @private
        */
        public Update(): void;
        /**
        * @private
        */
        public Render(): void;
        public OnCollision(contact: Box2D.Dynamics.Contacts.b2Contact): void;
        /**
        * Creates a GameObject with a Camera Behavior already attached.
        * @returns {Vapor.GameObject} A new GameObject with a Camera.
        */
        static CreateCamera(): GameObject;
        /**
        * Creates a GameObject with a triangle Mesh and a MeshRenderer Behavior already attached.
        * @returns {Vapor.GameObject} A new GameObject with a triangle Mesh.
        */
        static CreateTriangle(): GameObject;
        /**
        * Creates a GameObject with a quad Mesh and a MeshRenderer Behavior already attached.
        * @returns {Vapor.GameObject} A new GameObject with a quad Mesh.
        */
        static CreateQuad(): GameObject;
        /**
        * Creates a GameObject with a line Mesh and a MeshRenderer Behavior already attached.
        * @returns {Vapor.GameObject} A new GameObject with a line Mesh.
        */
        static CreateLine(points: Vector3[], width?: number): GameObject;
        /**
        * Creates a GameObject with a circle Mesh and a MeshRenderer Behavior already attached.
        * @returns {Vapor.GameObject} A new GameObject with a quad Mesh.
        */
        static CreateCircle(radius?: number, segments?: number, startAngle?: number, angularSize?: number): GameObject;
    }
}
declare module Vapor {
    /**
    * A Scene is essentially a list of GameObjects.  It updates and renders all GameObjects
    * as well as holds a reference to a Canvas to render to.
    * @class Represents a Scene
    * @param {Vapor.Canvas} [canvas] The Canvas to use.  If not given, it creates its own.
    */
    class Scene extends VaporObject {
        /**
        * The list of GameObjects in the Scene.
        */
        public gameObjects: GameObject[];
        /**
        * The list of Camera Components in the Scene. (Don't add to this list!
        * Add the GameObject containing the Camera to Scene.gameObjects.)
        */
        public cameras: Camera[];
        /**
        * True if the game is paused.
        */
        public paused: boolean;
        /**
        * Gets the first camera in the scene.
        */
        public Camera : Camera;
        /**
        * The [Canvas] used to render the Scene.
        */
        public canvas: Canvas;
        /**
        * The Box2D physics world.
        */
        public world: Box2D.Dynamics.b2World;
        /**
        * The gravity vector used for Box2D.
        */
        private gravity;
        constructor(canvas?: Canvas, gravity?: Vector2);
        /**
        * Adds the given GameObject to the Scene.
        * @param {Vapor.GameObject} gameObject The GameObject to add.
        */
        public AddGameObject(gameObject: GameObject): void;
        /**
        * Removes the given [GameObject] from the [Scene].
        */
        public RemoveGameObject(gameObject: GameObject): void;
        /**
        * Clears all [GameObject]s out of the [Scene].
        */
        public Clear(): void;
        /**
        * @private
        */
        private Update(time);
        /**
        * @private
        */
        private Render();
        /**
        * @private
        */
        private WindowResized(event);
    }
}
declare module Vapor {
    /**
    * A Camera is what renders the GameObjects in the Scene.
    * @class Represents a Camera
    */
    class Camera extends Component {
        /**
        * The Color to clear the background to.  Defaults to UnityBlue.
        */
        public backgroundColor: Vector4;
        /**
        * The angle, in degrees, of the field of view of the Camera.  Defaults to 45.
        */
        public fieldOfView: number;
        /**
        * The aspect ratio (width/height) of the Camera.  Defaults to the GL viewport dimensions.
        */
        public aspect: number;
        /**
        * The distance to the near clipping plane of the Camera.  Defaults to 0.1.
        */
        public nearClipPlane: number;
        /**
        * The distance to the far clipping plane of the Camera.  Defaults to 1000.
        */
        public farClipPlane: number;
        /**
        * The current projection Matrix of the Camera.
        */
        public projectionMatrix: Matrix;
        constructor();
        /**
        * @private
        */
        public Awake(): void;
        /**
        * @private
        */
        public Update(): void;
        /**
        * @private
        * Clears the depth and color buffer.
        */
        public Clear(): void;
        /**
        * @private
        * Resets the projection matrix based on the window size.
        */
        public OnWindowResized(event: Event): void;
        public ScreenToWorld(screenPoint: Vector3, z?: number): Vector3;
        public WorldToScreen(worldPoint: Vector3): Vector3;
    }
}
declare module Vapor {
    class Canvas {
        /**
        * The HTML Canvas Element that is being used for rendering.
        */
        public element: HTMLCanvasElement;
        /**
        * Creates a new instance of a Canvas.
        * @constructor
        * @param {HTMLCanvasElement} [canvasElement] - The existing HTML Canvas Element to use.  If not provided, a new Canvas will be created and appended to the document.
        */
        constructor(canvasElement?: HTMLCanvasElement);
        /**
        *  Resizes the canvas based upon the current browser window size.
        */
        public Resize(): void;
    }
}
declare module Vapor {
    /**
    * Represents an instance of a Shader, with variables to set.
    * @class Represents a Material
    * @param {Vapor.Shader} shader The backing shader that this Material uses.
    */
    class Material extends VaporObject {
        public shader: Shader;
        public textureCount: number;
        private cache;
        private textureIndices;
        constructor(shader: Shader);
        /**
        * Sets up WebGL to use this Material (and backing Shader).
        */
        public Use(): void;
        /**
        * Sets up OpenGL to use this Material (and backing Shader) and sets up
        * the required vertex attributes (position, normal, tex coord, etc).
        */
        public Enable(): void;
        /**
        * Disables the vertex attributes (position, normal, tex coord, etc).
        */
        public Disable(): void;
        /**
        * Sets the matrix of the given name on this Material.
        * @param {string} name The name of the matrix variable to set.
        * @param {mat4} matrix The matrix value to set the variable to.
        */
        public SetMatrix(name: string, matrix: Matrix): void;
        /**
        * Sets the vector of the given name on this Material.
        * @param {string} name The name of the vector variable to set.
        * @param {Vector4} vector The vector value to set the variable to.
        */
        public SetVector(name: string, vector: Vector4): void;
        /**
        * Sets the texture of the given name on this Material.
        * @param {String} name The name of the texture variable to set.
        * @param {Texture2D} texture The texture value to set the variable to.
        */
        public SetTexture(name: string, texture: Texture2D): void;
        /**
        * Converts a normal int index into a WebGL.Texture# int index.
        */
        private TextureIndex(index);
    }
}
declare module Vapor {
    /**
    * Represents a 3D model that is rendered.
    * @class Represents a Mesh
    */
    class Mesh extends VaporObject {
        private vertices;
        public vertexBuffer: WebGLBuffer;
        public vertexCount: number;
        /**
        * Gets and sets the vertices making up this Mesh.
        * @name Vapor.Mesh.prototype.vertices
        * @property
        */
        public Vertices : Float32Array;
        private uv;
        public uvBuffer: WebGLBuffer;
        /**
        * Gets and sets the texture coodinates for each vertex making up this Mesh.
        * @name Vapor.Mesh.prototype.uv
        * @property
        */
        public UV : Float32Array;
        private normals;
        public normalBuffer: WebGLBuffer;
        /**
        * Gets and sets the normal vectors for each vertex making up this Mesh.
        * @name Vapor.Mesh.prototype.normals
        * @property
        */
        public Normals : Float32Array;
        private triangles;
        public indexBuffer: WebGLBuffer;
        public indexCount: number;
        /**
        * Gets and sets the index buffer of this Mesh. This defines which vertices make up what triangles.
        * @name Vapor.Mesh.prototype.triangles
        * @property
        */
        public Triangles : Uint16Array;
        /**
        * Draws the mesh using the given Material
        * @param {Vapor.Material} material The Material to use to render the mesh.
        */
        public Render(material: Material): void;
        /**
        * Creates a new Mesh containing data for a triangle.
        * @returns {Vapor.Mesh} The new Mesh representing a triangle.
        */
        static CreateTriangle(): Mesh;
        /**
        * Creates a new Mesh containing data for a quad.
        * @returns {Vapor.Mesh} The new Mesh representing a quad.
        */
        static CreateQuad(): Mesh;
        /**
        * Creates a new Mesh containing data for a line.
        * @returns {Vapor.Mesh} The new Mesh representing a line.
        */
        static CreateLine(points: Vector3[], width?: number): Mesh;
        /**
        * Creates a Mesh with vertices forming a 2D circle.
        * radius - Radius of the circle. Value should be greater than or equal to 0.0. Defaults to 1.0.
        * segments - The number of segments making up the circle. Value should be greater than or equal to 3. Defaults to 15.
        * startAngle - The starting angle of the circle.  Defaults to 0.
        * angularSize - The angular size of the circle.  2 pi is a full circle. Pi is a half circle. Defaults to 2 pi.
        */
        static CreateCircle(radius?: number, segments?: number, startAngle?: number, angularSize?: number): Mesh;
        /**
        * Convert a list of Vector3 objects into a Float32List object
        */
        private static CreateFloat32List3(vectorList);
        /**
        * Convert a list of Vector2 objects into a Float32List object
        */
        private static CreateFloat32List2(vectorList);
    }
}
declare module Vapor {
    /**
    * The base behavior that is used to render anything.
    * @class Represents a Renderer
    * @see Vapor.Behavior
    */
    class Renderer extends Component {
        /**
        * The Vapor.Material that this Renderer uses.
        * @type Vapor.Material
        */
        public material: Material;
        /**
        * @private
        */
        public Update(): void;
        /**
        * @private
        */
        public Render(): void;
    }
}
declare module Vapor {
    /**
    * Represents a Renderer behavior that is used to render a mesh.
    * @class Represents a MeshRenderer
    */
    class MeshRenderer extends Renderer {
        /**
        * The mesh that this MeshRenderer will draw.
        */
        public mesh: Mesh;
        /**
        * @private
        */
        public Render(): void;
    }
}
declare module Vapor {
    /**
    * Represents a shader program.
    * @class Represents a Shader
    */
    class Shader {
        public vertexShader: WebGLShader;
        public pixelShader: WebGLShader;
        public program: WebGLProgram;
        public filepath: string;
        public usesTexCoords: boolean;
        public usesNormals: boolean;
        public vertexPositionAttribute: number;
        public textureCoordAttribute: number;
        public vertexNormalAttribute: number;
        private static vertexShaderPreprocessor;
        private static pixelShaderPreprocessor;
        /**
        * Sets up WebGL to use this Shader.
        */
        public Use(): void;
        /**
        * Loads a shader from the given file path.
        * @param {string} filepath The filepath of the shader to load.
        * @returns {Vapor.Shader} The newly created Shader.
        */
        static FromFile(filepath: string, callback: (shader: Shader) => any): void;
        /**
        * Loads a shader from a script tag with the given ID.
        * @param {string} shaderScriptID The ID of the script tag to load as a Shader.
        * @returns {Vapor.Shader} The newly created Shader.
        */
        static FromScript(shaderScriptID: string): Shader;
        /**
        * Loads a shader from the given source code (text).
        * @param {string} shaderSource The full source (text) of the shader.
        * @param {string} [filepath] The current filepath to work from. (Used for including other shader code.)
        * @returns {Vapor.Shader} The newly created Shader.
        */
        static FromSource(shaderSource: string, filepath?: string): Shader;
        /**
        @private
        */
        private static LoadShaderSourceFromScript(shaderScriptID);
        private static PreprocessSource(shaderSource, filepath);
        /**
        @private
        */
        private static CompileShader(shaderType, source);
    }
}
declare module Vapor {
    /**
    * An enumeration of the different types of shader.
    */
    enum ShaderType {
        /**
        * The type for a Vertex Shader
        */
        VertexShader = 0,
        /**
        * The type for a Fragment (Pixel) Shader
        */
        FragmentShader = 1,
    }
}
declare module Vapor {
    class Texture2D extends VaporObject {
        /**
        * The actual HTML image element.
        */
        public image: HTMLImageElement;
        /**
        * The OpenGL Texture object.
        */
        public glTexture: WebGLTexture;
        /**
        * The callback that is called when the texture is done loading.
        * In the form: void Callback(Texture2D texture)
        */
        public LoadedCallback: (texture: Texture2D) => any;
        constructor(texturePath: string);
        private Loaded(e);
    }
}
declare module Vapor {
    class Keyboard {
        private static previousFrame;
        private static currentFrame;
        private static nextFrame;
        static Initialize(): void;
        private static KeyDown(event);
        private static KeyUp(event);
        /**
        * @private
        * Internal method to update the keyboard frame data (only used in Vapor.Game.Scene).
        */
        static Update(): void;
        /**
        * Gets the state for the given key code.
        * Returns true for every frame that the key is down, like autofire.
        * @param {Vapor.Input.KeyCode} keyCode The key code to check.
        * @returns {boolean} True if the key is currently down, otherwise false.
        */
        static GetKey(keyCode: number): boolean;
        /**
        * Returns true during the frame the user pressed the given key.
        * @param {Vapor.Input.KeyCode} keyCode The key code to check.
        * @returns {boolean} True if the key was pressed this frame, otherwise false.
        */
        static GetKeyDown(keyCode: number): boolean;
        /**
        * Returns true during the frame the user released the given key.
        * @param {Vapor.Input.KeyCode} keyCode The key code to check.
        * @returns {boolean} True if the key was released this frame, otherwise false.
        */
        static GetKeyUp(keyCode: number): boolean;
    }
}
declare module Vapor {
    /**
    * An enumeration of the different possible keys to press.
    */
    enum KeyCode {
        A = 65,
        B = 66,
        C = 67,
        D = 68,
        E = 69,
        F = 70,
        G = 71,
        H = 72,
        I = 73,
        J = 74,
        K = 75,
        L = 76,
        M = 77,
        N = 78,
        O = 79,
        P = 80,
        Q = 81,
        R = 82,
        S = 83,
        T = 84,
        U = 85,
        V = 86,
        W = 87,
        X = 88,
        Y = 89,
        Z = 90,
    }
}
declare module Vapor {
    class Vector3 {
        public data: Float32Array;
        public X : number;
        public Y : number;
        public Z : number;
        public XY : Vector2;
        /**
        * Creates a new instance of a Vector3 initialized to the given values or [0, 0, 0].
        * @constructor
        */
        constructor(x?: number, y?: number, z?: number);
        static Copy(other: Vector3): Vector3;
        /**
        * Adds the given Vector3 to this Vector3
        * @param {Vector3} other - The Vector3 to add to this one
        */
        public Add(other: Vector3): void;
        /**
        * Adds the given Vector3 objects together and returns the result.
        * @param {Vector3} a - The first Vector3 to add.
        * @param {Vector3} b - The second Vector3 to add.
        * @returns {Vector3} The sum of a and b.
        */
        static Add(a: Vector3, b: Vector3): Vector3;
        /**
        * Subtracts the given Vector3 from this Vector3.
        *
        * @param {Vector3} other - The Vector3 to subtract from this one
        */
        public Subtract(other: Vector3): void;
        public ApplyProjection(arg: Matrix): Vector3;
    }
}
declare module Vapor {
    class Mouse {
        private static previousFrame;
        private static currentFrame;
        private static nextFrame;
        private static nextMousePosition;
        private static mousePosition;
        private static deltaMousePosition;
        static Initialize(): void;
        private static MouseDown(event);
        private static MouseUp(event);
        private static MouseMove(event);
        /**
        * @private
        * Internal method to update the mouse frame data (only used in Vapor.Game.Scene).
        */
        static Update(): void;
        /**
        * Gets the state for the given mouse button index.
        * Returns true for every frame that the button is down, like autofire.
        * @param {int} button The mouse button index to check. 0 = left, 1 = middle, 2 = right.
        * @returns {boolean} True if the button is currently down, otherwise false.
        */
        static GetMouseButton(button: number): boolean;
        /**
        * Returns true during the frame the user pressed the given mouse button.
        * @param {int} button The mouse button index to check. 0 = left, 1 = middle, 2 = right.
        * @returns {boolean} True if the button was pressed this frame, otherwise false.
        */
        static GetMouseButtonDown(button: number): boolean;
        /**
        * Returns true during the frame the user releases the given mouse button.
        * @param {int} button The mouse button index to check. 0 = left, 1 = middle, 2 = right.
        * @returns {boolean} True if the button was released this frame, otherwise false.
        */
        static GetMouseButtonUp(button: number): boolean;
    }
}
declare module Vapor {
    class TouchInput {
        private static previousFrame;
        private static currentFrame;
        private static nextFrame;
        static Initialize(): void;
        private static TouchStart(event);
        private static TouchEnd(event);
        private static TouchMove(event);
        /**
        * @private
        * Internal method to update the mouse frame data (only used in Vapor.Game.Scene).
        */
        static Update(): void;
        /**
        * Gets the touch object stored at the given index.
        * @param {int} index The index of the touch to get.
        * @returns {Vapor.Input.Touch} The touch object at the given index
        */
        static GetTouch(index: number): TouchData;
        /**
        * Number of touches. Guaranteed not to change throughout the frame.
        */
        static TouchCount : number;
    }
}
interface Touch {
    identifier: number;
    target: EventTarget;
    screenX: number;
    screenY: number;
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
}
interface TouchList {
    length: number;
    item(index: number): Touch;
    identifiedTouch(identifier: number): Touch;
}
interface TouchEvent extends UIEvent {
    touches: TouchList;
    targetTouches: TouchList;
    changedTouches: TouchList;
    altKey: boolean;
    metaKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    initTouchEvent(type: string, canBubble: boolean, cancelable: boolean, view: Window, detail: number, ctrlKey: boolean, altKey: boolean, shiftKey: boolean, metaKey: boolean, touches: TouchList, targetTouches: TouchList, changedTouches: TouchList): any;
}
declare var TouchEvent: {
    prototype: TouchEvent;
    new(): TouchEvent;
};
interface HTMLElement extends Element, ElementCSSInlineStyle, MSEventAttachmentTarget, MSNodeExtensions {
    ontouchstart: (ev: TouchEvent) => any;
    ontouchmove: (ev: TouchEvent) => any;
    ontouchend: (ev: TouchEvent) => any;
    ontouchcancel: (ev: TouchEvent) => any;
}
interface Document extends Node, NodeSelector, MSEventAttachmentTarget, DocumentEvent, MSResourceMetadata, MSNodeExtensions {
    ontouchstart: (ev: TouchEvent) => any;
    ontouchmove: (ev: TouchEvent) => any;
    ontouchend: (ev: TouchEvent) => any;
    ontouchcancel: (ev: TouchEvent) => any;
}
declare module Vapor {
    /**
    * Contains the data for a certain touch.
    */
    class TouchData {
        /**
        * The unique index for touch.
        */
        public fingerId: number;
        /**
        * The position of the touch.
        */
        public position: Vector3;
        /**
        * The position delta since last change.
        */
        public deltaPosition: Vector3;
        /**
        * Amount of time passed since last change.
        */
        public deltaTime: number;
        /**
        * Number of taps.
        */
        public tapCount: number;
        /**
        * Describes the phase of the touch.
        */
        public phase: TouchPhase;
    }
}
declare module Vapor {
    /**
    * Enumeration of the possible touch phases.
    */
    enum TouchPhase {
        /**
        * A finger touched the screen.
        */
        Began = 0,
        /**
        * A finger moved on the screen.
        */
        Moved = 1,
        /**
        * A finger is touching the screen but hasn't moved.
        */
        Stationary = 2,
        /**
        * A finger was lifted from the screen. This is the final phase of a touch.
        */
        Ended = 3,
        /**
        * The system cancelled tracking for the touch. This is the final phase of a touch.
        */
        Canceled = 4,
    }
}
declare module Vapor {
    class Vector4 {
        public data: Float32Array;
        public X : number;
        public Y : number;
        public Z : number;
        public W : number;
        /**
        * Creates a new instance of a Vector4 initialized to the given values or [0, 0, 0, 0].
        * @constructor
        */
        constructor(x?: number, y?: number, z?: number, w?: number);
        static Copy(other: Vector4): Vector4;
        /**
        * Adds the given Vector4 to this Vector4
        * @param {Vector4} other - The Vector4 to add to this one
        */
        public Add(other: Vector4): void;
        /**
        * Adds the given Vector4 objects together and returns the result.
        * @param {Vector4} a - The first Vector4 to add.
        * @param {Vector4} b - The second Vector4 to add.
        * @returns {Vector4} The sum of a and b.
        */
        static Add(a: Vector4, b: Vector4): Vector4;
        /**
        * Subtracts the given Vector4 from this Vector4.
        *
        * @param {Vector4} other - The Vector4 to subtract from this one
        */
        public Subtract(other: Vector4): void;
    }
}
declare module Vapor {
    class Color {
        /**
        * Creates a new Color from the given integers.
        * @param {number} r Red. 0-255.
        * @param {number} g Green. 0-255.
        * @param {number} b Blue. 0-255.
        * @param {number} a Alpha. 0-255.
        * @returns {Vector4} The new Color.
        */
        static FromInts(r: number, g: number, b: number, a: number): Vector4;
        /**
        * Red (255, 0, 0, 255)
        */
        static Red: Vector4;
        /**
        * Green (0, 255, 0, 255)
        */
        static Green: Vector4;
        /**
        * Blue (0, 0, 255, 255)
        */
        static Blue: Vector4;
        /**
        * Cornflower Blue (100, 149, 237, 255)
        */
        static CornflowerBlue: Vector4;
        /**
        * Unity Blue (49, 77, 121, 255)
        */
        static UnityBlue: Vector4;
        /**
        * Solid Black (0, 0, 0, 255)
        */
        static SolidBlack: Vector4;
        /**
        * Solid White (255, 255, 255, 255)
        */
        static SolidWhite: Vector4;
        /**
        * Transparent Black (0, 0, 0, 0)
        */
        static TransparentBlack: Vector4;
        /**
        * Transparent White (255, 255, 255, 0)
        */
        static TransparentWhite: Vector4;
    }
}
declare module Vapor {
    class BoundingBox2D {
        private min;
        private max;
        public Min : Vector2;
        public Max : Vector2;
        /**
        * Creates a new instance of a BoundingBox2D initialized to the given values or 0s.
        * @constructor
        */
        constructor(min?: Vector2, max?: Vector2);
        /**
        * Return true if this intersects with given BoundingBox.
        * @param {BoundingBox2D} other - The BoundingBox2D to check intersection with.
        */
        public IntersectsBoundingBox(other: BoundingBox2D): boolean;
    }
}
declare module Vapor {
    class BoundingBox3D {
        private min;
        private max;
        public Min : Vector3;
        public Max : Vector3;
        /**
        * Creates a new instance of a BoundingBox3D initialized to the given values or 0s.
        * @constructor
        */
        constructor(min?: Vector3, max?: Vector3);
        /**
        * Return true if this intersects with given BoundingBox.
        * @param {BoundingBox3D} other - The BoundingBox3D to check intersection with.
        */
        public IntersectsBoundingBox(other: BoundingBox3D): boolean;
    }
}
declare module Vapor {
    class MathHelper {
        static ToRadians(degrees: number): number;
    }
}
declare module Vapor {
    class Matrix {
        public data: Float32Array;
        private static EPSILON;
        /**
        * Creates a new instance of a Matrix initialized to the identity matrix.
        * @constructor
        */
        constructor();
        public SetIdentity(): void;
        public SetZero(): void;
        static Copy(other: Matrix): Matrix;
        /**
        * Multiplies two Matrix objects.
        *
        * @param {Matrix} a - The first operand
        * @param {Matrix} b - The second operand
        * @returns {Matrix} The result of the multiplication.
        */
        static Multiply(a: Matrix, b: Matrix): Matrix;
        /**
        * Rotates this Matrix by the given angle
        *
        * @param {Vector3} axis - The axis to rotate around
        * @param {Number} angle - The angle to rotate the matrix by (in radians)
        */
        public Rotate(axis: Vector3, angle: number): any;
        /**
        * Scales this Matrix by the dimensions in the given Vector3
        *
        * @param {Vector3} scale - The Vector3 to scale the matrix by
        **/
        public Scale(scale: Vector3): void;
        /**
        * Sets this Matrix to the given rotation (Quaternion) and translation (Vector3)
        *
        * @param {Vector3} position - Translation vector
        * @param {Quaternion} rotation - Rotation quaternion
        */
        public FromTranslationRotation(position: Vector3, rotation: Quaternion): void;
        /**
        * Generates a look-at matrix with the given eye position, focal point, and up axis
        *
        * @param {vec3} eye Position of the viewer
        * @param {vec3} center Point the viewer is looking at
        * @param {vec3} up vec3 pointing up
        */
        public SetLookAt(eye: Vector3, center: Vector3, up: Vector3): void;
        /**
        * Constructs an OpenGL perspective projection matrix in this Matrix.
        *
        * [fovYRadians] specifies the field of view angle, in radians, in the y direction.
        * [aspectRatio] specifies the aspect ratio that determines the field of view in the x direction.
        *  The aspect ratio of x (width) to y (height).
        * [zNear] specifies the distance from the viewer to the near plane (always positive).
        * [zFar] specifies the distance from the viewer to the far plane (always positive).
        */
        public SetPerspectiveMatrix(fovYRadians: number, aspectRatio: number, zNear: number, zFar: number): void;
        /**
        * Constructs an OpenGL perspective projection matrix in this Matrix.
        *
        * [left], [right] specify the coordinates for the left and right vertical clipping planes.
        * [bottom], [top] specify the coordinates for the bottom and top horizontal clipping planes.
        * [near], [far] specify the coordinates to the near and far depth clipping planes.
        */
        public SetFrustumMatrix(left: number, right: number, bottom: number, top: number, near: number, far: number): void;
        /**
        * On success, Sets [pickWorld] to be the world space position of
        * the screen space [pickX], [pickY], and [pickZ].
        *
        * The viewport is specified by ([viewportX], [viewportWidth]) and
        * ([viewportY], [viewportHeight]).
        *
        * [cameraMatrix] includes both the projection and view transforms.
        *
        * [pickZ] is typically either 0.0 (near plane) or 1.0 (far plane).
        *
        * Returns false on error, for example, the mouse is not in the viewport
        *
        */
        static Unproject(cameraMatrix: Matrix, viewportX: number, viewportWidth: number, viewportY: number, viewportHeight: number, pickX: number, pickY: number, pickZ: number, pickWorld: Vector3): boolean;
        public Invert(): number;
        /**
        * Transforms the given Vector4 by this Matrix.
        *
        */
        public Transform(arg: Vector4): Vector4;
    }
}
declare module Vapor {
    class Quaternion {
        public data: Float32Array;
        /**
        * Creates a new instance of a Quaternion initialized to the identity.
        * @constructor
        */
        constructor();
        /**
        * Set quaternion with rotation of yaw, pitch and roll stored in the given Vector3.
        */
        public SetEuler(eulerAngles: Vector3): void;
    }
}
declare module Vapor {
    class Vector2 {
        public data: Float32Array;
        public X : number;
        public Y : number;
        /**
        * Creates a new instance of a Vector3 initialized to the given values or [0, 0].
        * @constructor
        */
        constructor(x?: number, y?: number);
        /**
        * Adds the given Vector2 to this Vector2
        * @param {Vector2} other - The Vector2 to add to this one
        */
        public Add(other: Vector2): void;
        /**
        * Adds the given Vector2 objects together and returns the result.
        * @param {Vector2} a - The first Vector2 to add.
        * @param {Vector2} b - The second Vector2 to add.
        * @returns {Vector2} The sum of a and b.
        */
        static Add(a: Vector2, b: Vector2): Vector2;
    }
}
/**
* Box2DWeb-2.1.d.ts Copyright (c) 2012-2013 Josh Baldwin http://github.com/jbaldwin/box2dweb.d.ts
* There are a few competing javascript Box2D ports.
* This definitions file is for Box2dWeb.js ->
*   http://code.google.com/p/box2dweb/
*
* Box2D C++ Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
*    claim that you wrote the original software. If you use this software
*    in a product, an acknowledgment in the product documentation would be
*    appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
*    misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
**/
declare module Box2D.Common {
    /**
    * Color for debug drawing.  Each value has the range [0, 1].
    **/
    class b2Color {
        /**
        * Red
        **/
        public r: number;
        /**
        * Green
        **/
        public g: number;
        /**
        * Blue
        **/
        public b: number;
        /**
        * RGB color as hex.
        * @type uint
        **/
        public color: number;
        /**
        * Constructor
        * @param rr Red value
        * @param gg Green value
        * @param bb Blue value
        **/
        constructor(rr: number, gg: number, bb: number);
        /**
        * Sets the Color to new RGB values.
        * @param rr Red value
        * @param gg Green value
        * @param bb Blue value
        **/
        public Set(rr: number, gg: number, bb: number): void;
    }
}
declare module Box2D.Common {
    /**
    * Controls Box2D global settings.
    **/
    class b2Settings {
        /**
        * b2Assert is used internally to handle assertions. By default, calls are commented out to save performance, so they serve more as documentation than anything else.
        * @param a Asset an expression is true.
        **/
        static b2Assert(a: boolean): void;
        /**
        * Friction mixing law. Feel free to customize this.
        * Friction values are usually set between 0 and 1. (0 = no friction, 1 = high friction)
        * By default this is `return Math.sqrt(friction1, friction2);`
        * @param friction1 Friction 1 to mix.
        * @param friction2 Friction 2 to mix.
        * @return The two frictions mixed as one value.
        **/
        static b2MixFriction(friction1: number, friction2: number): number;
        /**
        * Restitution mixing law. Feel free to customize this.  Restitution is used to make objects bounce.
        * Restitution values are usually set between 0 and 1. (0 = no bounce (inelastic), 1 = perfect bounce (perfectly elastic))
        * By default this is `return Math.Max(restitution1, restitution2);`
        * @param restitution1 Restitution 1 to mix.
        * @param restitution2 Restitution 2 to mix.
        * @return The two restitutions mixed as one value.
        **/
        static b2MixRestitution(restitution1: number, restitution2: number): number;
        /**
        * This is used to fatten AABBs in the dynamic tree. This allows proxies to move by a small amount without triggering a tree adjustment. This is in meters.
        **/
        static b2_aabbExtension: number;
        /**
        * This is used to fatten AABBs in the dynamic tree. This is used to predict the future position based on the current displacement. This is a dimensionless multiplier.
        **/
        static b2_aabbMultiplier: number;
        /**
        * A body cannot sleep if its angular velocity is above this tolerance.
        **/
        static b2_angularSleepTolerance: number;
        /**
        * A small angle used as a collision and constraint tolerance. Usually it is chosen to be numerically significant, but visually insignificant.
        **/
        static b2_angularSlop: number;
        /**
        * This scale factor controls how fast overlap is resolved. Ideally this would be 1 so that overlap is removed in one time step. However using values close to 1 often lead to overshoot.
        **/
        static b2_contactBaumgarte: number;
        /**
        * A body cannot sleep if its linear velocity is above this tolerance.
        **/
        static b2_linearSleepTolerance: number;
        /**
        * A small length used as a collision and constraint tolerance. Usually it is chosen to be numerically significant, but visually insignificant.
        **/
        static b2_linearSlop: number;
        /**
        * The maximum angular position correction used when solving constraints. This helps to prevent overshoot.
        **/
        static b2_maxAngularCorrection: number;
        /**
        * The maximum linear position correction used when solving constraints. This helps to prevent overshoot.
        **/
        static b2_maxLinearCorrection: number;
        /**
        * Number of manifold points in a b2Manifold. This should NEVER change.
        **/
        static b2_maxManifoldPoints: number;
        /**
        * The maximum angular velocity of a body. This limit is very large and is used to prevent numerical problems. You shouldn't need to adjust this.
        **/
        static b2_maxRotation: number;
        /**
        * b2_maxRotation squared
        **/
        static b2_maxRotationSquared: number;
        /**
        * Maximum number of contacts to be handled to solve a TOI island.
        **/
        static b2_maxTOIContactsPerIsland: number;
        /**
        * Maximum number of joints to be handled to solve a TOI island.
        **/
        static b2_maxTOIJointsPerIsland: number;
        /**
        * The maximum linear velocity of a body. This limit is very large and is used to prevent numerical problems. You shouldn't need to adjust this.
        **/
        static b2_maxTranslation: number;
        /**
        * b2_maxTranslation squared
        **/
        static b2_maxTranslationSquared: number;
        /**
        * 3.141592653589793
        **/
        static b2_pi: number;
        /**
        * The radius of the polygon/edge shape skin. This should not be modified. Making this smaller means polygons will have and insufficient for continuous collision. Making it larger may create artifacts for vertex collision.
        **/
        static b2_polygonRadius: number;
        /**
        * The time that a body must be still before it will go to sleep.
        **/
        static b2_timeToSleep: number;
        /**
        * Continuous collision detection (CCD) works with core, shrunken shapes. This is the amount by which shapes are automatically shrunk to work with CCD. This must be larger than b2_linearSlop.
        * @see also b2_linearSlop
        **/
        static b2_toiSlop: number;
        /**
        * A velocity threshold for elastic collisions. Any collision with a relative linear velocity below this threshold will be treated as inelastic.
        **/
        static b2_velocityThreshold: number;
        /**
        * Maximum unsigned short value.
        **/
        static USHRT_MAX: number;
        /**
        * The current version of Box2D.
        **/
        static VERSION: string;
    }
}
declare module Box2D.Common.Math {
    /**
    * A 2-by-2 matrix.  Stored in column-major order.
    **/
    class b2Mat22 {
        /**
        * Column 1
        **/
        public col1: b2Vec2;
        /**
        * Column 2
        **/
        public col2: b2Vec2;
        /**
        * Empty constructor
        **/
        constructor();
        /**
        * Sets all internal matrix values to absolute values.
        **/
        public Abs(): void;
        /**
        * Adds the two 2x2 matricies together and stores the result in this matrix.
        * @param m 2x2 matrix to add.
        **/
        public AddM(m: b2Mat22): void;
        /**
        * Creates a copy of the matrix.
        * @return Copy of this 2x2 matrix.
        **/
        public Copy(): b2Mat22;
        /**
        * Creates a rotation 2x2 matrix from the given angle.
        * R(theta) = [ cos(theta)  -sin(theta) ]
        *            [ sin(theta)   cos(theta) ]
        * @param angle Matrix angle (theta).
        * @return 2x2 matrix.
        **/
        static FromAngle(angle: number): b2Mat22;
        /**
        * Creates a 2x2 matrix from two columns.
        * @param c1 Column 1 vector.
        * @param c2 Column 2 vector.
        * @return 2x2 matrix.
        **/
        static FromVV(c1: b2Vec2, c2: b2Vec2): b2Mat22;
        /**
        * Gets the rotation matrix angle.
        * R(theta) = [ cos(theta)  -sin(theta) ]
        *            [ sin(theta)   cos(theta) ]
        * @return The rotation matrix angle (theta).
        **/
        public GetAngle(): number;
        /**
        * Compute the inverse of this matrix, such that inv(A) A = identity.
        * @param out Inverse matrix.
        * @return Inverse matrix.
        **/
        public GetInverse(out: b2Mat22): b2Mat22;
        /**
        * Sets the 2x2 rotation matrix from the given angle.
        * R(theta) = [ cos(theta)  -sin(theta) ]
        *            [ sin(theta)   cos(theta) ]
        * @param angle Matrix angle (theta).
        **/
        public Set(angle: number): void;
        /**
        * Sets the 2x2 matrix to identity.
        **/
        public SetIdentity(): void;
        /**
        * Sets the 2x2 matrix from a 2x2 matrix.
        * @param m 2x2 matrix values.
        **/
        public SetM(m: b2Mat22): void;
        /**
        * Sets the 2x2 matrix from 2 column vectors.
        * @param c1 Column 1 vector.
        * @param c2 Column 2 vector.
        **/
        public SetVV(c1: b2Vec2, c2: b2Vec2): void;
        /**
        * Sets the 2x2 matrix to all zeros.
        **/
        public SetZero(): void;
        /**
        * TODO, has something to do with the determinant
        * @param out Solved vector
        * @param bX
        * @param bY
        * @return Solved vector
        **/
        public Solve(out: b2Vec2, bX: number, bY: number): b2Vec2;
    }
}
declare module Box2D.Common.Math {
    /**
    * A 3-by3 matrix.  Stored in column-major order.
    **/
    class b2Mat33 {
        /**
        * Column 1
        **/
        public col1: b2Vec3;
        /**
        * Column 2
        **/
        public col2: b2Vec3;
        /**
        * Column 3
        **/
        public col3: b2Vec3;
        /**
        * Constructor
        * @param c1 Column 1
        * @param c2 Column 2
        * @param c3 Column 3
        **/
        constructor(c1: b2Vec3, c2: b2Vec3, c3: b2Vec3);
        /**
        * Adds the two 3x3 matricies together and stores the result in this matrix.
        * @param m 3x3 matrix to add.
        **/
        public AddM(m: b2Mat33): void;
        /**
        * Creates a copy of the matrix.
        * @return Copy of this 3x3 matrix.
        **/
        public Copy(): b2Mat33;
        /**
        * Sets the 3x3 matrix to identity.
        **/
        public SetIdentity(): void;
        /**
        * Sets the 3x3 matrix from a 3x3 matrix.
        * @param m 3x3 matrix values.
        **/
        public SetM(m: b2Mat33): void;
        /**
        * Sets the 3x3 matrix from 3 column vectors.
        * @param c1 Column 1 vector.
        * @param c2 Column 2 vector.
        * @param c3 Column 2 vector.
        **/
        public SetVVV(c1: b2Vec3, c2: b2Vec3, c3: b2Vec3): void;
        /**
        * Sets the 3x3 matrix to all zeros.
        **/
        public SetZero(): void;
        /**
        * TODO, has something to do with the determinant
        * @param out Solved vector
        * @param bX
        * @param bY
        * @return Solved vector
        **/
        public Solve22(out: b2Vec2, bX: number, bY: number): b2Vec2;
        /**
        * TODO, has something to do with the determinant
        * @param out Solved vector
        * @param bX
        * @param bY
        * @param bZ
        * @return Solved vector
        **/
        public Solve33(out: b2Vec3, bX: number, bY: number, bZ: number): b2Vec3;
    }
}
declare module Box2D.Common.Math {
    /**
    * Math utility functions.
    **/
    class b2Math {
        /**
        * Determines if a number is valid.  A number is valid if it is finite.
        * @param x Number to check for validity.
        * @return True if x is valid, otherwise false.
        **/
        static IsValid(x: number): boolean;
        /**
        * Dot product of two vector 2s.
        * @param a Vector 2 to use in dot product.
        * @param b Vector 2 to use in dot product.
        * @return Dot product of a and b.
        **/
        static Dot(a: b2Vec2, b: b2Vec2): number;
        /**
        * Cross product of two vector 2s.
        * @param a Vector 2 to use in cross product.
        * @param b Vector 2 to use in cross product.
        * @return Cross product of a and b.
        **/
        static CrossVV(a: b2Vec2, b: b2Vec2): number;
        /**
        * Cross product of vector 2 and s.
        * @param a Vector 2 to use in cross product.
        * @param s s value.
        * @return Cross product of a and s.
        **/
        static CrossVF(a: b2Vec2, s: number): b2Vec2;
        /**
        * Cross product of s and vector 2.
        * @param s s value.
        * @param a Vector 2 to use in cross product.
        * @return Cross product of s and a.
        **/
        static CrossFV(s: number, a: b2Vec2): b2Vec2;
        /**
        * Multiply matrix and vector.
        * @param A Matrix.
        * @param v Vector.
        * @return Result.
        **/
        static MulMV(A: b2Mat22, v: b2Vec2): b2Vec2;
        /**
        *
        * @param A
        * @param v
        * @return
        **/
        static MulTMV(A: b2Mat22, v: b2Vec2): b2Vec2;
        /**
        *
        * @param T
        * @param v
        * @return
        **/
        static MulX(T: b2Transform, v: b2Vec2): b2Vec2;
        /**
        *
        * @param T
        * @param v
        * @return
        **/
        static MulXT(T: b2Transform, v: b2Vec2): b2Vec2;
        /**
        * Adds two vectors.
        * @param a First vector.
        * @param b Second vector.
        * @return a + b.
        **/
        static AddVV(a: b2Vec2, b: b2Vec2): b2Vec2;
        /**
        * Subtracts two vectors.
        * @param a First vector.
        * @param b Second vector.
        * @return a - b.
        **/
        static SubtractVV(a: b2Vec2, b: b2Vec2): b2Vec2;
        /**
        * Calculates the distance between two vectors.
        * @param a First vector.
        * @param b Second vector.
        * @return Distance between a and b.
        **/
        static Distance(a: b2Vec2, b: b2Vec2): number;
        /**
        * Calculates the squared distance between two vectors.
        * @param a First vector.
        * @param b Second vector.
        * @return dist^2 between a and b.
        **/
        static DistanceSquared(a: b2Vec2, b: b2Vec2): number;
        /**
        *
        * @param s
        * @param a
        * @return
        **/
        static MulFV(s: number, a: b2Vec2): b2Vec2;
        /**
        *
        * @param A
        * @param B
        * @return
        **/
        static AddMM(A: b2Mat22, B: b2Mat22): b2Mat22;
        /**
        *
        * @param A
        * @param B
        * @return
        **/
        static MulMM(A: b2Mat22, B: b2Mat22): b2Mat22;
        /**
        *
        * @param A
        * @param B
        * @return
        **/
        static MulTMM(A: b2Mat22, B: b2Mat22): b2Mat22;
        /**
        * Creates an ABS number.
        * @param a Number to ABS.
        * @return Absolute value of a.
        **/
        static Abs(a: number): number;
        /**
        * Creates an ABS vector.
        * @param a Vector to ABS all values.
        * @return Vector with all positive values.
        **/
        static AbsV(a: b2Vec2): b2Vec2;
        /**
        * Creates an ABS matrix.
        * @param A Matrix to ABS all values.
        * @return Matrix with all positive values.
        **/
        static AbsM(A: b2Mat22): b2Mat22;
        /**
        * Determines the minimum number.
        * @param a First number.
        * @param b Second number.
        * @return a or b depending on which is the minimum.
        **/
        static Min(a: number, b: number): number;
        /**
        * Determines the minimum vector.
        * @param a First vector.
        * @param b Second vector.
        * @return a or b depending on which is the minimum.
        **/
        static MinV(a: b2Vec2, b: b2Vec2): b2Vec2;
        /**
        * Determines the max number.
        * @param a First number.
        * @param b Second number.
        * @return a or b depending on which is the maximum.
        **/
        static Max(a: number, b: number): number;
        /**
        * Determines the max vector.
        * @param a First vector.
        * @param b Second vector.
        * @return a or b depending on which is the maximum.
        **/
        static MaxV(a: b2Vec2, b: b2Vec2): b2Vec2;
        /**
        * Clamp a number to the range of low to high.
        * @param a Number to clamp.
        * @param low Low range.
        * @param high High range.
        * @return Number a clamped to range of low to high.
        **/
        static Clamp(a: number, low: number, high: number): number;
        /**
        * Clamps a vector to the range of low to high.
        * @param a Vector to clamp.
        * @param low Low range.
        * @param high High range.
        * @return Vector a clamped to range of low to high.
        **/
        static ClampV(a: b2Vec2, low: b2Vec2, high: b2Vec2): b2Vec2;
        /**
        * Swaps a and b objects.
        * @param a a -> b.
        * @param b b -> a.
        **/
        static Swap(a: any, b: any): void;
        /**
        * Generates a random number.
        * @param return Random number.
        **/
        static Random(): number;
        /**
        * Returns a random number between lo and hi.
        * @param lo Lowest random number.
        * @param hi Highest random number.
        * @return Number between lo and hi.
        **/
        static RandomRange(lo: number, hi: number): number;
        /**
        * Calculates the next power of 2 after the given number.
        * @param x Number to start search for the next power of 2.
        * @return The next number that is a power of 2.
        **/
        static NextPowerOfTwo(x: number): number;
        /**
        * Check if a number is a power of 2.
        * @param x Number to check if it is a power of 2.
        * @return True if x is a power of 2, otherwise false.
        **/
        static IsPowerOfTwo(x: number): boolean;
        /**
        * Global instance of a zero'ed vector.  Use as read-only.
        **/
        static b2Vec2_zero: b2Vec2;
        /**
        * Global instance of a 2x2 identity matrix.  Use as read-only.
        **/
        static b2Mat22_identity: b2Mat22;
        /**
        * Global instance of an identity transform.  Use as read-only.
        **/
        static b2Transform_identity: b2Transform;
    }
}
declare module Box2D.Common.Math {
    /**
    * This describes the motion of a body/shape for TOI computation. Shapes are defined with respect to the body origin, which may no coincide with the center of mass. However, to support dynamics we must interpolate the center of mass position.
    **/
    class b2Sweep {
        /**
        * World angle.
        **/
        public a: number;
        /**
        * World angle.
        **/
        public a0: number;
        /**
        * Center world position.
        **/
        public c: b2Vec2;
        /**
        * Center world position.
        **/
        public c0: b2Vec2;
        /**
        * Local center of mass position.
        **/
        public localCenter: b2Vec2;
        /**
        * Time interval = [t0,1], where t0 is in [0,1].
        **/
        public t0: b2Vec2;
        /**
        * Advance the sweep forward, yielding a new initial state.
        * @t The new initial time.
        **/
        public Advance(t: number): void;
        /**
        * Creates a copy of the sweep.
        **/
        public Copy(): b2Sweep;
        /**
        * Get the interpolated transform at a specific time.
        * @param xf Transform at specified time, this is an out parameter.
        * @param alpha Is a factor in [0,1], where 0 indicates t0.
        **/
        public GetTransform(xf: b2Transform, alpha: number): void;
        /**
        * Sets the sweep from a sweep.
        * @param other Sweep values to copy from.
        **/
        public Set(other: b2Sweep): void;
    }
}
declare module Box2D.Common.Math {
    /**
    * A transform contains translation and rotation. It is used to represent the position and orientation of rigid frames.
    **/
    class b2Transform {
        /**
        * Transform position.
        **/
        public position: b2Vec2;
        /**
        * Transform rotation.
        **/
        public R: b2Mat22;
        /**
        * The default constructor does nothing (for performance).
        * @param pos Position
        * @param r Rotation
        **/
        constructor(pos: b2Vec2, r: b2Mat22);
        /**
        * Calculate the angle that the rotation matrix represents.
        * @return Rotation matrix angle.
        **/
        public GetAngle(): number;
        /**
        * Initialize using a position vector and rotation matrix.
        * @param pos Position
        * @param r Rotation
        **/
        public Initialize(pos: b2Vec2, r: b2Mat22): void;
        /**
        * Sets the transfrom from a transfrom.
        * @param x Transform to copy values from.
        **/
        public Set(x: b2Transform): void;
        /**
        * Set this to the identity transform.
        **/
        public SetIdentity(): void;
    }
}
declare module Box2D.Common.Math {
    /**
    * A 2D column vector.
    **/
    class b2Vec2 {
        /**
        * x value
        **/
        public x: number;
        /**
        * y value
        **/
        public y: number;
        /**
        * Creates a new vector 2.
        * @param x x value, default = 0.
        * @param y y value, default = 0.
        **/
        constructor(x?: number, y?: number);
        /**
        * Sets x and y to absolute values.
        **/
        public Abs(): void;
        /**
        * Adds the vector 2 to this vector 2.  The result is stored in this vector 2.
        * @param v Vector 2 to add.
        **/
        public Add(v: b2Vec2): void;
        /**
        * Creates a copy of the vector 2.
        * @return Copy of this vector 2.
        **/
        public Copy(): b2Vec2;
        /**
        * Cross F V
        * @param s
        **/
        public CrossFV(s: number): void;
        /**
        * Cross V F
        * @param s
        **/
        public CrossVF(s: number): void;
        /**
        * Gets the negative of this vector 2.
        * @return Negative copy of this vector 2.
        **/
        public GetNegative(): b2Vec2;
        /**
        * True if the vector 2 is valid, otherwise false.  A valid vector has finite values.
        * @return True if the vector 2 is valid, otherwise false.
        **/
        public IsValid(): boolean;
        /**
        * Calculates the length of the vector 2.
        * @return The length of the vector 2.
        **/
        public Length(): number;
        /**
        * Calculates the length squared of the vector2.
        * @return The length squared of the vector 2.
        **/
        public LengthSquared(): number;
        /**
        * Creates a new vector 2 from the given values.
        * @param x x value.
        * @param y y value.
        **/
        static Make(x: number, y: number): b2Vec2;
        /**
        * Calculates which vector has the maximum values and sets this vector to those values.
        * @param b Vector 2 to compare for maximum values.
        **/
        public MaxV(b: b2Vec2): void;
        /**
        * Calculates which vector has the minimum values and sets this vector to those values.
        * @param b Vector 2 to compare for minimum values.
        **/
        public MinV(b: b2Vec2): void;
        /**
        * Matrix multiplication.  Stores the result in this vector 2.
        * @param A Matrix to muliply by.
        **/
        public MulM(A: b2Mat22): void;
        /**
        * Vector multiplication.  Stores the result in this vector 2.
        * @param a Value to multiple the vector's values by.
        **/
        public Multiply(a: number): void;
        /**
        * Dot product multiplication.  Stores the result in this vector 2.
        * @param A Matrix to multiply by.
        **/
        public MulTM(A: b2Mat22): void;
        /**
        * Sets this vector 2 to its negative.
        **/
        public NegativeSelf(): void;
        /**
        * Normalizes the vector 2 [0,1].
        * @return Length.
        **/
        public Normalize(): number;
        /**
        * Sets the vector 2.
        * @param x x value, default is 0.
        * @param y y value, default is 0.
        **/
        public Set(x?: number, y?: number): void;
        /**
        * Sets the vector 2 from a vector 2.
        * @param v Vector 2 to copy values from.
        **/
        public SetV(v: b2Vec2): void;
        /**
        * Sets the vector 2 to zero values.
        **/
        public SetZero(): void;
        /**
        * Subtracts the vector 2 from this vector 2.  The result is stored in this vector 2.
        * @param v Vector 2 to subtract.
        **/
        public Subtract(v: b2Vec2): void;
    }
}
declare module Box2D.Common.Math {
    /**
    * A 2D column vector with 3 elements.
    **/
    class b2Vec3 {
        /**
        * x value.
        **/
        public x: number;
        /**
        * y value.
        **/
        public y: number;
        /**
        * z value.
        **/
        public z: number;
        /**
        * Construct using coordinates x,y,z.
        * @param x x value, default = 0.
        * @param y y value, default = 0.
        * @param z z value, default = 0.
        **/
        constructor(x?: number, y?: number, z?: number);
        /**
        * Adds the vector 3 to this vector 3.  The result is stored in this vector 3.
        * @param v Vector 3 to add.
        **/
        public Add(v: b2Vec3): void;
        /**
        * Creates a copy of the vector 3.
        * @return Copy of this vector 3.
        **/
        public Copy(): b2Vec3;
        /**
        * Gets the negative of this vector 3.
        * @return Negative copy of this vector 3.
        **/
        public GetNegative(): b2Vec3;
        /**
        * Vector multiplication.  Stores the result in this vector 3.
        * @param a Value to multiple the vector's values by.
        **/
        public Multiply(a: number): void;
        /**
        * Sets this vector 3 to its negative.
        **/
        public NegativeSelf(): void;
        /**
        * Sets the vector 3.
        * @param x x value, default is 0.
        * @param y y value, default is 0.
        * @param z z value, default is 0.
        **/
        public Set(x?: number, y?: number, z?: number): void;
        /**
        * Sets the vector 3 from a vector 3.
        * @param v Vector 3 to copy values from.
        **/
        public SetV(v: b2Vec3): void;
        /**
        * Sets the vector 3 to zero values.
        **/
        public SetZero(): void;
        /**
        * Subtracts the vector 3 from this vector 3.  The result is stored in this vector 3.
        * @param v Vector 3 to subtract.
        **/
        public Subtract(v: b2Vec3): void;
    }
}
declare module Box2D.Collision {
    /**
    * Axis aligned bounding box.
    **/
    class b2AABB {
        /**
        * Lower bound.
        **/
        public lowerBound: Common.Math.b2Vec2;
        /**
        * Upper bound.
        **/
        public upperBound: Common.Math.b2Vec2;
        /**
        * Combines two AABBs into one with max values for upper bound and min values for lower bound.
        * @param aabb1 First AABB to combine.
        * @param aabb2 Second AABB to combine.
        * @return New AABB with max values from aabb1 and aabb2.
        **/
        static Combine(aabb1: b2AABB, aabb2: b2AABB): b2AABB;
        /**
        * Combines two AABBs into one with max values for upper bound and min values for lower bound.  The result is stored in this AABB.
        * @param aabb1 First AABB to combine.
        * @param aabb2 Second AABB to combine.
        **/
        public Combine(aabb1: b2AABB, aabb2: b2AABB): void;
        /**
        * Determines if an AABB is contained within this one.
        * @param aabb AABB to see if it is contained.
        * @return True if aabb is contained, otherwise false.
        **/
        public Contains(aabb: b2AABB): boolean;
        /**
        * Gets the center of the AABB.
        * @return Center of this AABB.
        **/
        public GetCenter(): Common.Math.b2Vec2;
        /**
        * Gets the extents of the AABB (half-widths).
        * @return Extents of this AABB.
        **/
        public GetExtents(): Common.Math.b2Vec2;
        /**
        * Verify that the bounds are sorted.
        * @return True if the bounds are sorted, otherwise false.
        **/
        public IsValid(): boolean;
        /**
        * Perform a precise raycast against this AABB.
        * @param output Ray cast output values.
        * @param input Ray cast input values.
        * @return True if the ray cast hits this AABB, otherwise false.
        **/
        public RayCast(output: b2RayCastOutput, input: b2RayCastInput): boolean;
        /**
        * Tests if another AABB overlaps this AABB.
        * @param other Other AABB to test for overlap.
        * @return True if other overlaps this AABB, otherwise false.
        **/
        public TestOverlap(other: b2AABB): boolean;
    }
}
declare module Box2D.Collision {
    /**
    * We use contact ids to facilitate warm starting.
    **/
    class b2ContactID {
        /**
        * Features
        **/
        public features: Features;
        /**
        * ID Key
        **/
        public Key: number;
        /**
        * Creates a new Contact ID.
        **/
        constructor();
        /**
        * Copies the Contact ID.
        * @return Copied Contact ID.
        **/
        public Copy(): b2ContactID;
        /**
        * Sets the Contact ID from a Contact ID.
        * @param id The Contact ID to copy values from.
        **/
        public Set(id: b2ContactID): void;
    }
}
declare module Box2D.Collision {
    /**
    * This structure is used to report contact points.
    **/
    class b2ContactPoint {
        /**
        * The combined friction coefficient.
        **/
        public friction: number;
        /**
        * The contact id identifies the features in contact.
        **/
        public id: b2ContactID;
        /**
        * Points from shape1 to shape2.
        **/
        public normal: Common.Math.b2Vec2;
        /**
        * Position in world coordinates.
        **/
        public position: Common.Math.b2Vec2;
        /**
        * The combined restitution coefficient.
        **/
        public restitution: number;
        /**
        * The separation is negative when shapes are touching.
        **/
        public separation: number;
        /**
        * The first shape.
        **/
        public shape1: Shapes.b2Shape;
        /**
        * The second shape.
        **/
        public shape2: Shapes.b2Shape;
        /**
        * Velocity of point on body2 relative to point on body1 (pre-solver).
        **/
        public velocity: Common.Math.b2Vec2;
    }
}
declare module Box2D.Collision {
    /**
    * Input for b2Distance. You have to option to use the shape radii in the computation. Even
    **/
    class b2DistanceInput {
        /**
        * Proxy A
        **/
        public proxyA: b2DistanceProxy;
        /**
        * Proxy B
        **/
        public proxyB: b2DistanceProxy;
        /**
        * Transform A
        **/
        public transformA: Common.Math.b2Transform;
        /**
        * Transform B
        **/
        public transformB: Common.Math.b2Transform;
        /**
        * Use shape radii in computation?
        **/
        public useRadii: boolean;
    }
}
declare module Box2D.Collision {
    /**
    * Output calculation for b2Distance.
    **/
    class b2DistanceOutput {
        /**
        *  Calculated distance.
        **/
        public distance: number;
        /**
        * Number of gjk iterations used in calculation.
        **/
        public iterations: number;
        /**
        * Closest point on shape A.
        **/
        public pointA: Common.Math.b2Vec2;
        /**
        * Closest point on shape B.
        **/
        public pointB: Common.Math.b2Vec2;
    }
}
declare module Box2D.Collision {
    /**
    * A distance proxy is used by the GJK algorithm. It encapsulates any shape.
    **/
    class b2DistanceProxy {
        /**
        * Count
        **/
        public m_count: number;
        /**
        * Radius
        **/
        public m_radius: number;
        /**
        * Verticies
        **/
        public m_vertices: Common.Math.b2Vec2[];
        /**
        * Get the supporting vertex index in the given direction.
        * @param d Direction to look for the supporting vertex.
        * @return Supporting vertex index.
        **/
        public GetSupport(d: Common.Math.b2Vec2): number;
        /**
        * Get the supporting vertex in the given direction.
        * @param d Direction to look for the supporting vertex.
        * @return Supporting vertex.
        **/
        public GetSupportVertex(d: Common.Math.b2Vec2): Common.Math.b2Vec2;
        /**
        * Get a vertex by index.  Used by b2Distance.
        * @param index Vetex's index.
        * @return Vertex at the given index.
        **/
        public GetVertex(index: number): Common.Math.b2Vec2;
        /**
        * Get the vertex count.
        * @return The number of vertices. (m_vertices.length)
        **/
        public GetVertexCount(): number;
        /**
        * Initialize the proxy using the given shape. The shape must remain in scope while the proxy is in use.
        * @param shape Shape to initialize the distance proxy.
        **/
        public Set(shape: Shapes.b2Shape): void;
    }
}
declare module Box2D.Collision {
    /**
    * A dynamic tree arranges data in a binary tree to accelerate queries such as volume queries and ray casts. Leafs are proxies with an AABB. In the tree we expand the proxy AABB by b2_fatAABBFactor so that the proxy AABB is bigger than the client object. This allows the client object to move by small amounts without triggering a tree update. Nodes are pooled.
    **/
    class b2DynamicTree {
        /**
        * Constructing the tree initializes the node pool.
        **/
        constructor();
        /**
        * Create a proxy. Provide a tight fitting AABB and a userData.
        * @param aabb AABB.
        * @param userDate User defined data for this proxy.
        * @return Dynamic tree node.
        **/
        public CreateProxy(aabb: b2AABB, userData: any): b2DynamicTreeNode;
        /**
        * Destroy a proxy. This asserts if the id is invalid.
        * @param proxy Proxy to destroy.
        **/
        public DestroyProxy(proxy: b2DynamicTreeNode): void;
        /**
        * Gets the Fat AABB for the proxy.
        * @param proxy Proxy to retrieve Fat AABB.
        * @return Fat AABB for proxy.
        **/
        public GetFatAABB(proxy: b2DynamicTreeNode): b2AABB;
        /**
        * Get user data from a proxy. Returns null if the proxy is invalid.
        * Cast to your type on return.
        * @param proxy Proxy to retrieve user data from.
        * @return User data for proxy or null if proxy is invalid.
        **/
        public GetUserData(proxy: b2DynamicTreeNode): any;
        /**
        * Move a proxy with a swept AABB. If the proxy has moved outside of its fattened AABB, then the proxy is removed from the tree and re-inserted. Otherwise the function returns immediately.
        * @param proxy Proxy to move.
        * @param aabb Swept AABB.
        * @param displacement Extra AABB displacement.
        **/
        public MoveProxy(proxy: b2DynamicTreeNode, aabb: b2AABB, displacement: Common.Math.b2Vec2): boolean;
        /**
        * Query an AABB for overlapping proxies. The callback is called for each proxy that overlaps the supplied AABB. The callback should match function signature fuction callback(proxy:b2DynamicTreeNode):Boolean and should return false to trigger premature termination.
        * @param callback Called for each proxy that overlaps the supplied AABB.
        *	param proxy Proxy overlapping the supplied AABB.
        * @aabb Proxies are query for overlap on this AABB.
        **/
        public Query(callback: (proxy: b2DynamicTreeNode) => boolean, aabb: b2AABB): void;
        /**
        * Ray-cast against the proxies in the tree. This relies on the callback to perform a exact ray-cast in the case were the proxy contains a shape. The callback also performs the any collision filtering. This has performance roughly equal to k log(n), where k is the number of collisions and n is the number of proxies in the tree.
        * @param callback Called for each proxy that is hit by the ray.
        *	param input Ray cast input data.
        *	param proxy The proxy hit by the ray cast.
        *	return Return value is the new value for maxFraction.
        * @param input Ray cast input data.  Query all proxies along this ray cast.
        **/
        public RayCast(callback: (input: b2RayCastInput, proxy: b2DynamicTreeNode) => number, input: b2RayCastInput): void;
        /**
        * Perform some iterations to re-balance the tree.
        * @param iterations Number of rebalance iterations to perform.
        **/
        public Rebalance(iterations: number): void;
    }
}
declare module Box2D.Collision {
    /**
    * The broad-phase is used for computing pairs and performing volume queries and ray casts. This broad-phase does not persist pairs. Instead, this reports potentially new pairs. It is up to the client to consume the new pairs and to track subsequent overlap.
    **/
    class b2DynamicTreeBroadPhase implements IBroadPhase {
        /**
        * Creates the dynamic tree broad phase.
        **/
        constructor();
        /**
        * @see IBroadPhase.CreateProxy
        **/
        public CreateProxy(aabb: b2AABB, userData: any): b2DynamicTreeNode;
        /**
        * @see IBroadPhase.DestroyProxy
        **/
        public DestroyProxy(proxy: b2DynamicTreeNode): void;
        /**
        * @see IBroadPhase.GetFatAABB
        **/
        public GetFatAABB(proxy: b2DynamicTreeNode): b2AABB;
        /**
        * @see IBroadPhase.GetProxyCount
        **/
        public GetProxyCount(): number;
        /**
        * @see IBroadPhase.GetUserData
        **/
        public GetUserData(proxy: b2DynamicTreeNode): any;
        /**
        * @see IBroadPhase.MoveProxy
        **/
        public MoveProxy(proxy: b2DynamicTreeNode, aabb: b2AABB, displacement: Common.Math.b2Vec2): void;
        /**
        * @see IBroadPhase.Query
        **/
        public Query(callback: (proxy: b2DynamicTreeNode) => boolean, aabb: b2AABB): void;
        /**
        * @see IBroadPhase.RayCast
        **/
        public RayCast(callback: (input: b2RayCastInput, proxy: b2DynamicTreeNode) => number, input: b2RayCastInput): void;
        /**
        * @see IBroadPhase.Rebalance
        **/
        public Rebalance(iterations: number): void;
        /**
        * Tests if two proxies overlap.
        * @param proxyA First proxy to test.
        * @param proxyB Second proxy to test.
        * @return True if the proxyA and proxyB overlap with Fat AABBs, otherwise false.
        **/
        public TestOverlap(proxyA: b2DynamicTreeNode, proxyB: b2DynamicTreeNode): boolean;
        /**
        * Update the pairs. This results in pair callbacks. This can only add pairs.
        * @param callback Called for all new proxy pairs.
        *	param userDataA Proxy A in the pair user data.
        *	param userDataB Proxy B in the pair user data.
        **/
        public UpdatePairs(callback: (userDataA: any, userDataB: any) => void): void;
        /**
        * Validates the dynamic tree.
        * NOTE: this says "todo" in the current Box2DFlash code.
        **/
        public Validate(): void;
    }
}
declare module Box2D.Collision {
    /**
    * Empty declaration, used in many callbacks within b2DynamicTree.
    * Use the b2DynamicTree functions to extract data from this shell.
    **/
    class b2DynamicTreeNode {
    }
}
declare module Box2D.Collision {
    /**
    * A manifold for two touching convex shapes. Box2D supports multiple types of contact: - clip point versus plane with radius - point versus point with radius (circles) The local point usage depends on the manifold type: -e_circles: the local center of circleA -e_faceA: the center of faceA -e_faceB: the center of faceB Similarly the local normal usage: -e_circles: not used -e_faceA: the normal on polygonA -e_faceB: the normal on polygonB We store contacts in this way so that position correction can account for movement, which is critical for continuous physics. All contact scenarios must be expressed in one of these types. This structure is stored across time steps, so we keep it small.
    **/
    class b2Manifold {
        /**
        * Circles
        **/
        static e_circles: number;
        /**
        * Face A
        **/
        static e_faceA: number;
        /**
        * Face B
        **/
        static e_faceB: number;
        /**
        * Not used for Type e_points
        **/
        public m_localPlaneNormal: Common.Math.b2Vec2;
        /**
        * Usage depends on manifold type
        **/
        public m_localPoint: Common.Math.b2Vec2;
        /**
        * The number of manifold points
        **/
        public m_pointCount: number;
        /**
        * The points of contact
        **/
        public m_points: b2ManifoldPoint[];
        /**
        * Manifold type.
        **/
        public m_type: number;
        /**
        * Creates a new manifold.
        **/
        constructor();
        /**
        * Copies the manifold.
        * @return Copy of this manifold.
        **/
        public Copy(): b2Manifold;
        /**
        * Resets this manifold.
        **/
        public Reset(): void;
        /**
        * Sets this manifold from another manifold.
        * @param m Manifold to copy values from.
        **/
        public Set(m: b2Manifold): void;
    }
}
declare module Box2D.Collision {
    /**
    * A manifold point is a contact point belonging to a contact manifold. It holds details related to the geometry and dynamics of the contact points. The local point usage depends on the manifold type: -e_circles: the local center of circleB -e_faceA: the local center of cirlceB or the clip point of polygonB -e_faceB: the clip point of polygonA This structure is stored across time steps, so we keep it small. Note: the impulses are used for internal caching and may not provide reliable contact forces, especially for high speed collisions.
    **/
    class b2ManifoldPoint {
        /**
        * Contact ID.
        **/
        public m_id: b2ContactID;
        /**
        * Local contact point.
        **/
        public m_localpoint: Common.Math.b2Vec2;
        /**
        * Normal impluse for this contact point.
        **/
        public m_normalImpulse: number;
        /**
        * Tangent impulse for contact point.
        **/
        public m_tangentImpulse: number;
        /**
        * Creates a new manifold point.
        **/
        constructor();
        /**
        * Resets this manifold point.
        **/
        public Reset(): void;
        /**
        * Sets this manifold point from a manifold point.
        * @param m The manifold point to copy values from.
        **/
        public Set(m: b2ManifoldPoint): void;
    }
}
declare module Box2D.Collision {
    /**
    * An oriented bounding box.
    **/
    class b2OBB {
        /**
        * The local centroid.
        **/
        public center: Common.Math.b2Vec2;
        /**
        * The half-widths.
        **/
        public extents: Common.Math.b2Vec2;
        /**
        * The rotation matrix.
        **/
        public R: Common.Math.b2Mat22;
    }
}
declare module Box2D.Collision {
    /**
    * Ray cast input data.
    **/
    class b2RayCastInput {
        /**
        * Truncate the ray to reach up to this fraction from p1 to p2
        **/
        public maxFraction: number;
        /**
        * The start point of the ray.
        **/
        public p1: Common.Math.b2Vec2;
        /**
        * The end point of the ray.
        **/
        public p2: Common.Math.b2Vec2;
        /**
        * Creates a new ray cast input.
        * @param p1 Start point of the ray, default = null.
        * @param p2 End point of the ray, default = null.
        * @param maxFraction Truncate the ray to reach up to this fraction from p1 to p2.
        **/
        constructor(p1?: Common.Math.b2Vec2, p2?: Common.Math.b2Vec2, maxFraction?: number);
    }
}
declare module Box2D.Collision {
    /**
    * Results of a ray cast.
    **/
    class b2RayCastOutput {
        /**
        * The fraction between p1 and p2 that the collision occurs at.
        **/
        public fraction: number;
        /**
        * The normal at the point of collision.
        **/
        public normal: Common.Math.b2Vec2;
    }
}
declare module Box2D.Collision {
    /**
    * A line in space between two given vertices.
    **/
    class b2Segment {
        /**
        * The starting point.
        **/
        public p1: Common.Math.b2Vec2;
        /**
        * The ending point.
        **/
        public p2: Common.Math.b2Vec2;
        /**
        * Extends or clips the segment so that it's ends lie on the boundary of the AABB.
        * @param aabb AABB to extend/clip the segement.
        **/
        public Extend(aabb: b2AABB): void;
        /**
        * See Extend, this works on the ending point.
        * @param aabb AABB to extend/clip the ending point.
        **/
        public ExtendBackward(aabb: b2AABB): void;
        /**
        * See Extend, this works on the starting point.
        * @param aabb AABB to extend/clip the starting point.
        **/
        public ExtendForward(aabb: b2AABB): void;
        /**
        * Ray cast against this segment with another segment.
        * @param lambda returns the hit fraction. You can use this to compute the contact point * p = (1 - lambda) * segment.p1 + lambda * segment.p2 * @normal Normal at the contact point.  If there is no intersection, the normal is not set.
        * @param segment Defines the begining and end point of the ray cast.
        * @param maxLambda a number typically in the range [0,1].
        * @return True if there is an intersection, otherwise false.
        **/
        public TestSegment(lambda: number[], normal: Common.Math.b2Vec2, segment: b2Segment, maxLambda: number): boolean;
    }
}
declare module Box2D.Collision {
    /**
    * Used to warm start b2Distance. Set count to zero on first call.
    **/
    class b2SimplexCache {
        /**
        * Number in cache.
        **/
        public count: number;
        /**
        * Vertices on shape a.
        **/
        public indexA: number[];
        /**
        * Vertices on shape b.
        **/
        public indexB: number[];
        /**
        * Length or area.
        **/
        public metric: number;
    }
}
declare module Box2D.Collision {
    /**
    * Inpute parameters for b2TimeOfImpact
    **/
    class b2TOIInput {
        /**
        * Proxy A
        **/
        public proxyA: b2DistanceProxy;
        /**
        * Proxy B
        **/
        public proxyB: b2DistanceProxy;
        /**
        * Sweep A
        **/
        public sweepA: Common.Math.b2Sweep;
        /**
        * Sweep B
        **/
        public sweepB: Common.Math.b2Sweep;
        /**
        * Tolerance
        **/
        public tolerance: number;
    }
}
declare module Box2D.Collision {
    /**
    * This is used to compute the current state of a contact manifold.
    **/
    class b2WorldManifold {
        /**
        * World vector pointing from A to B.
        **/
        public m_normal: Common.Math.b2Vec2;
        /**
        * World contact point (point of intersection).
        **/
        public m_points: Common.Math.b2Vec2[];
        /**
        * Creates a new b2WorldManifold.
        **/
        constructor();
        /**
        * Evaluate the manifold with supplied transforms. This assumes modest motion from the original state. This does not change the point count, impulses, etc. The radii must come from the shapes that generated the manifold.
        * @param manifold Manifold to evaluate.
        * @param xfA A transform.
        * @param radiusA A radius.
        * @param xfB B transform.
        * @param radiusB B radius.
        **/
        public Initialize(manifold: b2Manifold, xfA: Common.Math.b2Transform, radiusA: number, xfB: Common.Math.b2Transform, radiusB: number): void;
    }
}
declare module Box2D.Collision {
    /**
    * We use contact ids to facilitate warm starting.
    **/
    class Features {
        /**
        * A value of 1 indicates that the reference edge is on shape2.
        **/
        public flip: number;
        /**
        * The edge most anti-parallel to the reference edge.
        **/
        public incidentEdge: number;
        /**
        * The vertex (0 or 1) on the incident edge that was clipped.
        **/
        public incidentVertex: number;
        /**
        * The edge that defines the outward contact normal.
        **/
        public referenceEdge: number;
    }
}
declare module Box2D.Collision {
    /**
    * Interface for objects tracking overlap of many AABBs.
    **/
    interface IBroadPhase {
        /**
        * Create a proxy with an initial AABB. Pairs are not reported until UpdatePairs is called.
        * @param aabb Proxy Fat AABB.
        * @param userData User defined data.
        * @return Proxy created from aabb and userData.
        **/
        CreateProxy(aabb: b2AABB, userData: any): b2DynamicTreeNode;
        /**
        * Destroy a proxy. It is up to the client to remove any pairs.
        * @param proxy Proxy to destroy.
        **/
        DestroyProxy(proxy: b2DynamicTreeNode): void;
        /**
        * Get the Fat AABB for a proxy.
        * @param proxy Proxy to retrieve the Fat AABB.
        **/
        GetFatAABB(proxy: b2DynamicTreeNode): b2AABB;
        /**
        * Get the number of proxies.
        * @return Number of proxies.
        **/
        GetProxyCount(): number;
        /**
        * Get user data from a proxy. Returns null if the proxy is invalid.
        * @param proxy Proxy to retrieve user data from.
        * @return Gets the user data from proxy, or null if the proxy is invalid.
        **/
        GetUserData(proxy: b2DynamicTreeNode): any;
        /**
        * Call MoveProxy as many times as you like, then when you are done call UpdatePairs to finalized the proxy pairs (for your time step).
        * @param proxy Proxy to move.
        * @param aabb Swept AABB.
        * @param displacement Extra AABB displacement.
        **/
        MoveProxy(proxy: b2DynamicTreeNode, aabb: b2AABB, displacement: Common.Math.b2Vec2): void;
        /**
        * Query an AABB for overlapping proxies. The callback is called for each proxy that overlaps the supplied AABB. The callback should match function signature fuction callback(proxy:b2DynamicTreeNode):Boolean and should return false to trigger premature termination.
        * @param callback Called for each proxy that overlaps the supplied AABB.
        *	param proxy Proxy overlapping the supplied AABB.
        * @param aabb Proxies are query for overlap on this AABB.
        **/
        Query(callback: (proxy: b2DynamicTreeNode) => boolean, aabb: b2AABB): void;
        /**
        * Ray-cast against the proxies in the tree. This relies on the callback to perform a exact ray-cast in the case were the proxy contains a shape. The callback also performs the any collision filtering. This has performance roughly equal to k log(n), where k is the number of collisions and n is the number of proxies in the tree.
        * @param callback Called for each proxy that is hit by the ray.
        *	param input Ray cast input data.
        *	param proxy The proxy hit by the ray cast.
        *	param return Return value is the new value for maxFraction.
        * @param input Ray cast input data.  Query all proxies along this ray cast.
        **/
        RayCast(callback: (input: b2RayCastInput, proxy: b2DynamicTreeNode) => number, input: b2RayCastInput): void;
        /**
        * Perform some iterations to re-balance the tree.
        * @param iterations Number of rebalance iterations to perform.
        **/
        Rebalance(iterations: number): void;
    }
}
declare module Box2D.Collision.Shapes {
    /**
    * A circle shape.
    **/
    class b2CircleShape extends b2Shape {
        /**
        * Creates a new circle shape.
        * @param radius Circle radius.
        **/
        constructor(radius?: number);
        /**
        * Given a transform, compute the associated axis aligned bounding box for this shape.
        * @param aabb Calculated AABB, this argument is `out`.
        * @param xf Transform to calculate the AABB.
        **/
        public ComputeAABB(aabb: b2AABB, xf: Common.Math.b2Transform): void;
        /**
        * Compute the mass properties of this shape using its dimensions and density. The inertia tensor is computed about the local origin, not the centroid.
        * @param massData Calculate the mass, this argument is `out`.
        * @param density
        **/
        public ComputeMass(massData: b2MassData, density: number): void;
        /**
        * Compute the volume and centroid of this shape intersected with a half plane
        * @param normal The surface normal.
        * @param offset The surface offset along the normal.
        * @param xf The shape transform.
        * @param c The centroid, this argument is `out`.
        **/
        public ComputeSubmergedArea(normal: Common.Math.b2Vec2, offset: number, xf: Common.Math.b2Transform, c: Common.Math.b2Vec2): number;
        /**
        * Copies the circle shape.
        * @return Copy of this circle shape.
        **/
        public Copy(): b2CircleShape;
        /**
        * Get the local position of this circle in its parent body.
        * @return This circle's local position.
        **/
        public GetLocalPosition(): Common.Math.b2Vec2;
        /**
        * Get the radius of the circle.
        * @return This circle's radius.
        **/
        public GetRadius(): number;
        /**
        * Cast a ray against this shape.
        * @param output Ray cast results, this argument is `out`.
        * @param input Ray cast input parameters.
        * @param transform The transform to be applied to the shape.
        * @return True if the ray hits the shape, otherwise false.
        **/
        public RayCast(output: b2RayCastOutput, input: b2RayCastInput, transform: Common.Math.b2Transform): boolean;
        /**
        * Set the circle shape values from another shape.
        * @param other The other circle shape to copy values from.
        **/
        public Set(other: b2CircleShape): void;
        /**
        * Set the local position of this circle in its parent body.
        * @param position The new local position of this circle.
        **/
        public SetLocalPosition(position: Common.Math.b2Vec2): void;
        /**
        * Set the radius of the circle.
        * @param radius The new radius of the circle.
        **/
        public SetRadius(radius: number): void;
        /**
        * Test a point for containment in this shape. This only works for convex shapes.
        * @param xf Shape world transform.
        * @param p Point to test against, in world coordinates.
        * @return True if the point is in this shape, otherwise false.
        **/
        public TestPoint(xf: Common.Math.b2Transform, p: Common.Math.b2Vec2): boolean;
    }
}
declare module Box2D.Collision.Shapes {
    /**
    * This structure is used to build edge shapes.
    **/
    class b2EdgeChainDef {
        /**
        * Whether to create an extra edge between the first and last vertices.
        **/
        public isALoop: boolean;
        /**
        * The number of vertices in the chain.
        **/
        public vertexCount: number;
        /**
        * The vertices in local coordinates.
        **/
        public vertices: Common.Math.b2Vec2;
        /**
        * Creates a new edge chain def.
        **/
        constructor();
    }
}
declare module Box2D.Collision.Shapes {
    /**
    * An edge shape.
    **/
    class b2EdgeShape extends b2Shape {
        /**
        * Creates a new edge shape.
        * @param v1 First vertex
        * @param v2 Second vertex
        **/
        constructor(v1: Common.Math.b2Vec2, v2: Common.Math.b2Vec2);
        /**
        * Given a transform, compute the associated axis aligned bounding box for this shape.
        * @param aabb Calculated AABB, this argument is `out`.
        * @param xf Transform to calculate the AABB.
        **/
        public ComputeAABB(aabb: b2AABB, xf: Common.Math.b2Transform): void;
        /**
        * Compute the mass properties of this shape using its dimensions and density. The inertia tensor is computed about the local origin, not the centroid.
        * @param massData Calculate the mass, this argument is `out`.
        **/
        public ComputeMass(massData: b2MassData, density: number): void;
        /**
        * Compute the volume and centroid of this shape intersected with a half plane
        * @param normal The surface normal.
        * @param offset The surface offset along the normal.
        * @param xf The shape transform.
        * @param c The centroid, this argument is `out`.
        **/
        public ComputeSubmergedArea(normal: Common.Math.b2Vec2, offset: number, xf: Common.Math.b2Transform, c: Common.Math.b2Vec2): number;
        /**
        * Get the distance from vertex1 to vertex2.
        * @return Distance from vertex1 to vertex2.
        **/
        public GetLength(): number;
        /**
        * Get the local position of vertex1 in the parent body.
        * @return Local position of vertex1 in the parent body.
        **/
        public GetVertex1(): Common.Math.b2Vec2;
        /**
        * Get the local position of vertex2 in the parent body.
        * @return Local position of vertex2 in the parent body.
        **/
        public GetVertex2(): Common.Math.b2Vec2;
        /**
        * Get a core vertex 1 in local coordinates.  These vertices represent a smaller edge that is used for time of impact.
        * @return core vertex 1 in local coordinates.
        **/
        public GetCoreVertex1(): Common.Math.b2Vec2;
        /**
        * Get a core vertex 2 in local coordinates.  These vertices represent a smaller edge that is used for time of impact.
        * @return core vertex 2 in local coordinates.
        **/
        public GetCoreVertex2(): Common.Math.b2Vec2;
        /**
        * Get a perpendicular unit vector, pointing from the solid side to the empty side.
        * @return Normal vector.
        **/
        public GetNormalVector(): Common.Math.b2Vec2;
        /**
        * Get a parallel unit vector, pointing from vertex 1 to vertex 2.
        * @return Vertex 1 to vertex 2 directional vector.
        **/
        public GetDirectionVector(): Common.Math.b2Vec2;
        /**
        * Returns a unit vector halfway between direction and previous direction.
        * @return Halfway unit vector between direction and previous direction.
        **/
        public GetCorner1Vector(): Common.Math.b2Vec2;
        /**
        * Returns a unit vector halfway between direction and previous direction.
        * @return Halfway unit vector between direction and previous direction.
        **/
        public GetCorner2Vector(): Common.Math.b2Vec2;
        /**
        * Determines if the first corner of this edge bends towards the solid side.
        * @return True if convex, otherwise false.
        **/
        public Corner1IsConvex(): boolean;
        /**
        * Determines if the second corner of this edge bends towards the solid side.
        * @return True if convex, otherwise false.
        **/
        public Corner2IsConvex(): boolean;
        /**
        * Get the first vertex and apply the supplied transform.
        * @param xf Transform to apply.
        * @return First vertex with xf transform applied.
        **/
        public GetFirstVertex(xf: Common.Math.b2Transform): Common.Math.b2Vec2;
        /**
        * Get the next edge in the chain.
        * @return Next edge shape or null if there is no next edge shape.
        **/
        public GetNextEdge(): b2EdgeShape;
        /**
        * Get the previous edge in the chain.
        * @return Previous edge shape or null if there is no previous edge shape.
        **/
        public GetPrevEdge(): b2EdgeShape;
        /**
        * Get the support point in the given world direction with the supplied transform.
        * @param xf Transform to apply.
        * @param dX X world direction.
        * @param dY Y world direction.
        * @return Support point.
        **/
        public Support(xf: Common.Math.b2Transform, dX: number, dY: number): Common.Math.b2Vec2;
        /**
        * Cast a ray against this shape.
        * @param output Ray cast results, this argument is `out`.
        * @param input Ray cast input parameters.
        * @param transform The transform to be applied to the shape.
        * @return True if the ray hits the shape, otherwise false.
        **/
        public RayCast(output: b2RayCastOutput, input: b2RayCastInput, transform: Common.Math.b2Transform): boolean;
        /**
        * Test a point for containment in this shape. This only works for convex shapes.
        * @param xf Shape world transform.
        * @param p Point to test against, in world coordinates.
        * @return True if the point is in this shape, otherwise false.
        **/
        public TestPoint(xf: Common.Math.b2Transform, p: Common.Math.b2Vec2): boolean;
    }
}
declare module Box2D.Collision.Shapes {
    /**
    * This holds the mass data computed for a shape.
    **/
    class b2MassData {
        /**
        * The position of the shape's centroid relative to the shape's origin.
        **/
        public center: Common.Math.b2Vec2;
        /**
        * The rotational inertia of the shape. This may be about the center or local origin, depending on usage.
        **/
        public I: number;
        /**
        * The mass of the shape, usually in kilograms.
        **/
        public mass: number;
    }
}
declare module Box2D.Collision.Shapes {
    /**
    * Convex polygon. The vertices must be in CCW order for a right-handed coordinate system with the z-axis coming out of the screen.
    **/
    class b2PolygonShape extends b2Shape {
        /**
        * Creates a b2PolygonShape from a vertices list. This assumes the vertices define a convex polygon.  It is assumed that the exterior is the the right of each edge.
        * @param vertices List of vertices to create the polygon shape from.
        * @param vertexCount Number of vertices in the shape, default value is 0 and in the box2dweb.js code it is ignored.
        * @return Convex polygon shape.
        **/
        static AsArray(vertices: Common.Math.b2Vec2[], vertexCount?: number): b2PolygonShape;
        /**
        * Build vertices to represent an axis-aligned box.
        * @param hx The half-width.
        * @param hy The half-height.
        * @return Box polygon shape.
        **/
        static AsBox(hx: number, hy: number): b2PolygonShape;
        /**
        * Creates a single edge from two vertices.
        * @param v1 First vertex.
        * @param v2 Second vertex.
        * @return Edge polygon shape.
        **/
        static AsEdge(v1: Common.Math.b2Vec2, b2: Common.Math.b2Vec2): b2PolygonShape;
        /**
        * Build vertices to represent an oriented box.
        * @param hx The half-width.
        * @param hy The half-height.
        * @param center The center of the box in local coordinates, default is null (no center?)
        * @param angle The rotation of the box in local coordinates, default is 0.0.
        * @return Oriented box shape.
        **/
        static AsOrientedBox(hx: number, hy: number, center?: Common.Math.b2Vec2, angle?: number): b2PolygonShape;
        /**
        * This assumes the vertices define a convex polygon.  It is assumed that the exterior is the the right of each edge.
        * @param vertices List of vertices to create the polygon shape from.
        * @param vertexCount The number of vertices, default is 0 and in the box2dweb.js code it is ignored.
        * @return Convex polygon shape.
        **/
        static AsVector(vertices: Common.Math.b2Vec2[], vertexCount?: number): b2PolygonShape;
        /**
        * Given a transform, compute the associated axis aligned bounding box for this shape.
        * @param aabb Calculated AABB, this argument is `out`.
        * @param xf Transform to calculate the AABB.
        **/
        public ComputeAABB(aabb: b2AABB, xf: Common.Math.b2Transform): void;
        /**
        * Compute the mass properties of this shape using its dimensions and density. The inertia tensor is computed about the local origin, not the centroid.
        * @param massData Calculate the mass, this argument is `out`.
        **/
        public ComputeMass(massData: b2MassData, density: number): void;
        /**
        * Compute the volume and centroid of this shape intersected with a half plane
        * @param normal The surface normal.
        * @param offset The surface offset along the normal.
        * @param xf The shape transform.
        * @param c The centroid, this argument is `out`.
        **/
        public ComputeSubmergedArea(normal: Common.Math.b2Vec2, offset: number, xf: Common.Math.b2Transform, c: Common.Math.b2Vec2): number;
        /**
        * Clone the shape.
        **/
        public Copy(): b2PolygonShape;
        /**
        * Get the edge normal vectors. There is one for each vertex.
        * @return List of edge normal vectors for each vertex.
        **/
        public GetNormals(): Common.Math.b2Vec2[];
        /**
        * Get the supporting vertex index in the given direction.
        * @param d Direction to look.
        * @return Vertex index supporting the direction.
        **/
        public GetSupport(d: Common.Math.b2Vec2): number;
        /**
        * Get the supporting vertex in the given direction.
        * @param d Direciton to look.
        * @return Vertex supporting the direction.
        **/
        public GetSupportVertex(d: Common.Math.b2Vec2): Common.Math.b2Vec2;
        /**
        * Get the vertex count.
        * @return Vertex count.
        **/
        public GetVertexCount(): number;
        /**
        * Get the vertices in local coordinates.
        * @return List of the vertices in local coordinates.
        **/
        public GetVertices(): Common.Math.b2Vec2[];
        /**
        * Cast a ray against this shape.
        * @param output Ray cast results, this argument is `out`.
        * @param input Ray cast input parameters.
        * @param transform The transform to be applied to the shape.
        * @return True if the ray hits the shape, otherwise false.
        **/
        public RayCast(output: b2RayCastOutput, input: b2RayCastInput, transform: Common.Math.b2Transform): boolean;
        /**
        * Set the shape values from another shape.
        * @param other The other shape to copy values from.
        **/
        public Set(other: b2Shape): void;
        /**
        * Copy vertices. This assumes the vertices define a convex polygon.  It is assumed that the exterior is the the right of each edge.
        * @param vertices List of vertices to create the polygon shape from.
        * @param vertexCount Number of vertices in the shape, default value is 0 and in the box2dweb.js code it is ignored.
        * @return Convex polygon shape.
        **/
        public SetAsArray(vertices: Common.Math.b2Vec2[], vertexCount?: number): void;
        /**
        * Build vertices to represent an axis-aligned box.
        * @param hx The half-width.
        * @param hy The half-height.
        * @return Box polygon shape.
        **/
        public SetAsBox(hx: number, hy: number): void;
        /**
        * Creates a single edge from two vertices.
        * @param v1 First vertex.
        * @param v2 Second vertex.
        * @return Edge polygon shape.
        **/
        public SetAsEdge(v1: Common.Math.b2Vec2, b2: Common.Math.b2Vec2): void;
        /**
        * Build vertices to represent an oriented box.
        * @param hx The half-width.
        * @param hy The half-height.
        * @param center The center of the box in local coordinates, default is null (no center?)
        * @param angle The rotation of the box in local coordinates, default is 0.0.
        * @return Oriented box shape.
        **/
        public SetAsOrientedBox(hx: number, hy: number, center?: Common.Math.b2Vec2, angle?: number): void;
        /**
        * This assumes the vertices define a convex polygon.  It is assumed that the exterior is the the right of each edge.
        * @param vertices List of vertices to create the polygon shape from.
        * @param vertexCount The number of vertices, default is 0 and in the box2dweb.js code it is ignored.
        * @return Convex polygon shape.
        **/
        public SetAsVector(vertices: any[], vertexCount?: number): void;
        /**
        * Test a point for containment in this shape. This only works for convex shapes.
        * @param xf Shape world transform.
        * @param p Point to test against, in world coordinates.
        * @return True if the point is in this shape, otherwise false.
        **/
        public TestPoint(xf: Common.Math.b2Transform, p: Common.Math.b2Vec2): boolean;
    }
}
declare module Box2D.Collision.Shapes {
    /**
    * A shape is used for collision detection. Shapes are created in b2Body. You can use shape for collision detection before they are attached to the world.
    * Warning: you cannot reuse shapes.
    **/
    class b2Shape {
        /**
        * Return value for TestSegment indicating a hit.
        **/
        static e_hitCollide: number;
        /**
        * Return value for TestSegment indicating a miss.
        **/
        static e_missCollide: number;
        /**
        * Return value for TestSegment indicating that the segment starting point, p1, is already inside the shape.
        **/
        static startsInsideCollide: number;
        static e_unknownShape: number;
        static e_circleShape: number;
        static e_polygonShape: number;
        static e_edgeShape: number;
        static e_shapeTypeCount: number;
        /**
        * Creates a new b2Shape.
        **/
        constructor();
        /**
        * Given a transform, compute the associated axis aligned bounding box for this shape.
        * @param aabb Calculated AABB, this argument is `out`.
        * @param xf Transform to calculate the AABB.
        **/
        public ComputeAABB(aabb: b2AABB, xf: Common.Math.b2Transform): void;
        /**
        * Compute the mass properties of this shape using its dimensions and density. The inertia tensor is computed about the local origin, not the centroid.
        * @param massData Calculate the mass, this argument is `out`.
        * @param density Density.
        **/
        public ComputeMass(massData: b2MassData, density: number): void;
        /**
        * Compute the volume and centroid of this shape intersected with a half plane
        * @param normal The surface normal.
        * @param offset The surface offset along the normal.
        * @param xf The shape transform.
        * @param c The centroid, this argument is `out`.
        **/
        public ComputeSubmergedArea(normal: Common.Math.b2Vec2, offset: number, xf: Common.Math.b2Transform, c: Common.Math.b2Vec2): number;
        /**
        * Clone the shape.
        **/
        public Copy(): b2Shape;
        /**
        * Get the type of this shape. You can use this to down cast to the concrete shape.
        **/
        public GetType(): number;
        /**
        * Cast a ray against this shape.
        * @param output Ray cast results, this argument is `out`.
        * @param input Ray cast input parameters.
        * @param transform The transform to be applied to the shape.
        * @param return True if the ray hits the shape, otherwise false.
        **/
        public RayCast(output: b2RayCastOutput, input: b2RayCastInput, transform: Common.Math.b2Transform): boolean;
        /**
        * Set the shape values from another shape.
        * @param other The other shape to copy values from.
        **/
        public Set(other: b2Shape): void;
        /**
        * Test if two shapes overlap with the applied transforms.
        * @param shape1 shape to test for overlap with shape2.
        * @param transform1 shape1 transform to apply.
        * @param shape2 shape to test for overlap with shape1.
        * @param transform2 shape2 transform to apply.
        * @return True if shape1 and shape2 overlap, otherwise false.
        **/
        static TestOverlap(shape1: b2Shape, transform1: Common.Math.b2Transform, shape2: b2Shape, transform2: Common.Math.b2Transform): boolean;
        /**
        * Test a point for containment in this shape. This only works for convex shapes.
        * @param xf Shape world transform.
        * @param p Point to test against, in world coordinates.
        * @return True if the point is in this shape, otherwise false.
        **/
        public TestPoint(xf: Common.Math.b2Transform, p: Common.Math.b2Vec2): boolean;
    }
}
declare module Box2D.Dynamics {
    /**
    * A rigid body.
    **/
    class b2Body {
        /**
        * Dynamic Body
        **/
        static b2_dynamicBody: number;
        /**
        * Kinematic Body
        **/
        static b2_kinematicBody: number;
        /**
        * Static Body
        **/
        static b2_staticBody: number;
        /**
        * Apply a force at a world point. If the force is not applied at the center of mass, it will generate a torque and affect the angular velocity. This wakes up the body.
        * @param force The world force vector, usually in Newtons (N).
        * @param point The world position of the point of application.
        **/
        public ApplyForce(force: Common.Math.b2Vec2, point: Common.Math.b2Vec2): void;
        /**
        * Apply an impulse at a point. This immediately modifies the velocity. It also modifies the angular velocity if the point of application is not at the center of mass. This wakes up the body.
        * @param impules The world impulse vector, usually in N-seconds or kg-m/s.
        * @param point The world position of the point of application.
        **/
        public ApplyImpulse(impulse: Common.Math.b2Vec2, point: Common.Math.b2Vec2): void;
        /**
        * Apply a torque. This affects the angular velocity without affecting the linear velocity of the center of mass. This wakes up the body.
        * @param torque Force applied about the z-axis (out of the screen), usually in N-m.
        **/
        public ApplyTorque(torque: number): void;
        /**
        * Creates a fixture and attach it to this body. Use this function if you need to set some fixture parameters, like friction. Otherwise you can create the fixture directly from a shape. If the density is non-zero, this function automatically updates the mass of the body. Contacts are not created until the next time step.
        * @warning This function is locked during callbacks.
        * @param def The fixture definition;
        * @return The created fixture.
        **/
        public CreateFixture(def: b2FixtureDef): b2Fixture;
        /**
        * Creates a fixture from a shape and attach it to this body. This is a convenience function. Use b2FixtureDef if you need to set parameters like friction, restitution, user data, or filtering. This function automatically updates the mass of the body.
        * @warning This function is locked during callbacks.
        * @param shape The shaped of the fixture (to be cloned).
        * @param density The shape density, default is 0.0, set to zero for static bodies.
        * @return The created fixture.
        **/
        public CreateFixture2(shape: Collision.Shapes.b2Shape, density?: number): b2Fixture;
        /**
        * Destroy a fixture. This removes the fixture from the broad-phase and destroys all contacts associated with this fixture. This will automatically adjust the mass of the body if the body is dynamic and the fixture has positive density. All fixtures attached to a body are implicitly destroyed when the body is destroyed.
        * @warning This function is locked during callbacks.
        * @param fixture The fixed to be removed.
        **/
        public DestroyFixture(fixture: b2Fixture): void;
        /**
        * Get the angle in radians.
        * @return The current world rotation angle in radians
        **/
        public GetAngle(): number;
        /**
        * Get the angular damping of the body.
        * @return Angular damping of the body.
        **/
        public GetAngularDamping(): number;
        /**
        * Get the angular velocity.
        * @return The angular velocity in radians/second.
        **/
        public GetAngularVelocity(): number;
        /**
        * Get the list of all contacts attached to this body.
        * @return List of all contacts attached to this body.
        **/
        public GetContactList(): Contacts.b2ContactEdge;
        /**
        * Get the list of all controllers attached to this body.
        * @return List of all controllers attached to this body.
        **/
        public GetControllerList(): Controllers.b2ControllerEdge;
        /**
        * Get the definition containing the body properties.
        * @note This provides a feature specific to this port.
        * @return The body's definition.
        **/
        public GetDefinition(): b2BodyDef;
        /**
        * Get the list of all fixtures attached to this body.
        * @return List of all fixtures attached to this body.
        **/
        public GetFixtureList(): b2Fixture;
        /**
        * Get the central rotational inertia of the body.
        * @return The rotational inertia, usually in kg-m^2.
        **/
        public GetInertia(): number;
        /**
        * Get the list of all joints attached to this body.
        * @return List of all joints attached to this body.
        **/
        public GetJointList(): Joints.b2JointEdge;
        /**
        * Get the linear damping of the body.
        * @return The linear damping of the body.
        **/
        public GetLinearDamping(): number;
        /**
        * Get the linear velocity of the center of mass.
        * @return The linear velocity of the center of mass.
        **/
        public GetLinearVelocity(): Common.Math.b2Vec2;
        /**
        * Get the world velocity of a local point.
        * @param localPoint Point in local coordinates.
        * @return The world velocity of the point.
        **/
        public GetLinearVelocityFromLocalPoint(localPoint: Common.Math.b2Vec2): Common.Math.b2Vec2;
        /**
        * Get the world linear velocity of a world point attached to this body.
        * @param worldPoint Point in world coordinates.
        * @return The world velocity of the point.
        **/
        public GetLinearVelocityFromWorldPoint(worldPoint: Common.Math.b2Vec2): Common.Math.b2Vec2;
        /**
        * Get the local position of the center of mass.
        * @return Local position of the center of mass.
        **/
        public GetLocalCenter(): Common.Math.b2Vec2;
        /**
        * Gets a local point relative to the body's origin given a world point.
        * @param worldPoint Pointin world coordinates.
        * @return The corresponding local point relative to the body's origin.
        **/
        public GetLocalPoint(worldPoint: Common.Math.b2Vec2): Common.Math.b2Vec2;
        /**
        * Gets a local vector given a world vector.
        * @param worldVector World vector.
        * @return The corresponding local vector.
        **/
        public GetLocalVector(worldVector: Common.Math.b2Vec2): Common.Math.b2Vec2;
        /**
        * Get the total mass of the body.
        * @return The body's mass, usually in kilograms (kg).
        **/
        public GetMass(): number;
        /**
        * Get the mass data of the body. The rotational inertial is relative to the center of mass.
        * @param data Body's mass data, this argument is `out`.
        **/
        public GetMassData(data: Collision.Shapes.b2MassData): void;
        /**
        * Get the next body in the world's body list.
        * @return Next body in the world's body list.
        **/
        public GetNext(): b2Body;
        /**
        * Get the world body origin position.
        * @return World position of the body's origin.
        **/
        public GetPosition(): Common.Math.b2Vec2;
        /**
        * Get the body transform for the body's origin.
        * @return World transform of the body's origin.
        **/
        public GetTransform(): Common.Math.b2Transform;
        /**
        * Get the type of this body.
        * @return Body type as uint.
        **/
        public GetType(): number;
        /**
        * Get the user data pointer that was provided in the body definition.
        * @return User's data, cast to the correct type.
        **/
        public GetUserData(): any;
        /**
        * Get the parent world of this body.
        * @return Body's world.
        **/
        public GetWorld(): b2World;
        /**
        * Get the world position of the center of mass.
        * @return World position of the center of mass.
        **/
        public GetWorldCenter(): Common.Math.b2Vec2;
        /**
        * Get the world coordinates of a point given the local coordinates.
        * @param localPoint Point on the body measured relative to the body's origin.
        * @return localPoint expressed in world coordinates.
        **/
        public GetWorldPoint(localPoint: Common.Math.b2Vec2): Common.Math.b2Vec2;
        /**
        * Get the world coordinates of a vector given the local coordinates.
        * @param localVector Vector fixed in the body.
        * @return localVector expressed in world coordinates.
        **/
        public GetWorldVector(localVector: Common.Math.b2Vec2): Common.Math.b2Vec2;
        /**
        * Get the active state of the body.
        * @return True if the body is active, otherwise false.
        **/
        public IsActive(): boolean;
        /**
        * Get the sleeping state of this body.
        * @return True if the body is awake, otherwise false.
        **/
        public IsAwake(): boolean;
        /**
        * Is the body treated like a bullet for continuous collision detection?
        * @return True if the body is treated like a bullet, otherwise false.
        **/
        public IsBullet(): boolean;
        /**
        * Does this body have fixed rotation?
        * @return True for fixed, otherwise false.
        **/
        public IsFixedRotation(): boolean;
        /**
        * Is this body allowed to sleep?
        * @return True if the body can sleep, otherwise false.
        **/
        public IsSleepingAllowed(): boolean;
        /**
        * Merges another body into this. Only fixtures, mass and velocity are effected, Other properties are ignored.
        * @note This provides a feature specific to this port.
        **/
        public Merge(other: b2Body): void;
        /**
        * This resets the mass properties to the sum of the mass properties of the fixtures. This normally does not need to be called unless you called SetMassData to override the mass and later you want to reset the mass.
        **/
        public ResetMassData(): void;
        /**
        * Set the active state of the body. An inactive body is not simulated and cannot be collided with or woken up. If you pass a flag of true, all fixtures will be added to the broad-phase. If you pass a flag of false, all fixtures will be removed from the broad-phase and all contacts will be destroyed. Fixtures and joints are otherwise unaffected. You may continue to create/destroy fixtures and joints on inactive bodies. Fixtures on an inactive body are implicitly inactive and will not participate in collisions, ray-casts, or queries. Joints connected to an inactive body are implicitly inactive. An inactive body is still owned by a b2World object and remains in the body list.
        * @param flag True to activate, false to deactivate.
        **/
        public SetActive(flag: boolean): void;
        /**
        * Set the world body angle
        * @param angle New angle of the body.
        **/
        public SetAngle(angle: number): void;
        /**
        * Set the angular damping of the body.
        * @param angularDamping New angular damping value.
        **/
        public SetAngularDamping(angularDamping: number): void;
        /**
        * Set the angular velocity.
        * @param omega New angular velocity in radians/second.
        **/
        public SetAngularVelocity(omega: number): void;
        /**
        * Set the sleep state of the body. A sleeping body has vety low CPU cost.
        * @param flag True to set the body to awake, false to put it to sleep.
        **/
        public SetAwake(flag: boolean): void;
        /**
        * Should this body be treated like a bullet for continuous collision detection?
        * @param flag True for bullet, false for normal.
        **/
        public SetBullet(flag: boolean): void;
        /**
        * Set this body to have fixed rotation. This causes the mass to be reset.
        * @param fixed True for no rotation, false to allow for rotation.
        **/
        public SetFixedRotation(fixed: boolean): void;
        /**
        * Set the linear damping of the body.
        * @param linearDamping The new linear damping for this body.
        **/
        public SetLinearDamping(linearDamping: number): void;
        /**
        * Set the linear velocity of the center of mass.
        * @param v New linear velocity of the center of mass.
        **/
        public SetLinearVelocity(v: Common.Math.b2Vec2): void;
        /**
        * Set the mass properties to override the mass properties of the fixtures Note that this changes the center of mass position. Note that creating or destroying fixtures can also alter the mass. This function has no effect if the body isn't dynamic.
        * @warning The supplied rotational inertia should be relative to the center of mass.
        * @param massData New mass data properties.
        **/
        public SetMassData(massData: Collision.Shapes.b2MassData): void;
        /**
        * Set the world body origin position.
        * @param position New world body origin position.
        **/
        public SetPosition(position: Common.Math.b2Vec2): void;
        /**
        * Set the position of the body's origin and rotation (radians). This breaks any contacts and wakes the other bodies.
        * @param position New world body origin position.
        * @param angle New world rotation angle of the body in radians.
        **/
        public SetPositionAndAngle(position: Common.Math.b2Vec2, angle: number): void;
        /**
        * Is this body allowed to sleep
        * @param flag True if the body can sleep, false if not.
        **/
        public SetSleepingAllowed(flag: boolean): void;
        /**
        * Set the position of the body's origin and rotation (radians). This breaks any contacts and wakes the other bodies. Note this is less efficient than the other overload - you should use that if the angle is available.
        * @param xf Body's origin and rotation (radians).
        **/
        public SetTransform(xf: Common.Math.b2Transform): void;
        /**
        * Set the type of this body. This may alter the mass and velocity
        * @param type Type enum.
        **/
        public SetType(type: number): void;
        /**
        * Set the user data. Use this to store your application specific data.
        * @param data The user data for this body.
        **/
        public SetUserData(data: any): void;
        /**
        * Splits a body into two, preserving dynamic properties
        * @note This provides a feature specific to this port.
        * @param callback
        * @return The newly created bodies from the split.
        **/
        public Split(callback: (fixture: b2Fixture) => boolean): b2Body;
    }
}
declare module Box2D.Dynamics {
    /**
    * A body definition holds all the data needed to construct a rigid body. You can safely re-use body definitions.
    **/
    class b2BodyDef {
        /**
        * Does this body start out active?
        **/
        public active: boolean;
        /**
        * Set this flag to false if this body should never fall asleep. Note that this increases CPU usage.
        **/
        public allowSleep: boolean;
        /**
        * The world angle of the body in radians.
        **/
        public angle: number;
        /**
        * Angular damping is use to reduce the angular velocity. The damping parameter can be larger than 1.0f but the damping effect becomes sensitive to the time step when the damping parameter is large.
        **/
        public angularDamping: number;
        /**
        * The angular velocity of the body.
        **/
        public angularVelocity: number;
        /**
        * Is this body initially awake or sleeping?
        **/
        public awake: boolean;
        /**
        * Is this a fast moving body that should be prevented from tunneling through other moving bodies? Note that all bodies are prevented from tunneling through static bodies.
        * @warning You should use this flag sparingly since it increases processing time.
        **/
        public bullet: boolean;
        /**
        * Should this body be prevented from rotating? Useful for characters.
        **/
        public fixedRotation: boolean;
        /**
        * Scales the inertia tensor.
        * @warning Experimental
        **/
        public inertiaScale: number;
        /**
        * Linear damping is use to reduce the linear velocity. The damping parameter can be larger than 1.0f but the damping effect becomes sensitive to the time step when the damping parameter is large.
        **/
        public linearDamping: number;
        /**
        * The linear velocity of the body's origin in world co-ordinates.
        **/
        public linearVelocity: Common.Math.b2Vec2;
        /**
        * The world position of the body. Avoid creating bodies at the origin since this can lead to many overlapping shapes.
        **/
        public position: Common.Math.b2Vec2;
        /**
        * The body type: static, kinematic, or dynamic. A member of the b2BodyType class .
        * @note If a dynamic body would have zero mass, the mass is set to one.
        **/
        public type: number;
        /**
        * Use this to store application specific body data.
        **/
        public userData: any;
    }
}
declare module Box2D.Dynamics {
    /**
    * Implement this class to provide collision filtering. In other words, you can implement this class if you want finer control over contact creation.
    **/
    class b2ContactFilter {
        /**
        * Return true if the given fixture should be considered for ray intersection. By default, userData is cast as a b2Fixture and collision is resolved according to ShouldCollide.
        * @note This function is not in the box2dweb.as code -- might not work.
        * @see b2World.Raycast()
        * @see b2ContactFilter.ShouldCollide()
        * @param userData User provided data.  Comments indicate that this might be a b2Fixture.
        * @return True if the fixture should be considered for ray intersection, otherwise false.
        **/
        public RayCollide(userData: any): boolean;
        /**
        * Return true if contact calculations should be performed between these two fixtures.
        * @warning For performance reasons this is only called when the AABBs begin to overlap.
        * @param fixtureA b2Fixture potentially colliding with fixtureB.
        * @param fixtureB b2Fixture potentially colliding with fixtureA.
        * @return True if fixtureA and fixtureB probably collide requiring more calculations, otherwise false.
        **/
        public ShouldCollide(fixtureA: b2Fixture, fixtureB: b2Fixture): boolean;
    }
}
declare module Box2D.Dynamics {
    /**
    * Contact impulses for reporting. Impulses are used instead of forces because sub-step forces may approach infinity for rigid body collisions. These match up one-to-one with the contact points in b2Manifold.
    **/
    class b2ContactImpulse {
        /**
        * Normal impulses.
        **/
        public normalImpulses: Common.Math.b2Vec2;
        /**
        * Tangent impulses.
        **/
        public tangentImpulses: Common.Math.b2Vec2;
    }
}
declare module Box2D.Dynamics {
    /**
    * Implement this class to get contact information. You can use these results for things like sounds and game logic. You can also get contact results by traversing the contact lists after the time step. However, you might miss some contacts because continuous physics leads to sub-stepping. Additionally you may receive multiple callbacks for the same contact in a single time step. You should strive to make your callbacks efficient because there may be many callbacks per time step.
    * @warning You cannot create/destroy Box2D entities inside these callbacks.
    **/
    class b2ContactListener {
        /**
        * Called when two fixtures begin to touch.
        * @param contact Contact point.
        **/
        public BeginContact(contact: Contacts.b2Contact): void;
        /**
        * Called when two fixtures cease to touch.
        * @param contact Contact point.
        **/
        public EndContact(contact: Contacts.b2Contact): void;
        /**
        * This lets you inspect a contact after the solver is finished. This is useful for inspecting impulses. Note: the contact manifold does not include time of impact impulses, which can be arbitrarily large if the sub-step is small. Hence the impulse is provided explicitly in a separate data structure. Note: this is only called for contacts that are touching, solid, and awake.
        * @param contact Contact point.
        * @param impulse Contact impulse.
        **/
        public PostSolve(contact: Contacts.b2Contact, impulse: b2ContactImpulse): void;
        /**
        * This is called after a contact is updated. This allows you to inspect a contact before it goes to the solver. If you are careful, you can modify the contact manifold (e.g. disable contact). A copy of the old manifold is provided so that you can detect changes. Note: this is called only for awake bodies. Note: this is called even when the number of contact points is zero. Note: this is not called for sensors. Note: if you set the number of contact points to zero, you will not get an EndContact callback. However, you may get a BeginContact callback the next step.
        * @param contact Contact point.
        * @param oldManifold Old manifold.
        **/
        public PreSolve(contact: Contacts.b2Contact, oldManifold: Collision.b2Manifold): void;
    }
}
declare module Box2D.Dynamics {
    /**
    * Implement and register this class with a b2World to provide debug drawing of physics entities in your game.
    * @example Although Box2D is a physics engine and therefore has nothing to do with drawing, Box2dFlash provides such methods for debugging which are defined in the b2DebugDraw class. In Box2dWeb, a b2DebugDraw takes a canvas-context instead of a Sprite:
    *
    *	var debugDraw = new Box2D.Dynamics.b2DebugDraw();
    *	debugDraw.SetSprite(document.GetElementsByTagName("canvas")[0].getContext("2d"));
    **/
    class b2DebugDraw {
        /**
        * Draw axis aligned bounding boxes.
        **/
        static e_aabbBit: number;
        /**
        * Draw center of mass frame.
        **/
        static e_centerOfMassBit: number;
        /**
        * Draw controllers.
        **/
        static e_controllerBit: number;
        /**
        * Draw joint connections.
        **/
        static e_jointBit: number;
        /**
        * Draw broad-phase pairs.
        **/
        static e_pairBit: number;
        /**
        * Draw shapes.
        **/
        static e_shapeBit: number;
        /**
        * Constructor.
        **/
        constructor();
        /**
        * Append flags to the current flags.
        * @param flags Flags to add.
        **/
        public AppendFlags(flags: number): void;
        /**
        * Clear flags from the current flags.
        * @param flags flags to clear.
        **/
        public ClearFlags(flags: number): void;
        /**
        * Draw a circle.
        * @param center Circle center point.
        * @param radius Circle radius.
        * @param color Circle draw color.
        **/
        public DrawCircle(center: Common.Math.b2Vec2, radius: number, color: Common.b2Color): void;
        /**
        * Draw a closed polygon provided in CCW order.
        * @param vertices Polygon verticies.
        * @param vertexCount Number of vertices in the polygon, usually vertices.length.
        * @param color Polygon draw color.
        **/
        public DrawPolygon(vertices: Common.Math.b2Vec2[], vertexCount: number, color: Common.b2Color): void;
        /**
        * Draw a line segment.
        * @param p1 Line beginpoint.
        * @param p2 Line endpoint.
        * @param color Line color.
        **/
        public DrawSegment(p1: Common.Math.b2Vec2, p2: Common.Math.b2Vec2, color: Common.b2Color): void;
        /**
        * Draw a solid circle.
        * @param center Circle center point.
        * @param radius Circle radius.
        * @param axis Circle axis.
        * @param color Circle color.
        **/
        public DrawSolidCircle(center: Common.Math.b2Vec2, radius: number, axis: Common.Math.b2Vec2, color: Common.b2Color): void;
        /**
        * Draw a solid closed polygon provided in CCW order.
        * @param vertices Polygon verticies.
        * @param vertexCount Number of vertices in the polygon, usually vertices.length.
        * @param color Polygon draw color.
        **/
        public DrawSolidPolygon(vertices: Common.Math.b2Vec2[], vertexCount: number, color: Common.b2Color): void;
        /**
        * Draw a transform. Choose your own length scale.
        * @param xf Transform to draw.
        **/
        public DrawTransform(xf: Common.Math.b2Transform): void;
        /**
        * Get the alpha value used for lines.
        * @return Alpha value used for drawing lines.
        **/
        public GetAlpha(): number;
        /**
        * Get the draw scale.
        * @return Draw scale ratio.
        **/
        public GetDrawScale(): number;
        /**
        * Get the alpha value used for fills.
        * @return Alpha value used for drawing fills.
        **/
        public GetFillAlpha(): number;
        /**
        * Get the drawing flags.
        * @return Drawing flags.
        **/
        public GetFlags(): number;
        /**
        * Get the line thickness.
        * @return Line thickness.
        **/
        public GetLineThickness(): number;
        /**
        * Get the HTML Canvas Element for drawing.
        * @note box2dflash uses Sprite object, box2dweb uses CanvasRenderingContext2D, that is why this function is called GetSprite().
        * @return The HTML Canvas Element used for debug drawing.
        **/
        public GetSprite(): CanvasRenderingContext2D;
        /**
        * Get the scale used for drawing XForms.
        * @return Scale for drawing transforms.
        **/
        public GetXFormScale(): number;
        /**
        * Set the alpha value used for lines.
        * @param alpha Alpha value for drawing lines.
        **/
        public SetAlpha(alpha: number): void;
        /**
        * Set the draw scale.
        * @param drawScale Draw scale ratio.
        **/
        public SetDrawScale(drawScale: number): void;
        /**
        * Set the alpha value used for fills.
        * @param alpha Alpha value for drawing fills.
        **/
        public SetFillAlpha(alpha: number): void;
        /**
        * Set the drawing flags.
        * @param flags Sets the drawing flags.
        **/
        public SetFlags(flags: number): void;
        /**
        * Set the line thickness.
        * @param lineThickness The new line thickness.
        **/
        public SetLineThickness(lineThickness: number): void;
        /**
        * Set the HTML Canvas Element for drawing.
        * @note box2dflash uses Sprite object, box2dweb uses CanvasRenderingContext2D, that is why this function is called SetSprite().
        * @param canvas HTML Canvas Element to draw debug information to.
        **/
        public SetSprite(canvas: CanvasRenderingContext2D): void;
        /**
        * Set the scale used for drawing XForms.
        * @param xformScale The transform scale.
        **/
        public SetXFormScale(xformScale: number): void;
    }
}
declare module Box2D.Dynamics {
    /**
    * Joints and shapes are destroyed when their associated body is destroyed. Implement this listener so that you may nullify references to these joints and shapes.
    **/
    class b2DestructionListener {
        /**
        * Called when any fixture is about to be destroyed due to the destruction of its parent body.
        * @param fixture b2Fixture being destroyed.
        **/
        public SayGoodbyeFixture(fixture: b2Fixture): void;
        /**
        * Called when any joint is about to be destroyed due to the destruction of one of its attached bodies.
        * @param joint b2Joint being destroyed.
        **/
        public SayGoodbyeJoint(joint: Joints.b2Joint): void;
    }
}
declare module Box2D.Dynamics {
    /**
    * This holds contact filtering data.
    **/
    class b2FilterData {
        /**
        * The collision category bits. Normally you would just set one bit.
        **/
        public categoryBits: number;
        /**
        * Collision groups allow a certain group of objects to never collide (negative) or always collide (positive). Zero means no collision group. Non-zero group filtering always wins against the mask bits.
        **/
        public groupIndex: number;
        /**
        * The collision mask bits. This states the categories that this shape would accept for collision.
        **/
        public maskBits: number;
        /**
        * Creates a copy of the filter data.
        * @return Copy of this filter data.
        **/
        public Copy(): b2FilterData;
    }
}
declare module Box2D.Dynamics {
    /**
    * A fixture is used to attach a shape to a body for collision detection. A fixture inherits its transform from its parent. Fixtures hold additional non-geometric data such as friction, collision filters, etc. Fixtures are created via b2Body::CreateFixture.
    * @warning  you cannot reuse fixtures.
    **/
    class b2Fixture {
        /**
        * Get the fixture's AABB. This AABB may be enlarge and/or stale. If you need a more accurate AABB, compute it using the shape and the body transform.
        * @return Fiture's AABB.
        **/
        public GetAABB(): Collision.b2AABB;
        /**
        * Get the parent body of this fixture. This is NULL if the fixture is not attached.
        * @return The parent body.
        **/
        public GetBody(): b2Body;
        /**
        * Get the density of this fixture.
        * @return Density
        **/
        public GetDensity(): number;
        /**
        * Get the contact filtering data.
        * @return Filter data.
        **/
        public GetFilterData(): b2FilterData;
        /**
        * Get the coefficient of friction.
        * @return Friction.
        **/
        public GetFriction(): number;
        /**
        * Get the mass data for this fixture. The mass data is based on the density and the shape. The rotational inertia is about the shape's origin. This operation may be expensive.
        * @param massData This is a reference to a valid b2MassData, if it is null a new b2MassData is allocated and then returned.  Default = null.
        * @return Mass data.
        **/
        public GetMassData(massData?: Collision.Shapes.b2MassData): Collision.Shapes.b2MassData;
        /**
        * Get the next fixture in the parent body's fixture list.
        * @return Next fixture.
        **/
        public GetNext(): b2Fixture;
        /**
        * Get the coefficient of restitution.
        * @return Restitution.
        **/
        public GetRestitution(): number;
        /**
        * Get the child shape. You can modify the child shape, however you should not change the number of vertices because this will crash some collision caching mechanisms.
        * @return Fixture shape.
        **/
        public GetShape(): Collision.Shapes.b2Shape;
        /**
        * Get the type of the child shape. You can use this to down cast to the concrete shape.
        * @return Shape type enum.
        **/
        public GetType(): number;
        /**
        * Get the user data that was assigned in the fixture definition. Use this to store your application specific data.
        * @return User provided data.  Cast to your object type.
        **/
        public GetUserData(): any;
        /**
        * Is this fixture a sensor (non-solid)?
        * @return True if the shape is a sensor, otherwise false.
        **/
        public IsSensor(): boolean;
        /**
        * Perform a ray cast against this shape.
        * @param output Ray cast results.  This argument is out.
        * @param input Ray cast input parameters.
        * @return True if the ray hits the shape, otherwise false.
        **/
        public RayCast(output: Collision.b2RayCastOutput, input: Collision.b2RayCastInput): boolean;
        /**
        * Set the density of this fixture. This will _not_ automatically adjust the mass of the body. You must call b2Body::ResetMassData to update the body's mass.
        * @param density The new density.
        **/
        public SetDensity(density: number): void;
        /**
        * Set the contact filtering data. This will not update contacts until the next time step when either parent body is active and awake.
        * @param filter The new filter data.
        **/
        public SetFilterData(filter: any): void;
        /**
        * Set the coefficient of friction.
        * @param friction The new friction coefficient.
        **/
        public SetFriction(friction: number): void;
        /**
        * Get the coefficient of restitution.
        * @param resitution The new restitution coefficient.
        **/
        public SetRestitution(restitution: number): void;
        /**
        * Set if this fixture is a sensor.
        * @param sensor True to set as a sensor, false to not be a sensor.
        **/
        public SetSensor(sensor: boolean): void;
        /**
        * Set the user data. Use this to store your application specific data.
        * @param data User provided data.
        **/
        public SetUserData(data: any): void;
        /**
        * Test a point for containment in this fixture.
        * @param p Point to test against, in world coordinates.
        * @return True if the point is in this shape, otherwise false.
        **/
        public TestPoint(p: Common.Math.b2Vec2): boolean;
    }
}
declare module Box2D.Dynamics {
    /**
    * A fixture definition is used to create a fixture. This class defines an abstract fixture definition. You can reuse fixture definitions safely.
    **/
    class b2FixtureDef {
        /**
        * The density, usually in kg/m^2.
        **/
        public density: number;
        /**
        * Contact filtering data.
        **/
        public filter: b2FilterData;
        /**
        * The friction coefficient, usually in the range [0,1].
        **/
        public friction: number;
        /**
        * A sensor shape collects contact information but never generates a collision response.
        **/
        public isSensor: boolean;
        /**
        * The restitution (elasticity) usually in the range [0,1].
        **/
        public restitution: number;
        /**
        * The shape, this must be set. The shape will be cloned, so you can create the shape on the stack.
        **/
        public shape: Collision.Shapes.b2Shape;
        /**
        * Use this to store application specific fixture data.
        **/
        public userData: any;
        /**
        * The constructor sets the default fixture definition values.
        **/
        constructor();
    }
}
declare module Box2D.Dynamics {
    /**
    * The world class manages all physics entities, dynamic simulation, and asynchronous queries.
    **/
    class b2World {
        /**
        * Locked
        **/
        static e_locked: number;
        /**
        * New Fixture
        **/
        static e_newFixture: number;
        /**
        * Creates a new world.
        * @param gravity The world gravity vector.
        * @param doSleep Improvie performance by not simulating inactive bodies.
        **/
        constructor(gravity: Common.Math.b2Vec2, doSleep: boolean);
        /**
        * Add a controller to the world list.
        * @param c Controller to add.
        * @return Controller that was added to the world.
        **/
        public AddController(c: Controllers.b2Controller): Controllers.b2Controller;
        /**
        * Call this after you are done with time steps to clear the forces. You normally call this after each call to Step, unless you are performing sub-steps.
        **/
        public ClearForces(): void;
        /**
        * Create a rigid body given a definition. No reference to the definition is retained.
        * @param def Body's definition.
        * @return Created rigid body.
        **/
        public CreateBody(def: b2BodyDef): b2Body;
        /**
        * Creates a new controller.
        * @param controller New controller.
        * @return New controller.
        **/
        public CreateController(controller: Controllers.b2Controller): Controllers.b2Controller;
        /**
        * Create a joint to constrain bodies together. No reference to the definition is retained. This may cause the connected bodies to cease colliding.
        * @warning This function is locked during callbacks.
        * @param def Joint definition.
        * @return New created joint.
        **/
        public CreateJoint(def: Joints.b2JointDef): Joints.b2Joint;
        /**
        * Destroy a rigid body given a definition. No reference to the definition is retained. This function is locked during callbacks.
        * @param b Body to destroy.
        * @warning This function is locked during callbacks.
        **/
        public DestroyBody(b: b2Body): void;
        /**
        * Destroy a controller given the controller instance.
        * @warning This function is locked during callbacks.
        * @param controller Controller to destroy.
        **/
        public DestroyController(controller: Controllers.b2Controller): void;
        /**
        * Destroy a joint. This may cause the connected bodies to begin colliding.
        * @param j Joint to destroy.
        **/
        public DestroyJoint(j: Joints.b2Joint): void;
        /**
        * Call this to draw shapes and other debug draw data.
        **/
        public DrawDebugData(): void;
        /**
        * Get the number of bodies.
        * @return Number of bodies in this world.
        **/
        public GetBodyCount(): number;
        /**
        * Get the world body list. With the returned body, use b2Body::GetNext to get the next body in the world list. A NULL body indicates the end of the list.
        * @return The head of the world body list.
        **/
        public GetBodyList(): b2Body;
        /**
        * Get the number of contacts (each may have 0 or more contact points).
        * @return Number of contacts.
        **/
        public GetContactCount(): number;
        /**
        * Get the world contact list. With the returned contact, use b2Contact::GetNext to get the next contact in the world list. A NULL contact indicates the end of the list.
        * @return The head of the world contact list.
        **/
        public GetContactList(): Contacts.b2Contact;
        /**
        * Get the global gravity vector.
        * @return Global gravity vector.
        **/
        public GetGravity(): Common.Math.b2Vec2;
        /**
        * The world provides a single static ground body with no collision shapes. You can use this to simplify the creation of joints and static shapes.
        * @return The ground body.
        **/
        public GetGroundBody(): b2Body;
        /**
        * Get the number of joints.
        * @return The number of joints in the world.
        **/
        public GetJointCount(): number;
        /**
        * Get the world joint list. With the returned joint, use b2Joint::GetNext to get the next joint in the world list. A NULL joint indicates the end of the list.
        * @return The head of the world joint list.
        **/
        public GetJointList(): Joints.b2Joint;
        /**
        * Get the number of broad-phase proxies.
        * @return Number of borad-phase proxies.
        **/
        public GetProxyCount(): number;
        /**
        * Is the world locked (in the middle of a time step).
        * @return True if the world is locked and in the middle of a time step, otherwise false.
        **/
        public IsLocked(): boolean;
        /**
        * Query the world for all fixtures that potentially overlap the provided AABB.
        * @param callback  A user implemented callback class. It should match signature function Callback(fixture:b2Fixture):Boolean.  Return true to continue to the next fixture.
        * @param aabb The query bounding box.
        **/
        public QueryAABB(callback: (fixutre: b2Fixture) => boolean, aabb: Collision.b2AABB): void;
        /**
        * Query the world for all fixtures that contain a point.
        * @note This provides a feature specific to this port.
        * @param callback A user implemented callback class.  It should match signature function Callback(fixture:b2Fixture):Boolean.  Return true to continue to the next fixture.
        * @param p The query point.
        **/
        public QueryPoint(callback: (fixture: b2Fixture) => boolean, p: Common.Math.b2Vec2): void;
        /**
        * Query the world for all fixtures that precisely overlap the provided transformed shape.
        * @note This provides a feature specific to this port.
        * @param callback A user implemented callback class.  It should match signature function Callback(fixture:b2Fixture):Boolean.  Return true to continue to the next fixture.
        * @param shape The query shape.
        * @param transform Optional transform, default = null.
        **/
        public QueryShape(callback: (fixture: b2Fixture) => boolean, shape: Collision.Shapes.b2Shape, transform?: Common.Math.b2Transform): void;
        /**
        * Ray-cast the world for all fixtures in the path of the ray. Your callback Controls whether you get the closest point, any point, or n-points The ray-cast ignores shapes that contain the starting point.
        * @param callback A callback function which must be of signature:
        *	function Callback(
        *		fixture:b2Fixture,	// The fixture hit by the ray
        *		point:b2Vec2,		// The point of initial intersection
        *		normal:b2Vec2,		// The normal vector at the point of intersection
        *		fraction:Number		// The fractional length along the ray of the intersection
        *	 ):Number
        *	 Callback should return the new length of the ray as a fraction of the original length. By returning 0, you immediately terminate. By returning 1, you continue wiht the original ray. By returning the current fraction, you proceed to find the closest point.
        * @param point1 The ray starting point.
        * @param point2 The ray ending point.
        **/
        public RayCast(callback: (fixture: b2Fixture, point: Common.Math.b2Vec2, normal: Common.Math.b2Vec2, fraction: number) => number, point1: Common.Math.b2Vec2, point2: Common.Math.b2Vec2): void;
        /**
        * Ray-cast the world for all fixture in the path of the ray.
        * @param point1 The ray starting point.
        * @param point2 The ray ending point.
        * @return Array of all the fixtures intersected by the ray.
        **/
        public RayCastAll(point1: Common.Math.b2Vec2, point2: Common.Math.b2Vec2): b2Fixture[];
        /**
        * Ray-cast the world for the first fixture in the path of the ray.
        * @param point1 The ray starting point.
        * @param point2 The ray ending point.
        * @return First fixture intersected by the ray.
        **/
        public RayCastOne(point1: Common.Math.b2Vec2, point2: Common.Math.b2Vec2): b2Fixture;
        /**
        * Removes the controller from the world.
        * @param c Controller to remove.
        **/
        public RemoveController(c: Controllers.b2Controller): void;
        /**
        * Use the given object as a broadphase. The old broadphase will not be cleanly emptied.
        * @warning This function is locked during callbacks.
        * @param broadphase: Broad phase implementation.
        **/
        public SetBroadPhase(broadPhase: Collision.IBroadPhase): void;
        /**
        * Register a contact filter to provide specific control over collision. Otherwise the default filter is used (b2_defaultFilter).
        * @param filter Contact filter'er.
        **/
        public SetContactFilter(filter: b2ContactFilter): void;
        /**
        * Register a contact event listener.
        * @param listener Contact event listener.
        **/
        public SetContactListener(listener: b2ContactListener): void;
        /**
        * Enable/disable continuous physics. For testing.
        * @param flag True for continuous physics, otherwise false.
        **/
        public SetContinuousPhysics(flag: boolean): void;
        /**
        * Register a routine for debug drawing. The debug draw functions are called inside the b2World::Step method, so make sure your renderer is ready to consume draw commands when you call Step().
        * @param debugDraw Debug drawing instance.
        **/
        public SetDebugDraw(debugDraw: b2DebugDraw): void;
        /**
        * Destruct the world. All physics entities are destroyed and all heap memory is released.
        * @param listener Destruction listener instance.
        **/
        public SetDestructionListener(listener: b2DestructionListener): void;
        /**
        * Change the global gravity vector.
        * @param gravity New global gravity vector.
        **/
        public SetGravity(gravity: Common.Math.b2Vec2): void;
        /**
        * Enable/disable warm starting. For testing.
        * @param flag True for warm starting, otherwise false.
        **/
        public SetWarmStarting(flag: boolean): void;
        /**
        * Take a time step. This performs collision detection, integration, and constraint solution.
        * @param dt The amout of time to simulate, this should not vary.
        * @param velocityIterations For the velocity constraint solver.
        * @param positionIterations For the position constraint solver.
        **/
        public Step(dt: number, velocityIterations: number, positionIterations: number): void;
        /**
        * Perform validation of internal data structures.
        **/
        public Validate(): void;
    }
}
declare module Box2D.Dynamics.Contacts {
    /**
    * The class manages contact between two shapes. A contact exists for each overlapping AABB in the broad-phase (except if filtered). Therefore a contact object may exist that has no contact points.
    **/
    class b2Contact {
        /**
        * Constructor
        **/
        constructor();
        /**
        * Flag this contact for filtering. Filtering will occur the next time step.
        **/
        public FlagForFiltering(): void;
        /**
        * Get the first fixture in this contact.
        * @return First fixture in this contact.
        **/
        public GetFixtureA(): b2Fixture;
        /**
        * Get the second fixture in this contact.
        * @return Second fixture in this contact.
        **/
        public GetFixtureB(): b2Fixture;
        /**
        * Get the contact manifold. Do not modify the manifold unless you understand the internals of Box2D.
        * @return Contact manifold.
        **/
        public GetManifold(): Collision.b2Manifold;
        /**
        * Get the next contact in the world's contact list.
        * @return Next contact in the world's contact list.
        **/
        public GetNext(): b2Contact;
        /**
        * Get the world manifold.
        * @param worldManifold World manifold out.
        * @return World manifold.
        **/
        public GetWorldManifold(worldManifold: Collision.b2WorldManifold): void;
        /**
        * Does this contact generate TOI events for continuous simulation.
        * @return True for continous, otherwise false.
        **/
        public IsContinuous(): boolean;
        /**
        * Has this contact been disabled?
        * @return True if disabled, otherwise false.
        **/
        public IsEnabled(): boolean;
        /**
        * Is this contact a sensor?
        * @return True if sensor, otherwise false.
        **/
        public IsSensor(): boolean;
        /**
        * Is this contact touching.
        * @return True if contact is touching, otherwise false.
        **/
        public IsTouching(): boolean;
        /**
        * Enable/disable this contact. This can be used inside the pre-solve contact listener. The contact is only disabled for the current time step (or sub-step in continuous collision).
        * @param flag True to enable, false to disable.
        **/
        public SetEnabled(flag: boolean): void;
        /**
        * Change this to be a sensor or-non-sensor contact.
        * @param sensor True to be sensor, false to not be a sensor.
        **/
        public SetSensor(sensor: boolean): void;
    }
}
declare module Box2D.Dynamics.Contacts {
    /**
    * A contact edge is used to connect bodies and contacts together in a contact graph where each body is a node and each contact is an edge. A contact edge belongs to a doubly linked list maintained in each attached body. Each contact has two contact nodes, one for each attached body.
    **/
    class b2ContactEdge {
        /**
        * Contact.
        **/
        public contact: b2Contact;
        /**
        * Next contact edge.
        **/
        public next: b2ContactEdge;
        /**
        * Contact body.
        **/
        public other: b2Body;
        /**
        * Previous contact edge.
        **/
        public prev: b2ContactEdge;
    }
}
declare module Box2D.Dynamics.Contacts {
    /**
    * This structure is used to report contact point results.
    **/
    class b2ContactResult {
        /**
        * The contact id identifies the features in contact.
        **/
        public id: Collision.b2ContactID;
        /**
        * Points from shape1 to shape2.
        **/
        public normal: Common.Math.b2Vec2;
        /**
        * The normal impulse applied to body2.
        **/
        public normalImpulse: number;
        /**
        * Position in world coordinates.
        **/
        public position: Common.Math.b2Vec2;
        /**
        * The first shape.
        **/
        public shape1: Collision.Shapes.b2Shape;
        /**
        * The second shape.
        **/
        public shape2: Collision.Shapes.b2Shape;
        /**
        * The tangent impulse applied to body2.
        **/
        public tangentImpulse: number;
    }
}
declare module Box2D.Dynamics.Controllers {
    /**
    * Base class for controllers. Controllers are a convience for encapsulating common per-step functionality.
    **/
    class b2Controller {
        /**
        * Body count.
        **/
        public m_bodyCount: number;
        /**
        * List of bodies.
        **/
        public m_bodyList: b2ControllerEdge;
        /**
        * Adds a body to the controller.
        * @param body Body to add.
        **/
        public AddBody(body: b2Body): void;
        /**
        * Removes all bodies from the controller.
        **/
        public Clear(): void;
        /**
        * Debug drawing.
        * @param debugDraw Handle to drawer.
        **/
        public Draw(debugDraw: b2DebugDraw): void;
        /**
        * Gets the body list.
        * @return Body list.
        **/
        public GetBodyList(): b2ControllerEdge;
        /**
        * Gets the next controller.
        * @return Next controller.
        **/
        public GetNext(): b2Controller;
        /**
        * Gets the world.
        * @return World.
        **/
        public GetWorld(): b2World;
        /**
        * Removes a body from the controller.
        * @param body Body to remove from this controller.
        **/
        public RemoveBody(body: b2Body): void;
        /**
        * Step
        * @param step b2TimeStep -> Private internal class.  Not sure why this is exposed.
        **/
        public Step(step: any): void;
    }
}
declare module Box2D.Dynamics.Controllers {
    /**
    * Controller Edge.
    **/
    class b2ControllerEdge {
        /**
        * Body.
        **/
        public body: b2Body;
        /**
        * Provides quick access to the other end of this edge.
        **/
        public controller: b2Controller;
        /**
        * The next controller edge in the controller's body list.
        **/
        public nextBody: b2ControllerEdge;
        /**
        * The next controller edge in the body's controller list.
        **/
        public nextController: b2ControllerEdge;
        /**
        * The previous controller edge in the controller's body list.
        **/
        public prevBody: b2ControllerEdge;
        /**
        * The previous controller edge in the body's controller list.
        **/
        public prevController: b2ControllerEdge;
    }
}
declare module Box2D.Dynamics.Controllers {
    /**
    * Calculates buoyancy forces for fluids in the form of a half plane.
    **/
    class b2BuoyancyController extends b2Controller {
        /**
        * Linear drag co-efficient.
        * @default = 1
        **/
        public angularDrag: number;
        /**
        * The fluid density.
        * @default = 0
        **/
        public density: number;
        /**
        * Gravity vector, if the world's gravity is not used.
        * @default = null
        **/
        public gravity: Common.Math.b2Vec2;
        /**
        * Linear drag co-efficient.
        * @default = 2
        **/
        public linearDrag: number;
        /**
        * The outer surface normal.
        **/
        public normal: Common.Math.b2Vec2;
        /**
        * The height of the fluid surface along the normal.
        * @default = 0
        **/
        public offset: number;
        /**
        * If false, bodies are assumed to be uniformly dense, otherwise use the shapes densities.
        * @default = false.
        **/
        public useDensity: boolean;
        /**
        * If true, gravity is taken from the world instead of the gravity parameter.
        * @default = true.
        **/
        public useWorldGravity: boolean;
        /**
        * Fluid velocity, for drag calculations.
        **/
        public velocity: Common.Math.b2Vec2;
    }
}
declare module Box2D.Dynamics.Controllers {
    /**
    * Applies an acceleration every frame, like gravity
    **/
    class b2ConstantAccelController extends b2Controller {
        /**
        * The acceleration to apply.
        **/
        public A: Common.Math.b2Vec2;
        /**
        * @see b2Controller.Step
        **/
        public Step(step: any): void;
    }
}
declare module Box2D.Dynamics.Controllers {
    /**
    * Applies an acceleration every frame, like gravity.
    **/
    class b2ConstantForceController extends b2Controller {
        /**
        * The acceleration to apply.
        **/
        public A: Common.Math.b2Vec2;
        /**
        * @see b2Controller.Step
        **/
        public Step(step: any): void;
    }
}
declare module Box2D.Dynamics.Controllers {
    /**
    * Applies simplified gravity between every pair of bodies.
    **/
    class b2GravityController extends b2Controller {
        /**
        * Specifies the strength of the gravitation force.
        * @default = 1
        **/
        public G: number;
        /**
        * If true, gravity is proportional to r^-2, otherwise r^-1.
        **/
        public invSqr: boolean;
        /**
        * @see b2Controller.Step
        **/
        public Step(step: any): void;
    }
}
declare module Box2D.Dynamics.Controllers {
    /**
    * Applies top down linear damping to the controlled bodies The damping is calculated by multiplying velocity by a matrix in local co-ordinates.
    **/
    class b2TensorDampingController extends b2Controller {
        /**
        * Set this to a positive number to clamp the maximum amount of damping done.
        * @default = 0
        **/
        public maxTimeStep: number;
        /**
        * Tensor to use in damping model.
        **/
        public T: Common.Math.b2Mat22;
        /**
        * Helper function to set T in a common case.
        * @param xDamping x
        * @param yDamping y
        **/
        public SetAxisAligned(xDamping: number, yDamping: number): void;
        /**
        * @see b2Controller.Step
        **/
        public Step(step: any): void;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * The base joint class. Joints are used to constraint two bodies together in various fashions. Some joints also feature limits and motors.
    **/
    class b2Joint {
        /**
        * Get the anchor point on bodyA in world coordinates.
        * @return Anchor A point.
        **/
        public GetAnchorA(): Common.Math.b2Vec2;
        /**
        * Get the anchor point on bodyB in world coordinates.
        * @return Anchor B point.
        **/
        public GetAnchorB(): Common.Math.b2Vec2;
        /**
        * Get the first body attached to this joint.
        * @return Body A.
        **/
        public GetBodyA(): b2Body;
        /**
        * Get the second body attached to this joint.
        * @return Body B.
        **/
        public GetBodyB(): b2Body;
        /**
        * Get the next joint the world joint list.
        * @return Next joint.
        **/
        public GetNext(): b2Joint;
        /**
        * Get the reaction force on body2 at the joint anchor in Newtons.
        * @param inv_dt
        * @return Reaction force (N)
        **/
        public GetReactionForce(inv_dt: number): Common.Math.b2Vec2;
        /**
        * Get the reaction torque on body2 in N.
        * @param inv_dt
        * @return Reaction torque (N).
        **/
        public GetReactionTorque(inv_dt: number): number;
        /**
        * Get the type of the concrete joint.
        * @return Joint type.
        **/
        public GetType(): number;
        /**
        * Get the user data pointer.
        * @return User data.  Cast to your data type.
        **/
        public GetUserData(): any;
        /**
        * Short-cut function to determine if either body is inactive.
        * @return True if active, otherwise false.
        **/
        public IsActive(): boolean;
        /**
        * Set the user data pointer.
        * @param data Your custom data.
        **/
        public SetUserData(data: any): any;
        public void: any;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * Joint definitions are used to construct joints.
    **/
    class b2JointDef {
        /**
        * The first attached body.
        **/
        public bodyA: b2Body;
        /**
        * The second attached body.
        **/
        public bodyB: b2Body;
        /**
        * Set this flag to true if the attached bodies should collide.
        **/
        public collideConnected: boolean;
        /**
        * The joint type is set automatically for concrete joint types.
        **/
        public type: number;
        /**
        * Use this to attach application specific data to your joints.
        **/
        public userData: any;
        /**
        * Constructor.
        **/
        constructor();
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * A joint edge is used to connect bodies and joints together in a joint graph where each body is a node and each joint is an edge. A joint edge belongs to a doubly linked list maintained in each attached body. Each joint has two joint nodes, one for each attached body.
    **/
    class b2JointEdge {
        /**
        * The joint.
        **/
        public joint: b2Joint;
        /**
        * The next joint edge in the body's joint list.
        **/
        public next: b2JointEdge;
        /**
        * Provides quick access to the other body attached.
        **/
        public other: b2Body;
        /**
        * The previous joint edge in the body's joint list.
        **/
        public prev: b2JointEdge;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * A distance joint constrains two points on two bodies to remain at a fixed distance from each other. You can view this as a massless, rigid rod.
    **/
    class b2DistanceJoint extends b2Joint {
        /**
        * Get the anchor point on bodyA in world coordinates.
        * @return Body A anchor.
        **/
        public GetAnchorA(): Common.Math.b2Vec2;
        /**
        * Get the anchor point on bodyB in world coordinates.
        * @return Body B anchor.
        **/
        public GetAnchorB(): Common.Math.b2Vec2;
        /**
        * Gets the damping ratio.
        * @return Damping ratio.
        **/
        public GetDampingRatio(): number;
        /**
        * Gets the frequency.
        * @return Frequency.
        **/
        public GetFrequency(): number;
        /**
        * Gets the length of distance between the two bodies.
        * @return Length.
        **/
        public GetLength(): number;
        /**
        * Get the reaction force on body2 at the joint anchor in N.
        * @param inv_dt
        * @return Reaction force in N.
        **/
        public GetReactionForce(inv_dt: number): Common.Math.b2Vec2;
        /**
        * Get the reaction torque on body 2 in N.
        * @param inv_dt
        * @return Reaction torque in N.
        **/
        public GetReactionTorque(inv_dt: number): number;
        /**
        * Sets the damping ratio.
        * @param ratio New damping ratio.
        **/
        public SetDampingRatio(ratio: number): void;
        /**
        * Sets the frequency.
        * @param hz New frequency (hertz).
        **/
        public SetFrequency(hz: number): void;
        /**
        * Sets the length of distance between the two bodies.
        * @param length New length.
        **/
        public SetLength(length: number): void;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * Distance joint definition. This requires defining an anchor point on both bodies and the non-zero length of the distance joint. The definition uses local anchor points so that the initial configuration can violate the constraint slightly. This helps when saving and loading a game.
    * @warning Do not use a zero or short length.
    **/
    class b2DistanceJointDef extends b2JointDef {
        /**
        * The damping ratio. 0 = no damping, 1 = critical damping.
        **/
        public dampingRatio: number;
        /**
        * The mass-spring-damper frequency in Hertz.
        **/
        public frequencyHz: number;
        /**
        * The natural length between the anchor points.
        **/
        public length: number;
        /**
        * The local anchor point relative to body1's origin.
        **/
        public localAnchorA: Common.Math.b2Vec2;
        /**
        * The local anchor point relative to body2's origin.
        **/
        public localAnchorB: Common.Math.b2Vec2;
        /**
        * Constructor.
        **/
        constructor();
        /**
        * Initialize the bodies, anchors, and length using the world anchors.
        * @param bA Body A.
        * @param bB Body B.
        * @param anchorA Anchor A.
        * @param anchorB Anchor B.
        **/
        public Initialize(bA: b2Body, bB: b2Body, anchorA: Common.Math.b2Vec2, anchorB: Common.Math.b2Vec2): void;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * Friction joint. This is used for top-down friction. It provides 2D translational friction and angular friction.
    **/
    class b2FrictionJoint extends b2Joint {
        /**
        * Angular mass.
        **/
        public m_angularMass: number;
        /**
        * Linear mass.
        **/
        public m_linearMass: Common.Math.b2Mat22;
        /**
        * Get the anchor point on bodyA in world coordinates.
        * @return Body A anchor.
        **/
        public GetAnchorA(): Common.Math.b2Vec2;
        /**
        * Get the anchor point on bodyB in world coordinates.
        * @return Body B anchor.
        **/
        public GetAnchorB(): Common.Math.b2Vec2;
        /**
        * Gets the max force.
        * @return Max force.
        **/
        public GetMaxForce(): number;
        /**
        * Gets the max torque.
        * @return Max torque.
        **/
        public GetMaxTorque(): number;
        /**
        * Get the reaction force on body2 at the joint anchor in N.
        * @param inv_dt
        * @return Reaction force in N.
        **/
        public GetReactionForce(inv_dt: number): Common.Math.b2Vec2;
        /**
        * Get the reaction torque on body 2 in N.
        * @return Reaction torque in N.
        **/
        public GetReactionTorque(inv_dt: number): number;
        /**
        * Sets the max force.
        * @param force New max force.
        **/
        public SetMaxForce(force: number): void;
        /**
        * Sets the max torque.
        * @param torque New max torque.
        **/
        public SetMaxTorque(torque: number): void;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * Friction joint defintion.
    **/
    class b2FrictionJointDef extends b2JointDef {
        /**
        * The local anchor point relative to body1's origin.
        **/
        public localAnchorA: Common.Math.b2Vec2;
        /**
        * The local anchor point relative to body2's origin.
        **/
        public localAnchorB: Common.Math.b2Vec2;
        /**
        * The maximum force in N.
        **/
        public maxForce: number;
        /**
        * The maximum friction torque in N-m.
        **/
        public maxTorque: number;
        /**
        * Constructor.
        **/
        constructor();
        /**
        * Initialize the bodies, anchors, axis, and reference angle using the world anchor and world axis.
        * @param bA Body A.
        * @param bB Body B.
        * @param anchor World anchor.
        **/
        public Initialize(bA: b2Body, bB: b2Body, anchor: Common.Math.b2Vec2): void;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * A gear joint is used to connect two joints together. Either joint can be a revolute or prismatic joint. You specify a gear ratio to bind the motions together: coordinate1 + ratio coordinate2 = constant The ratio can be negative or positive. If one joint is a revolute joint and the other joint is a prismatic joint, then the ratio will have units of length or units of 1/length.
    * @warning The revolute and prismatic joints must be attached to fixed bodies (which must be body1 on those joints).
    **/
    class b2GearJoint extends b2Joint {
        /**
        * Get the anchor point on bodyA in world coordinates.
        * @return Body A anchor.
        **/
        public GetAnchorA(): Common.Math.b2Vec2;
        /**
        * Get the anchor point on bodyB in world coordinates.
        * @return Body B anchor.
        **/
        public GetAnchorB(): Common.Math.b2Vec2;
        /**
        * Get the gear ratio.
        * @return Gear ratio.
        **/
        public GetRatio(): number;
        /**
        * Get the reaction force on body2 at the joint anchor in N.
        * @param inv_dt
        * @return Reaction force in N.
        **/
        public GetReactionForce(inv_dt: number): Common.Math.b2Vec2;
        /**
        * Get the reaction torque on body 2 in N.
        * @param inv_dt
        * @return Reaction torque in N.
        **/
        public GetReactionTorque(inv_dt: number): number;
        /**
        * Set the gear ratio.
        * @param force New gear ratio.
        **/
        public SetRatio(ratio: number): void;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * Gear joint definition. This definition requires two existing revolute or prismatic joints (any combination will work). The provided joints must attach a dynamic body to a static body.
    **/
    class b2GearJointDef extends b2JointDef {
        /**
        * The first revolute/prismatic joint attached to the gear joint.
        **/
        public joint1: b2Joint;
        /**
        * The second revolute/prismatic joint attached to the gear joint.
        **/
        public joint2: b2Joint;
        /**
        * The gear ratio.
        **/
        public ratio: number;
        /**
        * Constructor.
        **/
        constructor();
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * A line joint. This joint provides one degree of freedom: translation along an axis fixed in body1. You can use a joint limit to restrict the range of motion and a joint motor to drive the motion or to model joint friction.
    **/
    class b2LineJoint extends b2Joint {
        /**
        * Enable/disable the joint limit.
        * @param flag True to enable, false to disable limits
        **/
        public EnableLimit(flag: boolean): void;
        /**
        * Enable/disable the joint motor.
        * @param flag True to enable, false to disable the motor.
        **/
        public EnableMotor(flag: boolean): void;
        /**
        * Get the anchor point on bodyA in world coordinates.
        * @return Body A anchor.
        **/
        public GetAnchorA(): Common.Math.b2Vec2;
        /**
        * Get the anchor point on bodyB in world coordinates.
        * @return Body B anchor.
        **/
        public GetAnchorB(): Common.Math.b2Vec2;
        /**
        * Get the current joint translation speed, usually in meters per second.
        * @return Joint speed.
        **/
        public GetJointSpeed(): number;
        /**
        * Get the current joint translation, usually in meters.
        * @return Joint translation.
        **/
        public GetJointTranslation(): number;
        /**
        * Get the lower joint limit, usually in meters.
        * @return Lower limit.
        **/
        public GetLowerLimit(): number;
        /**
        * Get the maximum motor force, usually in N.
        * @return Max motor force.
        **/
        public GetMaxMotorForce(): number;
        /**
        * Get the current motor force, usually in N.
        * @return Motor force.
        **/
        public GetMotorForce(): number;
        /**
        * Get the motor speed, usually in meters per second.
        * @return Motor speed.
        **/
        public GetMotorSpeed(): number;
        /**
        * Get the reaction force on body2 at the joint anchor in N.
        * @param inv_dt
        * @return Reaction force in N.
        **/
        public GetReactionForce(inv_dt: number): Common.Math.b2Vec2;
        /**
        * Get the reaction torque on body 2 in N.
        * @param inv_dt
        * @return Reaction torque in N.
        **/
        public GetReactionTorque(inv_dt: number): number;
        /**
        * Get the upper joint limit, usually in meters.
        * @return Upper limit.
        **/
        public GetUpperLimit(): number;
        /**
        * Is the joint limit enabled?
        * @return True if enabled otherwise false.
        **/
        public IsLimitEnabled(): boolean;
        /**
        * Is the joint motor enabled?
        * @return True if enabled, otherwise false.
        **/
        public IsMotorEnabled(): boolean;
        /**
        * Set the joint limits, usually in meters.
        * @param lower Lower limit.
        * @param upper Upper limit.
        **/
        public SetLimits(lower: number, upper: number): void;
        /**
        * Set the maximum motor force, usually in N.
        * @param force New max motor force.
        **/
        public SetMaxMotorForce(force: number): void;
        /**
        * Set the motor speed, usually in meters per second.
        * @param speed New motor speed.
        **/
        public SetMotorSpeed(speed: number): void;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * Line joint definition. This requires defining a line of motion using an axis and an anchor point. The definition uses local anchor points and a local axis so that the initial configuration can violate the constraint slightly. The joint translation is zero when the local anchor points coincide in world space. Using local anchors and a local axis helps when saving and loading a game.
    **/
    class b2LineJointDef extends b2JointDef {
        /**
        * Enable/disable the joint limit.
        **/
        public enableLimit: boolean;
        /**
        * Enable/disable the joint motor.
        **/
        public enableMotor: boolean;
        /**
        * The local anchor point relative to body1's origin.
        **/
        public localAnchorA: Common.Math.b2Vec2;
        /**
        * The local anchor point relative to body2's origin.
        **/
        public localAnchorB: Common.Math.b2Vec2;
        /**
        * The local translation axis in bodyA.
        **/
        public localAxisA: Common.Math.b2Vec2;
        /**
        * The lower translation limit, usually in meters.
        **/
        public lowerTranslation: number;
        /**
        * The maximum motor torque, usually in N-m.
        **/
        public maxMotorForce: number;
        /**
        * The desired motor speed in radians per second.
        **/
        public motorSpeed: number;
        /**
        * The upper translation limit, usually in meters.
        **/
        public upperTranslation: number;
        /**
        * Constructor.
        **/
        constructor();
        /**
        * Initialize the bodies, anchors, and length using the world anchors.
        * @param bA Body A.
        * @param bB Body B.
        * @param anchor Anchor.
        * @param axis Axis.
        **/
        public Initialize(bA: b2Body, bB: b2Body, anchor: Common.Math.b2Vec2, axis: Common.Math.b2Vec2): void;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * A mouse joint is used to make a point on a body track a specified world point. This a soft constraint with a maximum force. This allows the constraint to stretch and without applying huge forces. Note: this joint is not fully documented as it is intended primarily for the testbed. See that for more instructions.
    **/
    class b2MouseJoint extends b2Joint {
        /**
        * Get the anchor point on bodyA in world coordinates.
        * @return Body A anchor.
        **/
        public GetAnchorA(): Common.Math.b2Vec2;
        /**
        * Get the anchor point on bodyB in world coordinates.
        * @return Body B anchor.
        **/
        public GetAnchorB(): Common.Math.b2Vec2;
        /**
        * Gets the damping ratio.
        * @return Damping ratio.
        **/
        public GetDampingRatio(): number;
        /**
        * Gets the frequency.
        * @return Frequency.
        **/
        public GetFrequency(): number;
        /**
        * Gets the max force.
        * @return Max force.
        **/
        public GetMaxForce(): number;
        /**
        * Get the reaction force on body2 at the joint anchor in N.
        * @param inv_dt
        * @return Reaction force in N.
        **/
        public GetReactionForce(inv_dt: number): Common.Math.b2Vec2;
        /**
        * Get the reaction torque on body 2 in N.
        * @param inv_dt
        * @return Reaction torque in N.
        **/
        public GetReactionTorque(inv_dt: number): number;
        /**
        * Gets the target.
        * @return Target.
        **/
        public GetTarget(): Common.Math.b2Vec2;
        /**
        * Sets the damping ratio.
        * @param ratio New damping ratio.
        **/
        public SetDampingRatio(ratio: number): void;
        /**
        * Sets the frequency.
        * @param hz New frequency (hertz).
        **/
        public SetFrequency(hz: number): void;
        /**
        * Sets the max force.
        * @param maxForce New max force.
        **/
        public SetMaxForce(maxForce: number): void;
        /**
        * Use this to update the target point.
        * @param target New target.
        **/
        public SetTarget(target: Common.Math.b2Vec2): void;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * Mouse joint definition. This requires a world target point, tuning parameters, and the time step.
    **/
    class b2MouseJointDef extends b2JointDef {
        /**
        * The damping ratio. 0 = no damping, 1 = critical damping.
        **/
        public dampingRatio: number;
        /**
        * The response speed.
        **/
        public frequencyHz: number;
        /**
        * The maximum constraint force that can be exerted to move the candidate body.
        **/
        public maxForce: number;
        /**
        * Constructor.
        **/
        constructor();
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * A prismatic joint. This joint provides one degree of freedom: translation along an axis fixed in body1. Relative rotation is prevented. You can use a joint limit to restrict the range of motion and a joint motor to drive the motion or to model joint friction.
    **/
    class b2PrismaticJoint extends b2Joint {
        /**
        * Enable/disable the joint limit.
        * @param flag True to enable, false to disable.
        **/
        public EnableLimit(flag: boolean): void;
        /**
        * Enable/disable the joint motor.
        * @param flag True to enable, false to disable.
        **/
        public EnableMotor(flag: boolean): void;
        /**
        * Get the anchor point on bodyA in world coordinates.
        * @return Body A anchor.
        **/
        public GetAnchorA(): Common.Math.b2Vec2;
        /**
        * Get the anchor point on bodyB in world coordinates.
        * @return Body B anchor.
        **/
        public GetAnchorB(): Common.Math.b2Vec2;
        /**
        * Get the current joint translation speed, usually in meters per second.
        * @return Joint speed.
        **/
        public GetJointSpeed(): number;
        /**
        * Get the current joint translation, usually in meters.
        * @return Joint translation.
        **/
        public GetJointTranslation(): number;
        /**
        * Get the lower joint limit, usually in meters.
        * @return Lower limit.
        **/
        public GetLowerLimit(): number;
        /**
        * Get the current motor force, usually in N.
        * @return Motor force.
        **/
        public GetMotorForce(): number;
        /**
        * Get the motor speed, usually in meters per second.
        * @return Motor speed.
        **/
        public GetMotorSpeed(): number;
        /**
        * Get the reaction force on body2 at the joint anchor in N.
        * @param inv_dt
        * @return Reaction force in N.
        **/
        public GetReactionForce(inv_dt: number): Common.Math.b2Vec2;
        /**
        * Get the reaction torque on body 2 in N.
        * @param inv_dt
        * @return Reaction torque in N.
        **/
        public GetReactionTorque(inv_dt: number): number;
        /**
        * Get the upper joint limit, usually in meters.
        * @return Upper limit.
        **/
        public GetUpperLimit(): number;
        /**
        * Is the joint limit enabled?
        * @return True if enabled otherwise false.
        **/
        public IsLimitEnabled(): boolean;
        /**
        * Is the joint motor enabled?
        * @return True if enabled, otherwise false.
        **/
        public IsMotorEnabled(): boolean;
        /**
        * Set the joint limits, usually in meters.
        * @param lower Lower limit.
        * @param upper Upper limit.
        **/
        public SetLimits(lower: number, upper: number): void;
        /**
        * Set the maximum motor force, usually in N.
        * @param force New max force.
        **/
        public SetMaxMotorForce(force: number): void;
        /**
        * Set the motor speed, usually in meters per second.
        * @param speed New motor speed.
        **/
        public SetMotorSpeed(speed: number): void;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * Prismatic joint definition. This requires defining a line of motion using an axis and an anchor point. The definition uses local anchor points and a local axis so that the initial configuration can violate the constraint slightly. The joint translation is zero when the local anchor points coincide in world space. Using local anchors and a local axis helps when saving and loading a game.
    **/
    class b2PrismaticJointDef extends b2JointDef {
        /**
        * Enable/disable the joint limit.
        **/
        public enableLimit: boolean;
        /**
        * Enable/disable the joint motor.
        **/
        public enableMotor: boolean;
        /**
        * The local anchor point relative to body1's origin.
        **/
        public localAnchorA: Common.Math.b2Vec2;
        /**
        * The local anchor point relative to body2's origin.
        **/
        public localAnchorB: Common.Math.b2Vec2;
        /**
        * The local translation axis in body1.
        **/
        public localAxisA: Common.Math.b2Vec2;
        /**
        * The lower translation limit, usually in meters.
        **/
        public lowerTranslation: number;
        /**
        * The maximum motor torque, usually in N-m.
        **/
        public maxMotorForce: number;
        /**
        * The desired motor speed in radians per second.
        **/
        public motorSpeed: number;
        /**
        * The constrained angle between the bodies: bodyB_angle - bodyA_angle.
        **/
        public referenceAngle: number;
        /**
        * The upper translation limit, usually in meters.
        **/
        public upperTranslation: number;
        /**
        * Constructor.
        **/
        constructor();
        /**
        * Initialize the joint.
        * @param bA Body A.
        * @param bB Body B.
        * @param anchor Anchor.
        * @param axis Axis.
        **/
        public Initialize(bA: b2Body, bB: b2Body, anchor: Common.Math.b2Vec2, axis: Common.Math.b2Vec2): void;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * The pulley joint is connected to two bodies and two fixed ground points. The pulley supports a ratio such that: length1 + ratio length2 <= constant Yes, the force transmitted is scaled by the ratio. The pulley also enforces a maximum length limit on both sides. This is useful to prevent one side of the pulley hitting the top.
    **/
    class b2PullyJoint extends b2Joint {
        /**
        * Get the anchor point on bodyA in world coordinates.
        * @return Body A anchor.
        **/
        public GetAnchorA(): Common.Math.b2Vec2;
        /**
        * Get the anchor point on bodyB in world coordinates.
        * @return Body B anchor.
        **/
        public GetAnchorB(): Common.Math.b2Vec2;
        /**
        * Get the first ground anchor.
        **/
        public GetGroundAnchorA(): Common.Math.b2Vec2;
        /**
        * Get the second ground anchor.
        **/
        public GetGroundAnchorB(): Common.Math.b2Vec2;
        /**
        * Get the current length of the segment attached to body1.
        **/
        public GetLength1(): number;
        /**
        * Get the current length of the segment attached to body2.
        **/
        public GetLength2(): number;
        /**
        * Get the pulley ratio.
        **/
        public GetRatio(): number;
        /**
        * Get the reaction force on body2 at the joint anchor in N.
        * @param inv_dt
        * @return Reaction force in N.
        **/
        public GetReactionForce(inv_dt: number): Common.Math.b2Vec2;
        /**
        * Get the reaction torque on body 2 in N.
        * @param inv_dt
        * @return Reaction torque in N.
        **/
        public GetReactionTorque(inv_dt: number): number;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * Pulley joint definition. This requires two ground anchors, two dynamic body anchor points, max lengths for each side, and a pulley ratio.
    **/
    class b2PullyJointDef extends b2JointDef {
        /**
        * The first ground anchor in world coordinates. This point never moves.
        **/
        public groundAnchorA: Common.Math.b2Vec2;
        /**
        * The second ground anchor in world coordinates. This point never moves.
        **/
        public groundAnchorB: Common.Math.b2Vec2;
        /**
        * The a reference length for the segment attached to bodyA.
        **/
        public lengthA: number;
        /**
        * The a reference length for the segment attached to bodyB.
        **/
        public lengthB: number;
        /**
        * The local anchor point relative to body1's origin.
        **/
        public localAnchorA: Common.Math.b2Vec2;
        /**
        * The local anchor point relative to body2's origin.
        **/
        public localAnchorB: Common.Math.b2Vec2;
        /**
        * The maximum length of the segment attached to bodyA.
        **/
        public maxLengthA: number;
        /**
        * The maximum length of the segment attached to bodyB.
        **/
        public maxLengthB: number;
        /**
        * The pulley ratio, used to simulate a block-and-tackle.
        **/
        public ratio: number;
        /**
        * Constructor.
        **/
        constructor();
        /**
        * Initialize the bodies, anchors, and length using the world anchors.
        * @param bA Body A.
        * @param bB Body B.
        * @param gaA Ground anchor A.
        * @param gaB Ground anchor B.
        * @param anchorA Anchor A.
        * @param anchorB Anchor B.
        **/
        public Initialize(bA: b2Body, bB: b2Body, gaA: Common.Math.b2Vec2, gaB: Common.Math.b2Vec2, anchorA: Common.Math.b2Vec2, anchorB: Common.Math.b2Vec2): void;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * A revolute joint constrains to bodies to share a common point while they are free to rotate about the point. The relative rotation about the shared point is the joint angle. You can limit the relative rotation with a joint limit that specifies a lower and upper angle. You can use a motor to drive the relative rotation about the shared point. A maximum motor torque is provided so that infinite forces are not generated.
    **/
    class b2RevoluteJoint extends b2Joint {
        /**
        * Enable/disable the joint limit.
        * @param flag True to enable, false to disable.
        **/
        public EnableLimit(flag: boolean): void;
        /**
        * Enable/disable the joint motor.
        * @param flag True to enable, false to diasable.
        **/
        public EnableMotor(flag: boolean): void;
        /**
        * Get the anchor point on bodyA in world coordinates.
        * @return Body A anchor.
        **/
        public GetAnchorA(): Common.Math.b2Vec2;
        /**
        * Get the anchor point on bodyB in world coordinates.
        * @return Body B anchor.
        **/
        public GetAnchorB(): Common.Math.b2Vec2;
        /**
        * Get the current joint angle in radians.
        * @return Joint angle.
        **/
        public GetJointAngle(): number;
        /**
        * Get the current joint angle speed in radians per second.
        * @return Joint speed.
        **/
        public GetJointSpeed(): number;
        /**
        * Get the lower joint limit in radians.
        * @return Lower limit.
        **/
        public GetLowerLimit(): number;
        /**
        * Get the motor speed in radians per second.
        * @return Motor speed.
        **/
        public GetMotorSpeed(): number;
        /**
        * Get the current motor torque, usually in N-m.
        * @return Motor torque.
        **/
        public GetMotorTorque(): number;
        /**
        * Get the reaction force on body2 at the joint anchor in N.
        * @param inv_dt
        * @return Reaction force in N.
        **/
        public GetReactionForce(inv_dt: number): Common.Math.b2Vec2;
        /**
        * Get the reaction torque on body 2 in N.
        * @param inv_dt
        * @return Reaction torque in N.
        **/
        public GetReactionTorque(inv_dt: number): number;
        /**
        * Get the upper joint limit in radians.
        * @return Upper limit.
        **/
        public GetUpperLimit(): number;
        /**
        * Is the joint limit enabled?
        * @return True if enabled, false if disabled.
        **/
        public IsLimitEnabled(): boolean;
        /**
        * Is the joint motor enabled?
        * @return True if enabled, false if disabled.
        **/
        public IsMotorEnabled(): boolean;
        /**
        * Set the joint limits in radians.
        * @param lower New lower limit.
        * @param upper New upper limit.
        **/
        public SetLimits(lower: number, upper: number): void;
        /**
        * Set the maximum motor torque, usually in N-m.
        * @param torque New max torque.
        **/
        public SetMaxMotorTorque(torque: number): void;
        /**
        * Set the motor speed in radians per second.
        * @param speed New motor speed.
        **/
        public SetMotorSpeed(speed: number): any;
        public void: any;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * Revolute joint definition. This requires defining an anchor point where the bodies are joined. The definition uses local anchor points so that the initial configuration can violate the constraint slightly. You also need to specify the initial relative angle for joint limits. This helps when saving and loading a game. The local anchor points are measured from the body's origin rather than the center of mass because: 1. you might not know where the center of mass will be. 2. if you add/remove shapes from a body and recompute the mass, the joints will be broken.
    **/
    class b2RevoluteJointDef extends b2JointDef {
        /**
        * A flag to enable joint limits.
        **/
        public enableLimit: boolean;
        /**
        * A flag to enable the joint motor.
        **/
        public enableMotor: boolean;
        /**
        * The local anchor point relative to body1's origin.
        **/
        public localAnchorA: Common.Math.b2Vec2;
        /**
        * The local anchor point relative to body2's origin.
        **/
        public localAnchorB: Common.Math.b2Vec2;
        /**
        * The lower angle for the joint limit (radians).
        **/
        public lowerAngle: number;
        /**
        * The maximum motor torque used to achieve the desired motor speed. Usually in N-m.
        **/
        public maxMotorTorque: number;
        /**
        * The desired motor speed. Usually in radians per second.
        **/
        public motorSpeed: number;
        /**
        * The bodyB angle minus bodyA angle in the reference state (radians).
        **/
        public referenceAngle: number;
        /**
        * The upper angle for the joint limit (radians).
        **/
        public upperAngle: number;
        /**
        * Constructor.
        **/
        constructor();
        /**
        * Initialize the bodies, achors, and reference angle using the world anchor.
        * @param bA Body A.
        * @param bB Body B.
        * @param anchor Anchor.
        **/
        public Initialize(bA: b2Body, bB: b2Body, anchor: Common.Math.b2Vec2): void;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * A weld joint essentially glues two bodies together. A weld joint may distort somewhat because the island constraint solver is approximate.
    **/
    class b2WeldJoint extends b2Joint {
        /**
        * Get the anchor point on bodyA in world coordinates.
        * @return Body A anchor.
        **/
        public GetAnchorA(): Common.Math.b2Vec2;
        /**
        * Get the anchor point on bodyB in world coordinates.
        * @return Body B anchor.
        **/
        public GetAnchorB(): Common.Math.b2Vec2;
        /**
        * Get the reaction force on body2 at the joint anchor in N.
        * @param inv_dt
        * @return Reaction force in N.
        **/
        public GetReactionForce(inv_dt: number): Common.Math.b2Vec2;
        /**
        * Get the reaction torque on body 2 in N.
        * @param inv_dt
        * @return Reaction torque in N.
        **/
        public GetReactionTorque(inv_dt: number): number;
    }
}
declare module Box2D.Dynamics.Joints {
    /**
    * Weld joint definition. You need to specify local anchor points where they are attached and the relative body angle. The position of the anchor points is important for computing the reaction torque.
    **/
    class b2WeldJointDef extends b2JointDef {
        /**
        * The local anchor point relative to body1's origin.
        **/
        public localAnchorA: Common.Math.b2Vec2;
        /**
        * The local anchor point relative to body2's origin.
        **/
        public localAnchorB: Common.Math.b2Vec2;
        /**
        * The body2 angle minus body1 angle in the reference state (radians).
        **/
        public referenceAngle: number;
        /**
        * Constructor.
        **/
        constructor();
        /**
        * Initialize the bodies, anchors, axis, and reference angle using the world anchor and world axis.
        * @param bA Body A.
        * @param bB Body B.
        * @param anchor Anchor.
        **/
        public Initialize(bA: b2Body, bB: b2Body, anchor: Common.Math.b2Vec2): void;
    }
}
declare module Vapor {
    /**
    * Represents a collider for use with the Box2D physics engine.
    * The base class for all Collider objects.
    */
    class Collider extends Component {
        /**
        * The rigid body attached to the Collider's GameObject.
        */
        public attachedRigidbody: RigidBody;
        /**
        * True if the body associated with this Collider is used as a Box2D sensor.
        * Defaults to false.
        */
        public isSensor: boolean;
        /**
        * The FixtureDef that was used to create this collider.
        * [protected]
        */
        public fixtureDef: Box2D.Dynamics.b2FixtureDef;
        /**
        * The FixtureDef that was used to create this collider.
        */
        public FixtureDefinition : Box2D.Dynamics.b2FixtureDef;
        /**
        * The actual Fixture that this collider represents.
        * [protected]
        */
        public fixture: Box2D.Dynamics.b2Fixture;
        public Start(): void;
    }
}
declare module Vapor {
    /**
    * Represents a collider that is a box shape.
    */
    class BoxCollider extends Collider {
        public center: Vector2;
        public size: Vector2;
        public Awake(): void;
        public Start(): void;
        public Update(): void;
    }
}
declare module Vapor {
    /**
    *
    */
    class CircleCollider extends Collider {
        /**
        * Does nothing since there is no way to set the center point of a Circle fixture.
        * I belive this is a bug with the Dart port of Box2D.
        */
        public center: Vector2;
        public radius: number;
        constructor(radius?: number);
        public Awake(): void;
        public Start(): void;
        public Update(): void;
    }
}
declare module Vapor {
    /**
    *
    */
    class RevoluteJoint extends Component {
        public radius: number;
        public jointDef: Box2D.Dynamics.Joints.b2RevoluteJointDef;
        public enableMotor: boolean;
        /**
        * The other RigidBody object that the one with the joint is connected to. If this is null then the othen end of the joint will be fixed at a point in space.
        */
        public connectedRigidBody: RigidBody;
        /**
        * Coordinate in local space where the end point of the joint is attached.
        */
        public anchor: Vector2;
        private revoluteJoint;
        public Awake(): void;
        public Start(): void;
    }
}
declare module Vapor {
    /**
    * A body type enum. There are three types of bodies.
    *
    * Static: Have zero mass, zero velocity and can be moved manually.
    *
    * Kinematic: Have zero mass, a non-zero velocity set by user, and are moved by
    *   the physics solver.
    *
    * Dynamic: Have positive mass, non-zero velocity determined by forces, and is
    *   moved by the physics solver.
    */
    enum BodyType {
        Static = 0,
        Kinematic = 1,
        Dynamic = 2,
    }
    /**
    * Represents a Rigid Body for use with the Box2D physics engine.
    */
    class RigidBody extends Component {
        /**
        * The backing Box2D Body object that this RigidBody represents.
        */
        public body: Box2D.Dynamics.b2Body;
        /**
        * The type of body (Dynamic, Static, or Kinematic) associated with this Collider.
        * Defaults to Dynamic.
        * The types are defined in Box2D.BodyType.
        */
        private bodyType;
        /**
        * The Box2D.BodyDef that was used to create this Rigid Body.
        */
        private bodyDef;
        /**
        * The Box2D.BodyDef that was used to create this Rigid Body.
        */
        public BodyDefinition : Box2D.Dynamics.b2BodyDef;
        /**
        * Constructs a new RigidBody using the given body type.  Defaults to Box2D.BodyType.DYNAMIC.
        */
        constructor(bodyType?: BodyType);
        public Awake(): void;
        public Start(): void;
    }
}
interface Array<T> {
    /**
    * Adds the given item to the end of the array.
    */
    add(item: T): any;
    /**
    * Clears the array.
    */
    clear(): any;
    /**
    * Creates a copy of the array.
    */
    clone(): T[];
    /**
    * Removes the given item from the array.
    */
    remove(item: T): any;
    /**
    * Removes the item at the given index from the array.
    */
    removeAt(index: number): any;
}
declare module Vapor {
    class FileDownloader {
        /**
        * Download the file at the given URL.  It ONLY downloads asynchronously.
        * (Modern browsers are deprecating synchronous requests, and now throw exceptions when trying to do a sychronous request with a responseType)
        * The callback is called after the file is done loading.
        * The callback is in the form: Callback(request: XMLHttpRequest): void
        */
        static Download(url: string, callback: (request: XMLHttpRequest) => any, responseType?: string): XMLHttpRequest;
        /**
        * Download the file at the given URL as an ArrayBuffer (useful for Audio).
        */
        static DownloadArrayBuffer(url: string, callback: (request: XMLHttpRequest) => any): XMLHttpRequest;
        /**
        * Download the file at the given URL as a Blob (useful for Images).
        */
        static DownloadBlob(url: string, callback: (request: XMLHttpRequest) => any): XMLHttpRequest;
        /**
        * Download the file at the given URL as a Document (useful for XML and HTML).
        */
        static DownloadDocument(url: string, callback: (request: XMLHttpRequest) => any): XMLHttpRequest;
        /**
        * Download the file at the given URL as a JavaScript object parsed from the JSON string returned by the server.
        */
        static DownloadJSON(url: string, callback: (request: XMLHttpRequest) => any): XMLHttpRequest;
        /**
        * Download the file at the given URL in a synchronous (blocking) manner.
        */
        static DownloadSynchronous(url: string): XMLHttpRequest;
    }
}
declare class List<T> {
    private data;
    constructor();
    public Add(item: T): void;
    public Remove(item: T): void;
    public RemoveAt(index: number): void;
    public Clear(): void;
    public Get(index: number): T;
    [n: number]: T;
}
declare module Vapor {
    /**
    * A static class offering access to time related fields.
    * @class Represents a Mesh
    */
    class Time {
        /**
        * The amount of time that has passed since the last frame, in seconds.
        */
        static deltaTime: number;
        /**
        * The time of the previous frame, in milliseconds.
        */
        private static previousTime;
        /**
        * @private
        */
        static Update(): void;
    }
}
/**
* The global handle to the current instance of the WebGL rendering context.
*/ 
declare var gl: WebGLRenderingContext;
