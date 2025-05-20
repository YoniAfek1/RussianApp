import sys
import whisper
import torch

def transcribe_audio(audio_path):
    # Check if CUDA is available
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    # Load the Whisper model
    model = whisper.load_model("base", device=device)
    
    # Transcribe the audio
    result = model.transcribe(audio_path, language="ru")
    
    # Print the transcription
    print(result["text"])

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python transcribe.py <audio_file_path>")
        sys.exit(1)
    
    audio_path = sys.argv[1]
    transcribe_audio(audio_path) 