import React, {useState} from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';
import {uploadUrl} from '../utils/variables';

const ListItem = ({navigation, singleMedia}) => {
  const [modalOpen, setmodalOpen] = useState(false);

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('Single', {file: singleMedia})}
    >
      <Modal visible={modalOpen} animationType="slide">
        <View style={styles.modalContent}>
          <View style={styles.modalView}>
            <Text style={styles.headerText}>Filename Image: </Text>
            <Image
              style={styles.mediaFilename}
              source={{uri: uploadUrl + singleMedia.filename}}
            />

            <TouchableHighlight
              style={{...styles.openButton, backgroundColor: '#2196F3'}}
              onPress={() => {
                setmodalOpen(!modalOpen);
              }}
            >
              <Text style={styles.textStyle}>Go Back</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      <View style={styles.imagebox}>
        <Image
          style={styles.image}
          source={{uri: uploadUrl + singleMedia.thumbnails.w160}}
        />
      </View>
      <View style={styles.textbox}>
        <Text style={styles.listTitle}>{singleMedia.title}</Text>
        <Text>{singleMedia.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 5,
    backgroundColor: 'lightblue',
    borderRadius: 6,
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingBottom: 15,
  },
  imagebox: {
    flex: 1,
  },
  image: {
    flex: 1,
    borderRadius: 6,
  },
  textbox: {
    flex: 2,
    padding: 10,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'lightblue',
    borderRadius: 20,
    padding: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 4,
    },
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'purple',
  },
  mediaFilename: {
    height: 200,
    width: 200,
  },
});

export default ListItem;
