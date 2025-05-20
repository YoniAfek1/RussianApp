import sys
import torch
import torchaudio
import os

def transcribe_audio(audio_path):
    try:
        # Load Silero model
        print("[Python] Loading Silero model...")
        model, decoder, utils = torch.hub.load(
            repo_or_dir='snakers4/silero-models',
            model='silero_stt',
            language='ru',
            device='cpu'
        )
        (read_batch, split_into_batches, read_audio, prepare_model_input) = utils
        print("[Python] Model loaded successfully")

        # Load and prepare audio
        print(f"[Python] Loading audio from: {audio_path}")
        waveform, sample_rate = torchaudio.load(audio_path)
        print(f"[Python] Audio loaded - Sample rate: {sample_rate}Hz, Channels: {waveform.shape[0]}, Length: {waveform.shape[1]} samples")
        
        # Ensure audio is mono
        if waveform.shape[0] > 1:
            print("[Python] Converting stereo to mono")
            waveform = torch.mean(waveform, dim=0, keepdim=True)
        
        # Resample if necessary
        if sample_rate != 16000:
            print(f"[Python] Resampling from {sample_rate}Hz to 16000Hz")
            resampler = torchaudio.transforms.Resample(sample_rate, 16000)
            waveform = resampler(waveform)
            sample_rate = 16000

        # Prepare input for model
        print("[Python] Preparing audio for transcription")
        batch = prepare_model_input([waveform], model.model.sample_rate)
        
        # Transcribe
        print("[Python] Running transcription")
        with torch.no_grad():
            output = model(batch)
            text = decoder(output[0].cpu())
        
        print(f"[Python] Transcription complete: {text}")
        return text

    except Exception as e:
        print(f"[Python] Error during transcription: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python transcribe.py <audio_file_path>", file=sys.stderr)
        sys.exit(1)

    audio_path = sys.argv[1]
    if not os.path.exists(audio_path):
        print(f"Error: Audio file not found at {audio_path}", file=sys.stderr)
        sys.exit(1)

    result = transcribe_audio(audio_path)
    print(result) 