import '../metadata'

import { Datastore, Key } from '../Datastore/Datastore'
import { createEntityMetadata, EntityMetadata } from './entityMetadata'
import { setEntityMetadata } from '../utils/entities'

export const ENTITY_KEY = Symbol(`entityMetadata`)

export type PropertyValue = any // eslint-disable-line @typescript-eslint/no-explicit-any
export type PropertyKey = string | number | symbol

export type BaseEntity = Record<PropertyKey, PropertyValue>

export type EntityConstructor<T extends BaseEntity = BaseEntity> = {
  new (...args: any[]): T // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface EntityOptions {
  key?: Key
  datastore: Datastore
}

const assertKeyNotInUse = (
  datastore: Datastore,
  entityMetadata: EntityMetadata,
  constructor: EntityConstructor
): void => {
  // TODO
  // throw new EntitySetupError(constructor, `Key is already in use`)
}

export function Entity(
  { datastore, key }: EntityOptions,
  plugins = {} // eslint-disable-next-line @typescript-eslint/no-explicit-any
): (constructor: EntityConstructor) => any {
  return function<T extends BaseEntity>(
    constructor: EntityConstructor<T>
  ): EntityConstructor<T> {
    const entityMetadata: EntityMetadata = createEntityMetadata(
      {
        datastore,
        key: key || constructor.name,
      },
      plugins
    )

    assertKeyNotInUse(datastore, entityMetadata, constructor)
    setEntityMetadata(constructor, entityMetadata)

    return constructor
  }
}
