"""
Setup script for Travel AI Agent.
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="travel-ai-agent",
    version="1.0.0",
    author="Travel AI Agent Team",
    author_email="",
    description="Privacy-first travel AI agent with free APIs only",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/travel-ai-agent",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.9",
    install_requires=[
        "langchain==0.1.0",
        "langchain-openai==0.0.2",
        "langchain-community==0.0.10",
        "openai==1.6.1",
        "fastapi==0.104.1",
        "uvicorn==0.24.0",
        "pydantic==2.5.0",
        "aiohttp==3.9.1",
        "requests==2.31.0",
        "cryptography==41.0.8",
        "bcrypt==4.1.2",
        "pandas==2.1.4",
        "numpy==1.25.2",
        "beautifulsoup4==4.12.2",
        "lxml==4.9.3",
        "python-dotenv==1.0.0",
        "python-dateutil==2.8.2",
        "pytz==2023.3",
    ],
    extras_require={
        "dev": [
            "pytest==7.4.3",
            "pytest-asyncio==0.21.1",
            "black==23.11.0",
            "flake8==6.1.0",
            "mypy==1.7.1",
        ],
        "local": [
            "ollama==0.1.7",
        ],
    },
    entry_points={
        "console_scripts": [
            "travel-agent=main:main",
        ],
    },
)
