from transformers import MarianMTModel, MarianTokenizer
import torch

# Global model and tokenizer instances
tokenizer = None
model = None

def load_model():
    """Load the model and tokenizer once."""
    global tokenizer, model
    if tokenizer is None or model is None:
        print("Loading translation model...")
        tokenizer = MarianTokenizer.from_pretrained("Helsinki-NLP/opus-mt-ru-he")
        model = MarianMTModel.from_pretrained("Helsinki-NLP/opus-mt-ru-he")
        print("Model loaded successfully!")

def translate_russian_to_hebrew(text: str) -> str:
    """Translate Russian text to Hebrew using the loaded model."""
    if tokenizer is None or model is None:
        load_model()
    
    try:
        # Tokenize and translate
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        translated = model.generate(**inputs)
        return tokenizer.decode(translated[0], skip_special_tokens=True)
    except Exception as e:
        print(f"Translation error: {str(e)}")
        return "⚠️ Translation error" 