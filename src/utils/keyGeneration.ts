import '../metadata'

import { Key, Value } from '../Datastore/Datastore'
import { BaseEntity, EntityConstructor } from '../Entity/Entity'
import { ColumnMetadata } from '../Column/columnMetadata'
import { getPrimaryColumn, getPrimaryColumnValue } from './columns'
import { getDatastore } from './datastore'
import { getConstructor, getEntityMetadata } from './entities'
import { RelationshipMetadata } from '../Relationship/relationshipMetadata'

const getEntityKey = (constructor: EntityConstructor): Key => {
  const entityMetadata = getEntityMetadata(constructor)
  return entityMetadata.key
}

// Author:UUID-HERE:name
// or, if singleton, ApplicationConfiguration:password
export const generatePropertyKey = (
  instance: BaseEntity,
  metadata: ColumnMetadata | RelationshipMetadata
): Key => {
  const constructor = getConstructor(instance)
  const datastore = getDatastore(constructor)
  const items = [getEntityKey(constructor)]
  const primaryColumn = getPrimaryColumn(constructor)

  if (primaryColumn) {
    items.push(getPrimaryColumnValue(instance))
  }

  items.push(metadata.key)

  return items.join(datastore.keySeparator)
}

// Author:email:abc@xyz.com
export const generateIndexablePropertyKey = (
  constructor: EntityConstructor,
  columnMetadata: ColumnMetadata,
  value: Value
): Key => {
  const datastore = getDatastore(constructor)
  return [getEntityKey(constructor), columnMetadata.key, value].join(
    datastore.keySeparator
  )
}

// UUID-HERE
// or, if singleton, ApplicationConfiguration
export const generateRelationshipKey = (instance: BaseEntity): Key => {
  const constructor = getConstructor(instance)
  const primaryColumn = getPrimaryColumn(constructor)

  if (primaryColumn) {
    return getPrimaryColumnValue(instance)
  }

  return getEntityKey(constructor)
}

// Author:UUID-HERE:passport
export const generateOneRelationshipKey = (
  instance: BaseEntity,
  relationshipMetadata: RelationshipMetadata
): Key => {
  const constructor = getConstructor(instance)
  const datastore = getDatastore(constructor)
  const items = [getEntityKey(constructor)]
  const primaryColumn = getPrimaryColumn(constructor)

  if (primaryColumn) {
    items.push(getPrimaryColumnValue(instance))
  }

  items.push(relationshipMetadata.key)

  return items.join(datastore.keySeparator)
}

// Author:UUID-HERE:books:UUID-HERE
export const generateManyRelationshipKey = (
  instance: BaseEntity,
  relationshipMetadata: RelationshipMetadata,
  relationshipInstance: BaseEntity
): Key => {
  const constructor = getConstructor(instance)
  const datastore = getDatastore(constructor)

  return [
    generatePropertyKey(instance, relationshipMetadata),
    generateRelationshipKey(relationshipInstance),
  ].join(datastore.keySeparator)
}

export const generateManyRelationshipSearchKey = (
  instance: BaseEntity,
  relationshipMetadata: RelationshipMetadata
): Key => {
  const constructor = getConstructor(instance)
  const datastore = getDatastore(constructor)

  return `${generatePropertyKey(instance, relationshipMetadata)}${
    datastore.keySeparator
  }`
}
