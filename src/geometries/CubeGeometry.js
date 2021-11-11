class CubeGeometry {
    constructor(
        radius,
        subdivisionsAxis,
        subdivisionsHeight,
        opt_startLatitudeInRadians,
        opt_endLatitudeInRadians,
        opt_startLongitudeInRadians,
        opt_endLongitudeInRadians
    ) {
        this.radius = radius
        this.subdivisionsAxis = subdivisionsAxis
        this.subdivisionsHeight = subdivisionsHeight
        this.opt_startLatitudeInRadians = opt_startLatitudeInRadians
        this.opt_endLatitudeInRadians = opt_endLatitudeInRadians
        this.radopt_startLongitudeInRadiansius = opt_startLongitudeInRadians
        this.opt_endLongitudeInRadians = opt_endLongitudeInRadians

        if (subdivisionsAxis <= 0 || subdivisionsHeight <= 0) {
            throw Error('subdivisionAxis and subdivisionHeight must be > 0')
        }

        opt_startLatitudeInRadians = opt_startLatitudeInRadians || 0
        opt_endLatitudeInRadians = opt_endLatitudeInRadians || Math.PI
        opt_startLongitudeInRadians = opt_startLongitudeInRadians || 0
        opt_endLongitudeInRadians = opt_endLongitudeInRadians || Math.PI * 2

        const latRange = opt_endLatitudeInRadians - opt_startLatitudeInRadians
        const longRange = opt_endLongitudeInRadians - opt_startLongitudeInRadians

        // We are going to generate our sphere by iterating through its
        // spherical coordinates and generating 2 triangles for each quad on a
        // ring of the sphere.
        const numVertices = (subdivisionsAxis + 1) * (subdivisionsHeight + 1)
        const positions = this.createAugmentedTypedArray(3, numVertices)
        const normals = this.createAugmentedTypedArray(3, numVertices)
        const texCoords = this.createAugmentedTypedArray(2, numVertices)

        // Generate the individual vertices in our vertex buffer.
        for (let y = 0; y <= subdivisionsHeight; y++) {
            for (let x = 0; x <= subdivisionsAxis; x++) {
                // Generate a vertex based on its spherical coordinates
                const u = x / subdivisionsAxis
                const v = y / subdivisionsHeight
                const theta = longRange * u + opt_startLongitudeInRadians
                const phi = latRange * v + opt_startLatitudeInRadians
                const sinTheta = Math.sin(theta)
                const cosTheta = Math.cos(theta)
                const sinPhi = Math.sin(phi)
                const cosPhi = Math.cos(phi)
                const ux = cosTheta * sinPhi
                const uy = cosPhi
                const uz = sinTheta * sinPhi
                positions.push(radius * ux, radius * uy, radius * uz)
                normals.push(ux, uy, uz)
                texCoords.push(1 - u, v)
            }
        }

        const numVertsAround = subdivisionsAxis + 1
        const indices = this.createAugmentedTypedArray(3, subdivisionsAxis * subdivisionsHeight * 2, Uint16Array)
        for (let x = 0; x < subdivisionsAxis; x++) {
            for (let y = 0; y < subdivisionsHeight; y++) {
                // Make triangle 1 of quad.
                indices.push((y + 0) * numVertsAround + x, (y + 0) * numVertsAround + x + 1, (y + 1) * numVertsAround + x)

                // Make triangle 2 of quad.
                indices.push((y + 1) * numVertsAround + x, (y + 0) * numVertsAround + x + 1, (y + 1) * numVertsAround + x + 1)
            }
        }
        this.positions = positions
        this.normals = normals
        this.texCoords = texCoords
        this.indices = indices
    }
    getBufferInfo() {
        return {
            position: this.ppositions,
            normal: this.normals,
            texcoord: this.texCoords,
            indices: this.indices,
        }
    }

    createFlattenedFunc(vertFunc) {
        return function (gl, ...args) {
            let vertices = vertFunc(...args)
            vertices = deindexVertices(vertices)
            vertices = makeRandomVertexColors(vertices, {
                vertsPerColor: 6,
                rand: function (ndx, channel) {
                    return channel < 3 ? (128 + Math.random() * 128) | 0 : 255
                },
            })
            return this.createBufferInfoFromArrays(gl, vertices)
        }
    }

    createBufferInfoFromArrays(gl, arrays, opt_mapping) {
        const bufferInfo = {
            attribs: this.createAttribsFromArrays(gl, arrays, opt_mapping),
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
    createAttribsFromArrays(gl, arrays, opt_mapping) {
        const mapping = opt_mapping || this.createMapping(arrays)
        const attribs = {}
        Object.keys(mapping).forEach(function (attribName) {
            const bufferName = mapping[attribName]
            const origArray = arrays[bufferName]
            if (origArray.value) {
                attribs[attribName] = {
                    value: origArray.value,
                }
            } else {
                const array = this.makeTypedArray(origArray, bufferName)
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

    allButIndices(name) {
        return name !== 'indices'
    }

    createMapping(obj) {
        const mapping = {}
        let self = this
        Object.keys(obj)
            .filter(self.allButIndices)
            .forEach(function (key) {
                mapping['a_' + key] = key
            })
        return mapping
    }
}
export { CubeGeometry }
