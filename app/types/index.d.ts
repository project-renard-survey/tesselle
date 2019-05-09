import { Reducer, Store } from 'redux';
import { RouterState } from 'connected-react-router';
import { ILanguageProviderProps } from 'containers/LanguageProvider';
import { ContainerState as EditorState } from '../containers/Editor/types';
import { ContainerState as PlayerState } from '../containers/Player/types';
import Annotation from './Annotation';

export interface LifeStore extends Store<{}> {
  injectedReducers?: any;
  injectedSagas?: any;
  runSaga(saga: () => IterableIterator<any>, args: any): any;
}

interface WithAnnotationProps {
  readonly annotation: Annotation;
}

export declare const enum SupportedShapes {
  rectangle = 'rectangle',
  circle = 'circle',
  point = 'point',
  polygon = 'polygon',
  polyline = 'polyline',
  selector = 'selector',
}

export interface InjectReducerParams {
  key: keyof ApplicationRootState;
  reducer: Reducer<any, any>;
}

export interface InjectSagaParams {
  key: keyof ApplicationRootState;
  saga: () => IterableIterator<any>;
  mode?: string | undefined;
}

// Your root reducer type, which is your redux state types also
export interface ApplicationRootState {
  readonly router: RouterState;
  readonly language: ILanguageProviderProps;
  readonly editor: EditorState;
  readonly player: PlayerState;
  // for testing purposes
  readonly test: any;
}
