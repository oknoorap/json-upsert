import {readFile, writeFileSync, unlinkSync} from 'fs'
import test from 'ava'
import jsonRealtime from '../index'

const exampleFile = './test/example.json'
const jsonFile = () => {
  return new Promise(resolve => {
    readFile(exampleFile, 'ascii', (err, data) => {
      if (err) {
        throw new Error(err)
      }
      resolve(data.toString())
    })
  })
}

writeFileSync(exampleFile, JSON.stringify({
  version: '1.0.0',
  greetings: [],
  object: {},
  object2: {
    object: {
      nested: false
    }
  }
}))

const json = jsonRealtime(exampleFile)

test('example is object', t => {
  t.is(typeof json, 'object')
})

test('example.version is 1.0.0', t => {
  t.is(json.version, '1.0.0')
})

test('example.version (string) should be changed', t => {
  json.version = '1.1.0'
  t.pass()
})

test('example.greetings (array) should be changed', t => {
  json.greetings = ['hello', 'world']
  t.pass()
})

test('example.object (object) should be changed', t => {
  json.object = {
    yo: true
  }
  t.pass()
})

test('example.object2.object.nested (nested object) should be changed', t => {
  json.object2.object.nested = true
  t.pass()
})

test('example.version is 1.1.0', async t => {
  await jsonFile()
    .then(jsonStr => {
      const jsonObj = JSON.parse(jsonStr)
      t.is(json.version, jsonObj.version)
      t.is(jsonObj.version, '1.1.0')
    })
})

test('example.greetings is array', async t => {
  await jsonFile()
    .then(jsonStr => {
      const jsonObj = JSON.parse(jsonStr)
      t.is(json.greetings[0], jsonObj.greetings[0])
      t.is(json.greetings[1], jsonObj.greetings[1])
      t.is(jsonObj.greetings[0], 'hello')
      t.is(jsonObj.greetings[1], 'world')
    })
})

test('example.object.yo is exists', async t => {
  await jsonFile()
    .then(jsonStr => {
      const jsonObj = JSON.parse(jsonStr)
      t.is(json.object.yo, jsonObj.object.yo)
      t.is(typeof jsonObj, 'object')
      t.is(jsonObj.object.yo, true)
    })
})

test('example.object2.object.nested is true', async t => {
  await jsonFile()
    .then(jsonStr => {
      const jsonObj = JSON.parse(jsonStr)
      t.is(json.object2.object.nested, true)
      t.is(jsonObj.object2.object.nested, true)
      t.is(json.object2.object.nested, jsonObj.object2.object.nested)
    })
})

test('`mynumber` is not exists', t => {
  t.is(json.mynumber, undefined)
})

test('example.mynumber should be changed', t => {
  json.mynumber = 10
  t.pass()
})

test('example.mynumber is 10', async t => {
  await jsonFile()
    .then(jsonStr => {
      const jsonObj = JSON.parse(jsonStr)
      t.is(jsonObj.mynumber, 10)
    })
})

// Delete `example.json` after test
test.after(() => {
  unlinkSync(exampleFile)
})
