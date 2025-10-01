# Local LLM Setup Guide

## 🆓 Completely Free AI - No API Costs!

This guide shows you how to run the Travel AI Agent with **completely free local LLMs** - no API costs, no external dependencies, complete privacy!

## 🎯 Why Local LLMs?

- **100% Free**: No API costs, no usage limits
- **Complete Privacy**: All processing happens on your device
- **No Internet Required**: Works offline after setup
- **No Rate Limits**: Use as much as you want
- **Your Data Stays Local**: Nothing sent to external services

## 🚀 Quick Setup

### Option 1: Ollama (Recommended)

#### Install Ollama
```bash
# Windows (PowerShell)
winget install Ollama.Ollama

# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh
```

#### Download Free Models
```bash
# Llama 2 (7B parameters) - Good balance of speed and quality
ollama pull llama2

# Mistral (7B parameters) - Fast and efficient
ollama pull mistral

# Code Llama (7B parameters) - Good for technical tasks
ollama pull codellama

# Llama 2 (13B parameters) - Better quality, needs more RAM
ollama pull llama2:13b
```

#### Configure the Agent
```bash
# Set environment variables
export USE_LOCAL_LLM=true
export OLLAMA_MODEL=llama2

# Or edit your .env file
USE_LOCAL_LLM=true
OLLAMA_MODEL=llama2
```

### Option 2: GPT4All

#### Install GPT4All
```bash
pip install gpt4all
```

#### Download Models
```python
from gpt4all import GPT4All

# Download a model (this will take a while)
model = GPT4All("orca-mini-3b-gguf2-q4_0.gguf")
```

## 🔧 System Requirements

### Minimum Requirements
- **RAM**: 8GB (for 7B models)
- **Storage**: 4GB free space
- **CPU**: Any modern processor

### Recommended Requirements
- **RAM**: 16GB+ (for 13B+ models)
- **Storage**: 10GB+ free space
- **GPU**: NVIDIA GPU with 8GB+ VRAM (optional, for faster inference)

## 📊 Model Comparison

| Model | Size | RAM Required | Quality | Speed |
|-------|------|--------------|---------|-------|
| **Llama 2 7B** | 4GB | 8GB | Good | Fast |
| **Mistral 7B** | 4GB | 8GB | Good | Very Fast |
| **Code Llama 7B** | 4GB | 8GB | Good | Fast |
| **Llama 2 13B** | 8GB | 16GB | Better | Slower |
| **Llama 2 70B** | 40GB | 80GB | Best | Slowest |

## 🚀 Running with Local LLM

### Start Ollama Service
```bash
# Start Ollama service
ollama serve
```

### Run the Travel Agent
```bash
# Make sure local LLM is enabled
export USE_LOCAL_LLM=true
export OLLAMA_MODEL=llama2

# Run the agent
python main.py
```

### Test Local LLM
```bash
# Test if local LLM is working
python main.py --test-apis
```

## 🔧 Troubleshooting

### Common Issues

#### 1. "Model not found" Error
```bash
# List available models
ollama list

# Pull the model if not available
ollama pull llama2
```

#### 2. "Out of memory" Error
- Use a smaller model (7B instead of 13B)
- Close other applications
- Add more RAM to your system

#### 3. "Ollama not installed" Error
```bash
# Install Ollama
# Windows: winget install Ollama.Ollama
# macOS: brew install ollama
# Linux: curl -fsSL https://ollama.ai/install.sh | sh
```

#### 4. Slow Performance
- Use a smaller model
- Enable GPU acceleration (if available)
- Close other applications

### Performance Tips

#### 1. GPU Acceleration (Optional)
```bash
# Install CUDA version of Ollama for NVIDIA GPUs
# This will make inference much faster
```

#### 2. Model Selection
- **For speed**: Use Mistral 7B
- **For quality**: Use Llama 2 13B
- **For balance**: Use Llama 2 7B

#### 3. System Optimization
- Close unnecessary applications
- Use SSD storage for faster model loading
- Ensure adequate cooling for sustained performance

## 🆚 Local LLM vs OpenAI

| Feature | Local LLM | OpenAI |
|---------|-----------|---------|
| **Cost** | 100% Free | $5 free, then paid |
| **Privacy** | Complete | Data sent to OpenAI |
| **Internet** | Not required | Required |
| **Rate Limits** | None | Yes |
| **Speed** | Depends on hardware | Fast |
| **Quality** | Good to excellent | Excellent |
| **Setup** | One-time download | Just API key |

## 🎯 Recommended Setup

For most users, I recommend:

1. **Start with Llama 2 7B**: Good balance of quality and speed
2. **8GB+ RAM**: Ensures smooth operation
3. **Ollama**: Easiest to set up and use
4. **SSD Storage**: Faster model loading

## 🚀 Advanced Usage

### Custom Models
```bash
# Pull other models
ollama pull mistral
ollama pull codellama
ollama pull llama2:13b

# Switch models
export OLLAMA_MODEL=mistral
```

### Model Management
```bash
# List installed models
ollama list

# Remove unused models
ollama rm model_name

# Update models
ollama pull llama2  # Re-downloads if newer version available
```

## 📝 Example Usage

```bash
# Set up local LLM
export USE_LOCAL_LLM=true
export OLLAMA_MODEL=llama2

# Run the agent
python main.py

# Chat with the agent
You: What's the weather like in Paris?
Agent: I'll check the weather in Paris for you using local processing...

You: Plan a trip to Tokyo
Agent: I'll help you plan a trip to Tokyo using local AI...
```

## 🎉 Benefits of Local LLM

1. **Complete Privacy**: Your conversations never leave your device
2. **No Costs**: Use as much as you want without any charges
3. **No Internet Required**: Works offline after initial setup
4. **No Rate Limits**: No API quotas or usage restrictions
5. **Your Data**: Complete control over your data and conversations
6. **Customizable**: Use different models for different needs

---

**Local LLMs give you the power of AI with complete privacy and zero costs!** 🚀
