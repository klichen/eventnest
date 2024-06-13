import { FlatList, View, StyleSheet } from 'react-native';
import RepositoryItem from './RepositoryItem';
import AppBar from './AppBar';
import { useEffect, useState } from 'react';
import useRepositories from '../hooks/useRepositories';

const styles = StyleSheet.create({
  separator: {
    height: 10,
    backgroundColor: 'grey',
    marginBottom: 8
  },

  container: {
    flex: 1
  }
});

const repositories = [
  {
    id: 'jaredpalmer.formik',
    fullName: 'jaredpalmer/formik',
    description: 'Build forms in React, without the tears',
    language: 'TypeScript',
    forksCount: 1589,
    stargazersCount: 21553,
    ratingAverage: 88,
    reviewCount: 4,
    ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/4060187?v=4',
  },
  {
    id: 'rails.rails',
    fullName: 'rails/rails',
    description: 'Ruby on Rails',
    language: 'Ruby',
    forksCount: 18349,
    stargazersCount: 45377,
    ratingAverage: 100,
    reviewCount: 2,
    ownerAvatarUrl: 'https://avatars1.githubusercontent.com/u/4223?v=4',
  },
  {
    id: 'django.django',
    fullName: 'django/django',
    description: 'The Web framework for perfectionists with deadlines.',
    language: 'Python',
    forksCount: 21015,
    stargazersCount: 48496,
    ratingAverage: 73,
    reviewCount: 5,
    ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/27804?v=4',
  },
  {
    id: 'reduxjs.redux',
    fullName: 'reduxjs/redux',
    description: 'Predictable state container for JavaScript apps',
    language: 'TypeScript',
    forksCount: 13902,
    stargazersCount: 52869,
    ratingAverage: 0,
    reviewCount: 0,
    ownerAvatarUrl: 'https://avatars3.githubusercontent.com/u/13142323?v=4',
  },
];


const ItemSeparator = () => <View style={styles.separator} />;

const RepoItem = ({ item }) => <RepositoryItem fullName={item.fullName} description={item.description} language={item.language} />;

const RepositoryList = ({ navigation }) => {
  const { repositories } = useRepositories();
  // fetching is done in hooks
  // const [repositories, setRepositories] = useState();

  // const fetchRepositories = async () => {
  //   // Replace the IP address part with your own IP address!
  //   const response = await fetch('http://100.66.134.233:5000/api/repositories');
  //   const json = await response.json();
  
  //   console.log(json);
  
  //   setRepositories(json);
  // };

  // useEffect(() => {
  //   fetchRepositories();
  // }, []);

  const repositoryNodes = repositories
    ? repositories.edges.map(edge => edge.node)
    : [];
  

  return (
    <View style={styles.container}>
        <AppBar nav={navigation}/>
        <FlatList
        data={repositoryNodes}
        ItemSeparatorComponent={ItemSeparator}
        // other props
        renderItem={RepoItem}
        />
    </View>
  );
};

export default RepositoryList;