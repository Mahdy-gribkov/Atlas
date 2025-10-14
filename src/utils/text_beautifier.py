"""
Text Beautification Service for LLM Responses
Cleans and structures text responses for better readability
"""

import re
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class TextBeautifier:
    """Service to beautify and structure LLM responses."""
    
    def __init__(self):
        self.section_keywords = [
            'introduction', 'overview', 'summary',
            'best time', 'when to visit', 'season',
            'must-visit', 'attractions', 'destinations', 'places to see',
            'activities', 'things to do', 'experiences',
            'accommodation', 'hotels', 'where to stay',
            'transportation', 'getting around', 'how to get there',
            'food', 'dining', 'restaurants', 'cuisine',
            'budget', 'cost', 'prices', 'expenses',
            'tips', 'advice', 'recommendations',
            'next steps', 'planning', 'itinerary'
        ]
    
    def beautify_response(self, text: str) -> str:
        """
        Beautify and structure a text response.
        
        Args:
            text: Raw text response from LLM
            
        Returns:
            Beautified and structured text
        """
        if not text:
            return text
            
        try:
            # Step 1: Clean up the text
            cleaned_text = self._clean_text(text)
            
            # Step 2: Structure the content
            structured_text = self._structure_content(cleaned_text)
            
            # Step 3: Add visual formatting
            formatted_text = self._add_visual_formatting(structured_text)
            
            return formatted_text
            
        except Exception as e:
            logger.error(f"Text beautification failed: {e}")
            return text
    
    def _clean_text(self, text: str) -> str:
        """Clean up the text by removing unwanted formatting."""
        # Remove HTML tags more aggressively
        text = re.sub(r'<[^>]*>', '', text)
        
        # Remove markdown formatting
        text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)  # Remove **bold**
        text = re.sub(r'\*(.*?)\*', r'\1', text)      # Remove *italic*
        
        # Remove HTML entities
        text = text.replace('&nbsp;', ' ')
        text = text.replace('&bull;', '•')
        text = text.replace('&amp;', '&')
        text = text.replace('&lt;', '<')
        text = text.replace('&gt;', '>')
        
        # Clean up multiple spaces and newlines
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'\n\s*\n', '\n\n', text)
        
        # Remove any remaining HTML-like patterns
        text = re.sub(r'<[^>]*>', '', text)
        
        return text.strip()
    
    def _structure_content(self, text: str) -> str:
        """Structure the content with proper sections and formatting."""
        # Split by sentences and restructure
        sentences = re.split(r'[.!?]+', text)
        structured_lines = []
        
        current_section = ""
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
                
            # Check if this is a numbered section
            if re.match(r'^\d+\.', sentence):
                structured_lines.append(f"\n{sentence}")
            # Check if this is a section header
            elif self._is_section_header(sentence):
                structured_lines.append(f"\n{sentence.upper()}:")
            # Check if this is a bullet point
            elif sentence.startswith('- ') or sentence.startswith('• '):
                structured_lines.append(f"• {sentence[2:]}")
            # Regular paragraph
            else:
                structured_lines.append(sentence)
        
        return '\n'.join(structured_lines)
    
    def _is_section_header(self, line: str) -> bool:
        """Check if a line is a section header."""
        line_lower = line.lower()
        
        # Check for common section patterns
        if line.endswith(':'):
            return True
            
        # Check for keywords
        for keyword in self.section_keywords:
            if keyword in line_lower and len(line) < 50:
                return True
                
        return False
    
    def _add_visual_formatting(self, text: str) -> str:
        """Add visual formatting with emojis and spacing."""
        # Add emojis for common sections
        text = text.replace('BEST TIME:', '📅 BEST TIME:')
        text = text.replace('WHEN TO VISIT:', '📅 WHEN TO VISIT:')
        text = text.replace('MUST-VISIT:', '🏛️ MUST-VISIT:')
        text = text.replace('ATTRACTIONS:', '🏛️ ATTRACTIONS:')
        text = text.replace('DESTINATIONS:', '🏛️ DESTINATIONS:')
        text = text.replace('ACTIVITIES:', '🎯 ACTIVITIES:')
        text = text.replace('THINGS TO DO:', '🎯 THINGS TO DO:')
        text = text.replace('ACCOMMODATION:', '🏨 ACCOMMODATION:')
        text = text.replace('HOTELS:', '🏨 HOTELS:')
        text = text.replace('TRANSPORTATION:', '🚗 TRANSPORTATION:')
        text = text.replace('GETTING AROUND:', '🚗 GETTING AROUND:')
        text = text.replace('FOOD:', '🍽️ FOOD:')
        text = text.replace('DINING:', '🍽️ DINING:')
        text = text.replace('BUDGET:', '💰 BUDGET:')
        text = text.replace('COST:', '💰 COST:')
        text = text.replace('TIPS:', '💡 TIPS:')
        text = text.replace('ADVICE:', '💡 ADVICE:')
        text = text.replace('NEXT STEPS:', '📋 NEXT STEPS:')
        text = text.replace('PLANNING:', '📋 PLANNING:')
        
        # Clean up multiple newlines
        text = re.sub(r'\n{3,}', '\n\n', text)
        
        return text
