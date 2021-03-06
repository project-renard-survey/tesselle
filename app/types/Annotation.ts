import uuid from 'uuid';
import { Feature, Polygon, Point, MultiPolygon } from 'geojson';
import { Record, Map } from 'immutable';
import { pipe } from 'ramda';
import { SupportedShapes } from 'types';

interface AnnotationProperties extends Record<AnnotationProperties> {
  id: string;
  content: string;
  type: SupportedShapes;
}

export interface AnnotationCircleProperties extends Record<AnnotationProperties> {
  radius: number;
  type: SupportedShapes.circle;
}

const makeAnnotationProperties = Record({
  id: 'emptyId',
  content: '',
  type: SupportedShapes.rectangle,
}, 'AnnotationProperties');

const makeAnnotationCircleProperties = Record({
  id: 'emptyId',
  content: '',
  radius: 0,
  type: SupportedShapes.circle,
}, 'AnnotationCircleProperties');

const isIdededed = (properties: Map<string, any>): Map<string, any> => {
  const id = properties.get('id');
  if (id === 'emptyId' || id === undefined) {
    return properties.set('id', uuid());
  }
  return properties;
};

export const annotationPropertiesCreator: Record.Factory<AnnotationProperties> = pipe(
  isIdededed,
  makeAnnotationProperties,
);
export const annotationCirclePropertiesCreator: Record.Factory<AnnotationCircleProperties> = pipe(
  isIdededed,
  makeAnnotationCircleProperties,
);

export type AcceptedGeojsonGeometries = Point | Polygon | MultiPolygon | null;
export type AcceptedGeojsonProperties = AnnotationProperties | AnnotationCircleProperties;

export default interface Annotation<
    G extends AcceptedGeojsonGeometries | null = Polygon,
    P extends AcceptedGeojsonProperties | null = AnnotationProperties
  > extends Feature<G, P>, Record<Annotation> {

}
