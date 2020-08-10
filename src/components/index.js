import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {isEmpty} from 'lodash';

const Entry = (props) => {
  useEffect(() => {
    if (!isEmpty(props.currentUser)) {
      setTimeout(() => props.navigation.navigate('Users'), 100);
    } else {
      setTimeout(() => props.navigation.navigate('Home'), 100);
    }
  }, []);
  return null;
};

const mapStateToProps = (state) => ({
  currentUser: state.Users.currentUser,
});

export default connect(mapStateToProps)(Entry);
