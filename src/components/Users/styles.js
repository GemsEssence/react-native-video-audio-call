import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#0093E9',
    height: 60,
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    elevation: 6.0,
    borderBottomColor: 'lightgrey',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  body: {
    padding: 5,
  },
  listItemContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    height: 60,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    borderColor: 'lightgrey',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  callBtn: {
    padding: 8,
  },
  outerCircle: {
    opacity: 0.5,
    padding: 8,
    borderRadius: 50,
    marginRight: 10,
  },
  innerCircle: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 50,
    borderWidth: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
