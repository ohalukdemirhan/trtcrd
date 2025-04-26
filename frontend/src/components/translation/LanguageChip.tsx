import React from 'react';

interface LanguageChipProps {
  code: string;
  name: string;
  selected?: boolean;
  onClick?: () => void;
}

/**
 * Language selection chip with flag icon
 */
export const LanguageChip: React.FC<LanguageChipProps> = ({
  code,
  name,
  selected = false,
  onClick,
}) => {
  // Get flag emoji based on language code
  const getFlagEmoji = (langCode: string) => {
    // For simplicity, we're using the first two letters of the language code
    // as country code for the flag emoji
    const countryCode = langCode.substring(0, 2).toUpperCase();
    const codePoints = Array.from(countryCode).map(c => c.charCodeAt(0) + 127397);
    return String.fromCodePoint(...codePoints);
  };

  const chipClasses = `language-chip ${selected ? 'language-chip-selected' : ''} transform transition-all duration-200 hover:scale-105 active:scale-95`;

  return (
    <div
      className={chipClasses}
      onClick={onClick}
    >
      <span className="mr-1.5">{getFlagEmoji(code)}</span>
      <span>{name}</span>
    </div>
  );
}; 