'use client';

import { useState } from 'react';
import Icon from '@mdi/react';
import { mdiEarth } from '@mdi/js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'vi', name: 'Tiếng Việt', flag: 'fi-vn' },
  { code: 'en', name: 'English', flag: 'fi-us' },
  { code: 'zh', name: '中文', flag: 'fi-cn' },
  { code: 'ja', name: '日本語', flag: 'fi-jp' },
  { code: 'ko', name: '한국어', flag: 'fi-kr' },
];

export default function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]); //                                                                                                                     Mặc định là tiếng Việt

  const handleSelectLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
        variant="ghost"
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 bg-gray-100">
          <Icon path={mdiEarth} size={0.7} className='text-maintext' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className="flex items-center gap-2 cursor-pointer px-3 py-2"
            onClick={() => handleSelectLanguage(language)}
          >
            <span className={`fi ${language.flag} mr-2`} />

            <span className="flex-1">{language.name}</span>
            {currentLanguage.code === language.code && (
              <span className="w-2 h-2 rounded-full bg-primary"></span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 