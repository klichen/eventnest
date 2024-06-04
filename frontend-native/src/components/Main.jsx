import Constants from 'expo-constants';
import { StyleSheet, View } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native';
import Text from './Text'
import AppBar from './AppBar';
import RepositoryList from './RepositoryList';
import FlexPage from './FlexPage';

const Main = () => {
    return (
        <View>
            <Routes>
                <Route path="/" element={<RepositoryList />} />
                <Route path="/flexpage" element={<FlexPage />} />
            </Routes>
        </View>
      );
  };

export default Main;