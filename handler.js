'use strict'

const S3 = require('aws-sdk/clients/s3')
const uuid = require('uuid').v4
const GM = require('gm')

// Object creation, should ideally be in a factory/DI module
const s3 = new S3()
const gm = GM.subClass({ imageMagick: true })

module.exports.upload = async (event) => {

  // Check for image in correct format
  if (!event.isBase64Encoded) {
    return { statusCode: 400, body: JSON.stringify({ message: 'Invalid input, provide base64 encoded image' }) }
  }

  const id = uuid()
  const buf = Buffer.from(event.body, 'base64')

  const param = {
    Key: id,
    Bucket: process.env.BUCKET_NAME,
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: event.headers["content-type"]
  }

  const identityPromise = new Promise((resolve, reject) => {
    gm(buf).identify((err, data) => {
      if (err) return reject(err)

      return resolve(data)
    })
  })

  return identityPromise
    .then((identity) => {

      const paramImage = {
        Key: id,
        Bucket: process.env.BUCKET_NAME,
        Body: buf,
        ContentEncoding: 'base64',
        ContentType: event.headers["content-type"]
      }

      const paramMeta = {
        Key: `${id}_meta.json`,
        Bucket: process.env.BUCKET_NAME,
        Body: JSON.stringify(identity),
        ContentType: 'application/json'
      }

      const promises = Promise.all([
        s3.putObject(paramImage).promise(),
        s3.putObject(paramMeta).promise()
      ])

      return promises
        .then(() => {
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Image uploaded successfully' })
          }
        })
    })
    .catch((e) => {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: e.message })
      }
    })
}

module.exports.auth = async (event) => {
  const sources = event.identitySource

  // Find the identity from any of the source keys, just use the last available one now
  const key = sources.reduce((carry, current) => current, null)

  return {
    // TODO be better than this
    isAuthorized: (key === "demo"),
    context: {
      authorizationKey: key
    }
  }
}