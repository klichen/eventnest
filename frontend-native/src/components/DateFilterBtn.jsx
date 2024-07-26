import { View, StyleSheet, Image, Pressable, Modal } from 'react-native';
import IconButton from './atomics/IconButton';
import Text from './atomics/Text';
import Button from './atomics/Button';
import { useState, useEffect } from 'react';
import CalendarPicker from 'react-native-calendar-picker'


const DateFilterBtn = ({ setSelectedStartDate, setSelectedEndDate, handleSubmitDateRange }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const today = new Date()
    
    const handleDateChange = (date, type) => {
      if (type === 'START_DATE') {
        setStartDate(date)
      }
      else {
        setEndDate(date)
      }
    }

    const handleClickApply = () => {
      setModalVisible(!modalVisible)
      setSelectedStartDate(startDate)
      setSelectedEndDate(endDate)
      handleSubmitDateRange()
    }

    return (
        <View>
            <IconButton
                // title='Date'
                iconRight={false}
                iconName='calendar-outline'
                iconColor='black'
                iconSize={32}
                onPress={() => setModalVisible(true)}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <CalendarPicker
                      startFromMonday={true}
                      allowRangeSelection={true}
                      // minDate={minDate}
                      // maxDate={maxDate}
                      todayBackgroundColor="#f2e6ff"
                      selectedDayColor="#007FA3"
                      onDateChange={(date, type) => handleDateChange(date, type)}
                    />
                    <View style={styles.actionBtns}>
                      <Button 
                        title='Cancel'
                        textColor='#007FA3'
                        textWeight='medium'
                        onPress={() => setModalVisible(!modalVisible)}
                        customStyle={styles.calendarBtns}
                      />
                      <Button 
                        title='Apply'
                        textColor='#007FA3'
                        textWeight='medium'
                        onPress={handleClickApply}
                        customStyle={styles.calendarBtns}
                      />
                      {/* <Pressable
                        style={[styles.button]}
                        onPress={() => setModalVisible(!modalVisible)}>
                            <Text color={'primary'}>Close</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.button]}
                        onPress={() => setModalVisible(!modalVisible)}>
                            <Text >Done</Text>
                      </Pressable> */}
                    </View>
                  </View>
                </View>
            </Modal>
        </View>
    );
  };
  
export default DateFilterBtn;

  
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  //   marginTop: 22,
  },
  modalView: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: 16,
    paddingBottom: 40,
    // alignItems: 'center',
  },
  actionBtns: {
    display: 'flex',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8
  },  
  buttonOpen: {
    backgroundColor: '#F194FF',
    padding: 8
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  calendarBtns: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    elevation: 3,
  }
});