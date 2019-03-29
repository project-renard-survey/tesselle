/*
 *
 * Editor reducer
 *
 */

// import { combineReducers } from 'redux';

import ActionTypes from './constants';
import { ContainerState, ContainerActions } from './types';
import Slideshow from 'types/Slideshow';
import Annotation from 'types/Annotation';

import { when, equals } from 'ramda';
import { fromJS } from 'utils/geo';
import { isImmutable, Set, isCollection } from 'immutable';

export const initialState: ContainerState = {
  slideshow: null,
  selectedAnnotations: Set(),
  map: null,
};

function selectionReducer(state: ContainerState, action: ContainerActions) {
  if (isCollection(action.payload)) {
    return {
      ...state,
      selectedAnnotations: action.payload,
    };
  } else if (isImmutable(action.payload)) {
    return {
      ...state,
      selectedAnnotations: state.selectedAnnotations.add(action.payload as Annotation),
    };
  } else if (action.payload === undefined) {
    return {
      ...state,
      selectedAnnotations: initialState.selectedAnnotations,
    };
  }
  throw new Error('selectionReducer case');
  return state;
}

function editorReducer(state: ContainerState = initialState, action: ContainerActions) {
  if (state.slideshow) {
    switch (action.type) {
      case ActionTypes.CHANGE_SELECTED_ANNOTATION:
        return selectionReducer(state, action);
      case ActionTypes.CHANGE_ORDER:
        return {
          ...state,
          slideshow: state.slideshow.set(
            'annotations',
            action.payload,
          ),
        };
      case ActionTypes.CREATE_ANNOTATION:
        const annotation: Annotation = fromJS(action.payload);
        return {
          ...state,
          slideshow: state.slideshow.with({
            annotations: state.slideshow.annotations.push(
              annotation,
            ),
          }),
          selectedAnnotations: Set([annotation]),
        };
      case ActionTypes.EDIT_ANNOTATION:
        return {
          ...state,
          slideshow: state.slideshow.set(
            'annotations',
            state.slideshow.annotations.map(
              when(
                equals(action.payload.annotation),
                (annotation: Annotation) => annotation.merge(
                  isImmutable(action.payload.editedFeature)
                  ? action.payload.editedFeature
                  : fromJS(action.payload.editedFeature),
                ),
              ),
            ),
          ),
        };
      case ActionTypes.REMOVE_ANNOTATION:
        return {
          ...state,
          selectedAnnotations: state.selectedAnnotations.remove(action.payload),
          slideshow: state.slideshow.set(
            'annotations',
            state.slideshow.annotations.remove(
              state.slideshow.annotations.indexOf(action.payload),
            ),
          ),
        };
    }
  }
  switch (action.type) {
    case ActionTypes.CREATE_SLIDESHOW_SUCCESS:
      return {
        ...state,
        slideshow: new Slideshow({
          id: action.payload.id,
          image: action.payload.image,
          annotations: action.payload.annotations.map(fromJS),
        }),

      };
    case ActionTypes.SET_MAP:
      if (state.map !== action.payload) {
        return {
          ...state,
          map: action.payload,
        };
      }
      return state;
    default:
      return state;
  }
}

export default editorReducer;
