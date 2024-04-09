import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from "@react-native-voice/voice";
import { useCallback, useEffect, useState } from "react";

type IState = {
  recognized: string;
  pitch: string;
  error: string;
  end: string;
  started: string;
  results: string[];
  partialResults: string[];
  isRecording: boolean;
};

export const useVoiceRecognition = () => {
  const [state, setState] = useState<IState>({
    recognized: "",
    pitch: "",
    error: "",
    end: "",
    started: "",
    results: [],
    partialResults: [],
    isRecording: false,
  });

  const resetState = useCallback(() => {
    setState({
      recognized: "",
      pitch: "",
      error: "",
      end: "",
      started: "",
      results: [],
      partialResults: [],
      isRecording: false,
    });
  }, [setState]);

  const startRecognizer = useCallback(async () => {
    resetState();
    try {
      await Voice.start("en-US");
    } catch (e) {
      console.log(e);
    }
  }, [resetState]);

  const stopRecognizer = useCallback(async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.log(e);
    }
  }, [resetState]);

  const cancelRecognizer = useCallback(async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.log(e);
    }
  }, [resetState]);

  const destroyRecognizer = useCallback(async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.log(e);
    }
    resetState();
  }, [resetState]);

  useEffect(() => {
    Voice.onSpeechStart = (e: any) => {
      setState((prevState) => ({
        ...prevState,
        started: "Yes",
        isRecording: true,
      }));
    };

    Voice.onSpeechRecognized = () => {
      setState((prevState) => ({ ...prevState, recognized: "Yes" }));
    };

    Voice.onSpeechEnd = () => {
      setState((prevState) => ({
        ...prevState,
        end: "True",
        isRecording: false,
      }));
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setState((prevState) => ({
        ...prevState,
        error: JSON.stringify(e.error),
        isRecording: false,
      }));
    };

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value) {
        setState((prevState) => ({ ...prevState, results: e.value! }));
      }
    };
    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      if (e.value) {
        setState((prevState) => ({ ...prevState, partialResults: e.value! }));
      }
    };

    Voice.onSpeechVolumeChanged = (e: any) => {
      setState((prevState) => ({ ...prevState, pitch: e.value! }));
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return {
    state,
    setState,
    resetState,
    startRecognizer,
    stopRecognizer,
    cancelRecognizer,
    destroyRecognizer,
  };
};
