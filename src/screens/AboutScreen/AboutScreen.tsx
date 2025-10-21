import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSelector } from '../../components/LanguageSelector';
import { styles } from './styles';

export const AboutScreen: React.FC = () => {
  const { colors: themeColors } = useTheme();
  const { t } = useLanguage();

  const openURL = async (url: string, name: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `No se puede abrir ${name}`);
      }
    } catch (error) {
      Alert.alert('Error', `Error al abrir ${name}`);
    }
  };

  const openSpotify = () => {
    openURL('https://open.spotify.com/artist/2PDFLRIcrPY7IhDWsaKXHO?si=8n0l3gZtRcufXrAYHDYZRA', 'Spotify');
  };

  const openInstagram = () => {
    openURL('https://www.instagram.com/boc.oficial/', 'Instagram');
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header with logo */}
        <View style={styles.header}>
          <Image 
            source={require('../../../assets/logoboc.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: themeColors.text }]}>
            {t('about.title')}
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            {t('about.subtitle')}
          </Text>
        </View>

        {/* Language Selector */}
        <LanguageSelector />

        {/* About section */}
        <View style={[styles.section, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            {t('about.project.title')}
          </Text>
          <Text style={[styles.description, { color: themeColors.textSecondary }]}>
            {t('about.project.description1')}
          </Text>
          <Text style={[styles.description, { color: themeColors.textSecondary }]}>
            {t('about.project.description2')}
          </Text>
        </View>

        {/* BOC Info section */}
        <View style={[styles.section, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            {t('about.boc.title')}
          </Text>
          <Text style={[styles.description, { color: themeColors.textSecondary }]}>
            {t('about.boc.description')}
          </Text>
        </View>

        {/* Social media links */}
        <View style={[styles.section, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            {t('about.follow')}
          </Text>
          
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.logoButton}
              onPress={openSpotify}
            >
              <Image 
                source={require('../../../assets/logo-spotify.png')} 
                style={styles.logoOnly}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoButton}
              onPress={openInstagram}
            >
              <Image 
                source={require('../../../assets/instagram-logo.png')} 
                style={styles.logoOnly}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* App info */}
        <View style={[styles.section, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            {t('about.app.title')}
          </Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>{t('about.app.version')}</Text>
            <Text style={[styles.infoValue, { color: themeColors.text }]}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>{t('about.app.developedWith')}</Text>
            <Text style={[styles.infoValue, { color: themeColors.text }]}>React Native + Expo</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>{t('about.app.license')}</Text>
            <Text style={[styles.infoValue, { color: themeColors.text }]}>{t('about.app.free')}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
            {t('about.footer.madeWith')}
          </Text>
          <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
            {t('about.footer.copyright')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};