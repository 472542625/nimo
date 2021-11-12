export class BufferGeometry {
    constructor() {
        this.positionKeys = ['position'] //, 'positions', 'a_position'
        this.attributes = {}
    }

    createBufferInfoFromArrays(gl, arrays, opt_mapping) {
        const bufferInfo = {
            attribs: this.createAttribsFromArrays(gl, arrays, opt_mapping),
        }
        let indices = arrays.indices
        if (indices) {
            indices = this.makeTypedArray(indices, 'indices')
            bufferInfo.indices = this.createBufferFromTypedArray(gl, indices, gl.ELEMENT_ARRAY_BUFFER)
            bufferInfo.numElements = indices.length
        } else {
            bufferInfo.numElements = this.getNumElementsFromNonIndexedArrays(arrays)
        }
        return bufferInfo
    }

    /**1 */

    createAttribsFromArrays(gl, arrays, opt_mapping) {
        const mapping = opt_mapping || this.createMapping(arrays)
        const attribs = {}
        Object.keys(mapping).forEach((attribName) => {
            const bufferName = mapping[attribName]
            const origArray = arrays[bufferName]
            if (origArray.value) {
                attribs[attribName] = {
                    value: origArray.value,
                }
            } else {
                const array = this.makeTypedArray(origArray, bufferName)
                attribs[attribName] = {
                    buffer: this.createBufferFromTypedArray(gl, array),
                    numComponents: origArray.numComponents || array.numComponents || this.guessNumComponentsFromName(bufferName),
                    type: this.getGLTypeForTypedArray(gl, array),
                    normalize: this.getNormalizationForTypedArray(array),
                }
            }
        })
        return attribs
    }

    allButIndices(name) {
        return name !== 'indices'
    }

    createMapping(obj) {
        const mapping = {}
        Object.keys(obj)
            .filter(this.allButIndices)
            .forEach(function (key) {
                mapping[key] = key
            })
        return mapping
    }
    guessNumComponentsFromName(name, length) {
        let numComponents
        if (name.indexOf('coord') >= 0) {
            numComponents = 2
        } else if (name.indexOf('color') >= 0) {
            numComponents = 4
        } else {
            numComponents = 3 // position, normals, indices ...
        }

        if (length % numComponents > 0) {
            throw 'can not guess numComponents. You should specify it.'
        }

        return numComponents
    }
    getGLTypeForTypedArray(gl, typedArray) {
        if (typedArray instanceof Int8Array) {
            return gl.BYTE
        } // eslint-disable-line
        if (typedArray instanceof Uint8Array) {
            return gl.UNSIGNED_BYTE
        } // eslint-disable-line
        if (typedArray instanceof Int16Array) {
            return gl.SHORT
        } // eslint-disable-line
        if (typedArray instanceof Uint16Array) {
            return gl.UNSIGNED_SHORT
        } // eslint-disable-line
        if (typedArray instanceof Int32Array) {
            return gl.INT
        } // eslint-disable-line
        if (typedArray instanceof Uint32Array) {
            return gl.UNSIGNED_INT
        } // eslint-disable-line
        if (typedArray instanceof Float32Array) {
            return gl.FLOAT
        } // eslint-disable-line
        throw 'unsupported typed array type'
    }
    getNormalizationForTypedArray(typedArray) {
        if (typedArray instanceof Int8Array) {
            return true
        } // eslint-disable-line
        if (typedArray instanceof Uint8Array) {
            return true
        } // eslint-disable-line
        return false
    }
    /**2 */

    makeTypedArray(array, name) {
        if (this.isArrayBuffer(array)) {
            return array
        }

        if (array.data && this.isArrayBuffer(array.data)) {
            return array.data
        }

        if (Array.isArray(array)) {
            array = {
                data: array,
            }
        }

        if (!array.numComponents) {
            array.numComponents = this.guessNumComponentsFromName(name, array.length)
        }

        let type = array.type
        if (!type) {
            if (name === 'indices') {
                type = Uint16Array
            }
        }
        const typedArray = this.createAugmentedTypedArray(array.numComponents, (array.data.length / array.numComponents) | 0, type)
        typedArray.push(array.data)
        return typedArray
    }

    isArrayBuffer(a) {
        return a.buffer && a.buffer instanceof ArrayBuffer
    }

    createAugmentedTypedArray(numComponents, numElements, opt_type) {
        const Type = opt_type || Float32Array
        return this.augmentTypedArray(new Type(numComponents * numElements), numComponents)
    }

    augmentTypedArray(typedArray, numComponents) {
        let cursor = 0
        typedArray.push = function () {
            for (let ii = 0; ii < arguments.length; ++ii) {
                const value = arguments[ii]
                if (value instanceof Array || (value.buffer && value.buffer instanceof ArrayBuffer)) {
                    for (let jj = 0; jj < value.length; ++jj) {
                        typedArray[cursor++] = value[jj]
                    }
                } else {
                    typedArray[cursor++] = value
                }
            }
        }
        typedArray.reset = function (opt_index) {
            cursor = opt_index || 0
        }
        typedArray.numComponents = numComponents
        Object.defineProperty(typedArray, 'numElements', {
            get: function () {
                return (this.length / this.numComponents) | 0
            },
        })
        return typedArray
    }

    /**3 */

    createBufferFromTypedArray(gl, array, type, drawType) {
        type = type || gl.ARRAY_BUFFER
        const buffer = gl.createBuffer()
        gl.bindBuffer(type, buffer)
        gl.bufferData(type, array, drawType || gl.STATIC_DRAW)
        return buffer
    }

    /**4 */

    getNumElementsFromNonIndexedArrays(arrays) {
        let key
        const positionKeys = this.positionKeys
        for (const k of positionKeys) {
            if (k in arrays) {
                key = k
                break
            }
        }
        key = key || Object.keys(arrays)[0]
        const array = arrays[key]
        const length = this.getArray(array).length
        const numComponents = this.getNumComponents(array, key)
        const numElements = length / numComponents
        if (length % numComponents > 0) {
            throw new Error(`numComponents ${numComponents} not correct for length ${length}`)
        }
        return numElements
    }
    getArray(array) {
        return array.length ? array : array.data
    }
    getNumComponents(array, arrayName) {
        return array.numComponents || array.size || this.guessNumComponentsFromName(arrayName, this.getArray(array).length)
    }
}
