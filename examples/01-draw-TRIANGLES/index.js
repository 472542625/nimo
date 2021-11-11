function createBufferInfoFromArrays(gl, arrays, opt_mapping) {
    const bufferInfo = {
        attribs: createAttribsFromArrays(gl, arrays, opt_mapping),
    }
    let indices = arrays.indices
    if (indices) {
        indices = makeTypedArray(indices, 'indices')
        bufferInfo.indices = createBufferFromTypedArray(gl, indices, gl.ELEMENT_ARRAY_BUFFER)
        bufferInfo.numElements = indices.length
    } else {
        bufferInfo.numElements = getNumElementsFromNonIndexedArrays(arrays)
    }

    return bufferInfo
}

/**1 */

function createAttribsFromArrays(gl, arrays, opt_mapping) {
    const mapping = opt_mapping || createMapping(arrays)
    const attribs = {}
    Object.keys(mapping).forEach(function (attribName) {
        const bufferName = mapping[attribName]
        const origArray = arrays[bufferName]
        if (origArray.value) {
            attribs[attribName] = {
                value: origArray.value,
            }
        } else {
            const array = makeTypedArray(origArray, bufferName)
            attribs[attribName] = {
                buffer: createBufferFromTypedArray(gl, array),
                numComponents: origArray.numComponents || array.numComponents || guessNumComponentsFromName(bufferName),
                type: getGLTypeForTypedArray(gl, array),
                normalize: getNormalizationForTypedArray(array),
            }
        }
    })
    return attribs
}

function allButIndices(name) {
    return name !== 'indices'
}

function createMapping(obj) {
    const mapping = {}
    Object.keys(obj)
        .filter(allButIndices)
        .forEach(function (key) {
            mapping[key] = key
        })
    return mapping
}
function guessNumComponentsFromName(name, length) {
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
function getGLTypeForTypedArray(gl, typedArray) {
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
function getNormalizationForTypedArray(typedArray) {
    if (typedArray instanceof Int8Array) {
        return true
    } // eslint-disable-line
    if (typedArray instanceof Uint8Array) {
        return true
    } // eslint-disable-line
    return false
}
/**2 */

function makeTypedArray(array, name) {
    if (isArrayBuffer(array)) {
        return array
    }

    if (array.data && isArrayBuffer(array.data)) {
        return array.data
    }

    if (Array.isArray(array)) {
        array = {
            data: array,
        }
    }

    if (!array.numComponents) {
        array.numComponents = guessNumComponentsFromName(name, array.length)
    }

    let type = array.type
    if (!type) {
        if (name === 'indices') {
            type = Uint16Array
        }
    }
    const typedArray = createAugmentedTypedArray(array.numComponents, (array.data.length / array.numComponents) | 0, type)
    typedArray.push(array.data)
    return typedArray
}

function isArrayBuffer(a) {
    return a.buffer && a.buffer instanceof ArrayBuffer
}

function createAugmentedTypedArray(numComponents, numElements, opt_type) {
    const Type = opt_type || Float32Array
    return augmentTypedArray(new Type(numComponents * numElements), numComponents)
}

function augmentTypedArray(typedArray, numComponents) {
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

function createBufferFromTypedArray(gl, array, type, drawType) {
    type = type || gl.ARRAY_BUFFER
    const buffer = gl.createBuffer()
    gl.bindBuffer(type, buffer)
    gl.bufferData(type, array, drawType || gl.STATIC_DRAW)
    return buffer
}

/**4 */
const positionKeys = ['position'] //, 'positions', 'a_position'
function getNumElementsFromNonIndexedArrays(arrays) {
    let key
    for (const k of positionKeys) {
        if (k in arrays) {
            key = k
            break
        }
    }
    key = key || Object.keys(arrays)[0]
    const array = arrays[key]
    const length = getArray(array).length
    const numComponents = getNumComponents(array, key)
    const numElements = length / numComponents
    if (length % numComponents > 0) {
        throw new Error(`numComponents ${numComponents} not correct for length ${length}`)
    }
    return numElements
}
function getArray(array) {
    return array.length ? array : array.data
}
function getNumComponents(array, arrayName) {
    return array.numComponents || array.size || guessNumComponentsFromName(arrayName, getArray(array).length)
}

let canvas = document.getElementById('webgl')
const gl = canvas.getContext('webgl')
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight
let renderer = new THREE.WebGLRenderer({ canvas })
document.body.appendChild(renderer.domElement)

let material1 = new THREE.ShaderMaterial({
    fragmentShader: `
    precision mediump float;
    uniform vec4 color;
    uniform float opacity;
    void main(){
        gl_FragColor = vec4(color.xyz,opacity);
    }    
    `,
    vertexShader: `
    attribute vec3 position;
        void main() {
           gl_Position = vec4(position,1.0);
    }
    `,
    uniforms: {
        // opacity: {
        //     type: 'float',
        //     value: 0.6,
        // },
        // color: {
        //     type: 'vec4',
        //     value: [1.0, 1.0, 0.0, 1.0],
        // },
        opacity: 0.6,
        color: [1.0, 1.0, 0.0, 1.0],
    },
})

let mesh1 = {
    buffer: createBufferInfoFromArrays(gl, {
        position: new Float32Array([-1.0, 0.5, 0.0, 0.25, -1.0, 0.0, 0.1, 0, 0.0]),
    }),
    material: material1,
}

let material2 = new THREE.ShaderMaterial({
    fragmentShader: `
    precision mediump float;//123
    uniform vec4 color;
    uniform float opacity;
    void main(){
        gl_FragColor = vec4(color.xyz,opacity);
    }    
    `,
    vertexShader: `
    attribute vec3 position;
        void main() {
           gl_Position = vec4(position,1.0);
    }
    `,
    uniforms: {
        // opacity: {
        //     type: 'float',
        //     value: 0.6,
        // },
        // color: {
        //     type: 'vec4',
        //     value: [1.0, 1.0, 0.0, 1.0],
        // },
        opacity: 0.6,
        color: [1.0, 0.0, 0.0, 1.0],
    },
})

let mesh2 = {
    buffer: createBufferInfoFromArrays(gl, {
        position: new Float32Array([0.0, 0.6, -0.5, 0.0, -0.5, -0.5, 0.5, -0.5, -0.5]),
    }),
    material: material2,
}
let scene = new THREE.Scene()
scene.add(mesh1)
scene.add(mesh2)
renderer.render(scene)
