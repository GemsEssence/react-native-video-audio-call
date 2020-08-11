import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {isEmpty} from 'lodash';
import {CommonActions} from '@react-navigation/native';

const Entry = (props) => {
  useEffect(() => {
    if (!isEmpty(props.currentUser)) {
      setTimeout(() => {
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Users'}],
          }),
        );
      }, 100);
    } else {
      setTimeout(() => {
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Home'}],
          }),
        );
      }, 100);
    }
  }, []);
  return null;
};

const mapStateToProps = (state) => ({
  currentUser: state.Users.currentUser,
});

export default connect(mapStateToProps)(Entry);
