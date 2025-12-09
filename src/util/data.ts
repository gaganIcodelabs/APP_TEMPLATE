/**
 * Denormalize JSON object.
 * NOTE: Currently, this only handles denormalization of image references
 *
 * @param {JSON} data from Asset API (e.g. page asset)
 * @param {JSON} included array of asset references (currently only images supported)
 * @returns deep copy of data with images denormalized into it.
 */
const denormalizeJsonData = (data: any, included: any[]): any => {
  let copy: any;

  // Handle strings, numbers, booleans, null
  if (data === null || typeof data !== 'object') {
    return data;
  }

  // At this point the data has typeof 'object' (aka Array or Object)
  // Array is the more specific case (of Object)
  if (data instanceof Array) {
    copy = data.map(datum => denormalizeJsonData(datum, included));
    return copy;
  }

  // Generic Objects
  if (data instanceof Object) {
    copy = {} as any;
    Object.entries(data).forEach(([key, value]) => {
      // Handle denormalization of image reference
      const hasImageRefAsValue =
        typeof value == 'object' &&
        (value as any)?._ref?.type === 'imageAsset' &&
        (value as any)?._ref?.id;
      // If there is no image included,
      // the _ref might contain parameters for image resolver (Asset Delivery API resolves image URLs on the fly)
      const hasUnresolvedImageRef =
        typeof value == 'object' && (value as any)?._ref?.resolver === 'image';

      if (hasImageRefAsValue) {
        const foundRef = included.find(
          inc => inc.id === (value as any)._ref?.id,
        );
        copy[key] = foundRef;
      } else if (hasUnresolvedImageRef) {
        // Don't add faulty image ref
      } else {
        copy[key] = denormalizeJsonData(value, included);
      }
    });
    return copy;
  }

  throw new Error("Unable to traverse data! It's not JSON.");
};

/**
 * Denormalize asset json from Asset API.
 * @param {JSON} assetJson in format: { data, included }
 * @returns deep copy of asset data with images denormalized into it.
 */

export const denormalizeAssetData = assetJson => {
  const { data, included = [] } = assetJson || {};
  return denormalizeJsonData(data, included);
};

/**
 * Combine the resource objects form the given api response to the
 * existing entities.
 */
export const updatedEntities = (
  oldEntities: Record<string, any>,
  apiResponse: any,
  sanitizeConfig = {},
) => {
  const { data, included = [] } = apiResponse;
  const objects = (Array.isArray(data) ? data : [data]).concat(included);

  const newEntities = objects.reduce((entities, curr) => {
    const { id, type } = curr;
    const current = curr; // You can add sanitization here if needed

    entities[type] = entities[type] || {};
    entities[type][id.uuid] = current;

    return entities;
  }, oldEntities);

  return newEntities;
};

/**
 * Denormalise the entities with the resources from the entities object
 */
export const denormalisedEntities = (
  entities: Record<string, any>,
  resources: any[],
  throwIfNotFound = true,
) => {
  const denormalised = resources?.map(res => {
    const { id, type } = res;
    const entityFound = entities[type] && id && entities[type][id.uuid];
    if (!entityFound) {
      if (throwIfNotFound) {
        throw new Error(
          `Entity with type "${type}" and id "${id ? id.uuid : id}" not found`,
        );
      }
      return null;
    }
    return entities[type][id.uuid];
  });
  return denormalised.filter(e => !!e);
};
