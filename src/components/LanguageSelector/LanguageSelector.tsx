import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage, Language } from '../../contexts/LanguageContext';
import { styles } from './styles';

export const LanguageSelector: React.FC = () => {
  const { colors: themeColors } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'ca', name: t('language.catalan'), flag: '🏴󠁥󠁳󠁣󠁴󠁿' },
    { code: 'es', name: t('language.spanish'), flag: '🇪🇸' },
    { code: 'en', name: t('language.english'), flag: '🇬🇧' },
  ];

  const handleLanguageChange = (languageCode: Language) => {
    setLanguage(languageCode);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>
        {t('about.language')}
      </Text>
      
      <View style={styles.languageOptions}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageButton,
              { 
                backgroundColor: language === lang.code ? themeColors.primary : themeColors.surface,
                borderColor: themeColors.border,
              }
            ]}
            onPress={() => handleLanguageChange(lang.code)}
          >
            <Text style={styles.flag}>{lang.flag}</Text>
            <Text
              style={[
                styles.languageName,
                { color: language === lang.code ? themeColors.white : themeColors.text }
              ]}
            >
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};