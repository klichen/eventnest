import { View, StyleSheet, TextInput, Pressable, Keyboard } from 'react-native';
import Button from './atomics/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState, forwardRef } from 'react';

const SearchBar = forwardRef(({ clicked, setClicked, searchPhrase, setSearchPhrase, handleSubmitSearch, handleCancelSearch }, ref) => {
  const handlePressSearch = ({ nativeEvent: { text: text } }) => {
    console.log(text)
    setSearchPhrase(search)
    setClicked(false)
  }
  return (
    <View style={styles.container}>
      <View
        style={
          clicked
            ? styles.searchBar__clicked
            : styles.searchBar__unclicked
        }
      >
        <Ionicons name="search" size={16} />
        <TextInput
          ref={ref}
          style={styles.input}
          placeholder="Search"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          returnKeyType='search'
          onFocus={() => {
            setClicked(true);
          }}

          onSubmitEditing={handleSubmitSearch}
        />
        {clicked && (
          <Pressable onPress={() => {
            setSearchPhrase("")
          }}>
            <Ionicons name="close" size={16} color="black" style={{ padding: 1 }} />
          </Pressable>
        )}
      </View>
      {/* cancel button, depending on whether the search bar is clicked or not */}
      {clicked && (
        <View>
          <Button
            title="Cancel"
            textColor='#007FA3'
            textWeight='medium'
            onPress={handleCancelSearch}
          />
        </View>
      )}
    </View>
  );
});
export default SearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,

  },
  searchBar__unclicked: {
    padding: 8,
    flexGrow: 1,
    flexDirection: "row",
    backgroundColor: "#d9dbda",
    borderRadius: 8,
    alignItems: "center",
  },
  searchBar__clicked: {
    padding: 8,
    flexDirection: "row",
    width: "85%",
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#007FA3',
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  input: {
    fontSize: 16,
    marginLeft: 10,
    width: "80%",
  },
});