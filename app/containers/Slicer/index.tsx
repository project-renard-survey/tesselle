/**
 *
 * Slicer
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectSlicer from './selectors';
import reducer from './reducer';
import saga from './saga';
import LoadingModal from 'components/LoadingModal';
import './styles.css';

function Slicer(props) {
  console.log(props.slicer.total, props.slicer.present);
  return (
    <div>
      {props.slicer.total === props.slicer.present && <LoadingModal
        isActive
        headerContent="Nice content"
        footerContent={[<button key="coucou">Coucou</button>]}>
        <progress
            className="progress is-primary"
            value="50"
            max="100" />
          {/* <progress
            className="progress is-primary"
            value={`${(props.slicer.present / props.slicer.total) * 100}`}
            max="100">{Math.floor(props.slicer.present / props.slicer.total) * 100}</progress> */}
      </LoadingModal>}
        {props.children}
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  slicer: makeSelectSlicer(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'slicer', reducer: reducer });
const withSaga = injectSaga({ key: 'slicer', saga: saga });

export const slicerContainer = compose(
  withReducer,
  withSaga,
  withConnect,
);

export default slicerContainer(Slicer);