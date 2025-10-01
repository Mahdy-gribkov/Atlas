#!/usr/bin/env python3
"""
Local LLM Setup Script for Travel AI Agent
Helps users set up completely free local LLMs.
"""

import subprocess
import sys
import os
import platform

def run_command(command, description):
    """Run a command and handle errors."""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def check_ollama_installed():
    """Check if Ollama is installed."""
    try:
        result = subprocess.run("ollama --version", shell=True, capture_output=True, text=True)
        return result.returncode == 0
    except:
        return False

def install_ollama():
    """Install Ollama based on the operating system."""
    system = platform.system().lower()
    
    print(f"🖥️ Detected operating system: {system}")
    
    if system == "windows":
        print("📦 Installing Ollama on Windows...")
        print("Please run this command in PowerShell as Administrator:")
        print("winget install Ollama.Ollama")
        print("\nOr download from: https://ollama.ai/download")
        return False
    
    elif system == "darwin":  # macOS
        print("📦 Installing Ollama on macOS...")
        return run_command("brew install ollama", "Installing Ollama via Homebrew")
    
    elif system == "linux":
        print("📦 Installing Ollama on Linux...")
        return run_command("curl -fsSL https://ollama.ai/install.sh | sh", "Installing Ollama")
    
    else:
        print(f"❌ Unsupported operating system: {system}")
        print("Please install Ollama manually from: https://ollama.ai/download")
        return False

def download_models():
    """Download recommended models."""
    models = [
        ("llama2", "Llama 2 7B - Good balance of quality and speed"),
        ("mistral", "Mistral 7B - Fast and efficient"),
        ("codellama", "Code Llama 7B - Good for technical tasks")
    ]
    
    print("\n📥 Downloading recommended models...")
    print("This may take a while depending on your internet connection.")
    
    for model, description in models:
        print(f"\n🔄 Downloading {model} ({description})...")
        if run_command(f"ollama pull {model}", f"Downloading {model}"):
            print(f"✅ {model} downloaded successfully")
        else:
            print(f"❌ Failed to download {model}")
    
    print("\n📋 Available models:")
    run_command("ollama list", "Listing installed models")

def setup_environment():
    """Set up environment variables for local LLM."""
    env_file = ".env"
    
    print(f"\n⚙️ Setting up environment variables...")
    
    # Read existing .env file or create new one
    env_content = []
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            env_content = f.readlines()
    
    # Update or add local LLM settings
    updated = False
    for i, line in enumerate(env_content):
        if line.startswith("USE_LOCAL_LLM="):
            env_content[i] = "USE_LOCAL_LLM=true\n"
            updated = True
        elif line.startswith("OLLAMA_MODEL="):
            env_content[i] = "OLLAMA_MODEL=llama2\n"
            updated = True
    
    if not updated:
        env_content.extend([
            "\n# Local LLM Settings\n",
            "USE_LOCAL_LLM=true\n",
            "OLLAMA_MODEL=llama2\n"
        ])
    
    # Write updated .env file
    with open(env_file, 'w') as f:
        f.writelines(env_content)
    
    print(f"✅ Environment variables configured in {env_file}")

def test_setup():
    """Test the local LLM setup."""
    print("\n🧪 Testing local LLM setup...")
    
    # Test if Ollama is running
    if run_command("ollama list", "Testing Ollama connection"):
        print("✅ Ollama is working correctly")
        
        # Test a simple model
        print("🔄 Testing model generation...")
        test_prompt = "Hello, this is a test. Please respond with 'Local LLM is working!'"
        
        try:
            result = subprocess.run(
                f'ollama run llama2 "{test_prompt}"',
                shell=True,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                print("✅ Model generation test successful")
                print(f"Response: {result.stdout.strip()}")
            else:
                print("❌ Model generation test failed")
                print(f"Error: {result.stderr}")
        
        except subprocess.TimeoutExpired:
            print("⏰ Model generation test timed out (this is normal for first run)")
        except Exception as e:
            print(f"❌ Model generation test failed: {e}")
    else:
        print("❌ Ollama is not working correctly")

def main():
    """Main setup function."""
    print("🌍 Travel AI Agent - Local LLM Setup")
    print("=" * 50)
    print("This script will help you set up completely free local LLMs.")
    print("No API costs, complete privacy, works offline!")
    print("=" * 50)
    
    # Check if Ollama is installed
    if not check_ollama_installed():
        print("❌ Ollama is not installed")
        
        response = input("\nWould you like to install Ollama? (y/n): ").lower().strip()
        if response == 'y':
            if not install_ollama():
                print("\n📋 Manual installation required.")
                print("Please install Ollama from: https://ollama.ai/download")
                print("Then run this script again.")
                return
        else:
            print("❌ Ollama is required for local LLM functionality")
            return
    else:
        print("✅ Ollama is already installed")
    
    # Download models
    response = input("\nWould you like to download recommended models? (y/n): ").lower().strip()
    if response == 'y':
        download_models()
    else:
        print("⏭️ Skipping model download")
        print("You can download models later with: ollama pull <model_name>")
    
    # Set up environment
    setup_environment()
    
    # Test setup
    response = input("\nWould you like to test the setup? (y/n): ").lower().strip()
    if response == 'y':
        test_setup()
    
    print("\n🎉 Local LLM setup complete!")
    print("\nNext steps:")
    print("1. Start Ollama service: ollama serve")
    print("2. Run the travel agent: python main.py")
    print("3. Enjoy completely free AI with complete privacy!")
    
    print("\n📚 Available models:")
    print("- llama2: Good balance of quality and speed")
    print("- mistral: Fast and efficient")
    print("- codellama: Good for technical tasks")
    
    print("\n🔧 Useful commands:")
    print("- ollama list: List installed models")
    print("- ollama pull <model>: Download a model")
    print("- ollama run <model>: Test a model")
    print("- ollama serve: Start Ollama service")

if __name__ == "__main__":
    main()
